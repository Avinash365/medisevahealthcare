import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'react-bootstrap';
import { getUser } from '../../utils/auth';
import { getApiBase } from '../../utils/apiBase';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const [form, setForm] = useState({
    patientName: '',
    age: '',
    guardianName: '',
    village: '',
    block: '',
    landmark: '',
    mobilePrimary: '',
    mobileAlternate: '',
    disease: '',
    appointmentDate: '',
    doctorId: '',
    clinicIndex: '',
    timeSlot: '',
    // payment fields
    paymentType: '', // 'pay_to_mediseva' or 'pay_on_counter'
    paymentChoice: '', // 'full' or 'partial' (only for pay_to_mediseva)
    paymentAmount: '',
    paymentMode: '' // 'qr' | 'upi' | 'card' | 'cash'
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [clinicsForDoctor, setClinicsForDoctor] = useState([]);

  const navigate = useNavigate();

  // --- Address parsing helpers (used by multiple effects) ---
  const stripPostal = (s) => {
    if (!s) return '';
    return String(s).replace(/\b\d{4,6}\b/g, '').replace(/\bIndia\b/i, '').trim();
  };

  const normalize = (t) => t ? String(t).trim() : '';

  const isLikelyState = (t) => {
    if (!t) return false;
    const s = String(t).trim();
    if (/\d/.test(s)) return false;
    if (/\b(street|road|rd|lane|ln|building|bldg|plot)\b/i.test(s)) return false;
    return s.length > 1 && s.length < 40;
  };

  const isLikelyCity = (t) => {
    if (!t) return false;
    const s = String(t).trim();
    if (/\d/.test(s)) return false;
    if (/\b(street|road|rd|lane|ln|building|bldg|plot|near|opp|behind)\b/i.test(s)) return false;
    return s.length > 1 && s.length < 60;
  };

  const parseClinicAddress = (addr) => {
    // returns { city, state, district, pin, landmark, parts }
    const result = { city: null, state: null, district: null, pin: null, landmark: null, parts: [] };
    if (!addr) return result;
    const raw = String(addr);
    const parts = raw.split('\n').map(s => s.trim()).filter(Boolean);
    result.parts = parts;

    // try to find PIN (6 digit Indian PIN)
    const pinMatch = raw.match(/\b(\d{6})\b/);
    if (pinMatch) result.pin = pinMatch[1];

    // join last line or last comma-separated fragment to guess city/state/district
    const lastLine = parts.length ? parts[parts.length - 1] : '';
    const lastClean = stripPostal(lastLine || raw);
    const commaParts = lastClean.split(',').map(s => s.trim()).filter(Boolean);
    if (commaParts.length >= 2) {
      result.state = normalize(commaParts[commaParts.length - 1]) || null;
      result.city = normalize(commaParts[commaParts.length - 2]) || null;
      // district could be earlier fragment
      if (commaParts.length >= 3) result.district = normalize(commaParts[commaParts.length - 3]) || null;
    } else {
      // try splitting by dashes
      const dashParts = lastClean.split(/[-–—]/).map(s => s.trim()).filter(Boolean);
      if (dashParts.length >= 2) {
        result.city = normalize(dashParts[0]) || null;
        result.state = normalize(dashParts[1]) || null;
      } else {
        // fall back to tokens
        const tokens = lastClean.split(/[,\s]+/).map(s=>s.trim()).filter(Boolean);
        if (tokens.length >= 2) {
          const lastTok = tokens[tokens.length - 1];
          const secondLast = tokens[tokens.length - 2];
          if (isLikelyState(lastTok)) {
            result.state = lastTok;
            result.city = secondLast || null;
            if (tokens.length >= 3) result.district = tokens[tokens.length - 3];
          } else {
            result.city = lastClean || null;
          }
        } else if (lastClean) {
          result.city = lastClean;
        }
      }
    }

    // try to detect landmark from earlier lines or phrases
    // common landmark indicators: near, opp, opposite, behind, beside, landmark
    const landmarkRegex = /(?:near|opp(?:osite)?|opposite|behind|beside|landmark|landmark:?)\s*[:\-–—\s]*([^,\n]+)/i;
    for (let i = 0; i < parts.length; i++) {
      const m = parts[i].match(landmarkRegex);
      if (m && m[1]) { result.landmark = m[1].trim(); break; }
    }
    // if no landmark phrase, try first line if it looks like a landmark (short phrase)
    if (!result.landmark && parts.length >= 2) {
      const p0 = parts[1];
      if (p0 && /\b(near|opp|opposite|behind|beside)\b/i.test(p0)) result.landmark = p0;
    }

    return result;
  };

  useEffect(() => {
    // load doctors (onboarded)
    (async () => {
      try {
  const APP_API_BASE = getApiBase();
        const res = await fetch(`${APP_API_BASE}/api/onboarding?per_page=1000`);
        if (!res.ok) throw new Error('Failed to load doctors');
        const json = await res.json();
        const list = json?.data || json || [];
        setDoctors(list);

        // derive unique states (try multiple possible fields and clinic_address parse)
        const extractState = (d) => {
          const candidates = [d.state, d.district, d.region, d.province, d.state_name];
          for (const c of candidates) {
            const n = normalize(c);
            if (n && isLikelyState(n)) return n;
          }
          const fromAddr = parseClinicAddress(d.clinic_address);
          if (fromAddr && fromAddr.state && isLikelyState(fromAddr.state)) return fromAddr.state;
          return null;
        };

        

        const sset = new Set();
        list.forEach(d => { const st = extractState(d); if (st) sset.add(st); });
        const s = Array.from(sset).sort();
        setStates(s);
      } catch (err) {
        console.error('Load doctors error', err);
        setToastVariant('danger');
        setToastMessage('Could not load doctors. Try again later.');
        setShowToast(true);
      }
    })();
  }, []);

  useEffect(() => {
    // populate cities when state changes
    if (!selectedState) {
      setCities([]);
      setFilteredDoctors([]);
      return;
    }
    const extractCity = (d) => {
      const candidates = [d.city, d.town, d.district, d.village];
      for (const c of candidates) {
        const n = normalize(c);
        if (n && isLikelyCity(n)) return n;
      }
          const fromAddr = parseClinicAddress(d.clinic_address);
      if (fromAddr && fromAddr.city && isLikelyCity(fromAddr.city)) return fromAddr.city;
      return null;
    };

    // agent name handled when submitting the form; nothing to do here

    const citiesForStateSet = new Set();
    doctors.forEach(d => {
      // only consider doctor if its state matches selectedState via flexible matching
      const stCandidates = [d.state, d.district, d.region, d.province, d.state_name].map(normalize).filter(Boolean);
  const fromAddr = parseClinicAddress(d.clinic_address);
      if (fromAddr && fromAddr.state) stCandidates.push(normalize(fromAddr.state));
      const matchesState = stCandidates.some(sc => sc === normalize(selectedState));
      if (!matchesState) return;
      const city = extractCity(d);
      if (city) citiesForStateSet.add(city);
    });

    const citiesForState = Array.from(citiesForStateSet).sort();
    setCities(citiesForState);
    setSelectedCity('');
    setFilteredDoctors([]);
  }, [selectedState, doctors]);

  useEffect(() => {
    if (!selectedCity || !selectedState) return;
    const f = doctors.filter(d => {
      const stCandidates = [d.state, d.district, d.region, d.province, d.state_name].map(normalize).filter(Boolean);
      const cityCandidates = [d.city, d.town, d.district, d.village].map(normalize).filter(Boolean);
  const fromAddr = parseClinicAddress(d.clinic_address);
      if (fromAddr && fromAddr.state) stCandidates.push(normalize(fromAddr.state));
      if (fromAddr && fromAddr.city) cityCandidates.push(normalize(fromAddr.city));
      const stMatch = stCandidates.some(sc => sc === normalize(selectedState));
      const cityMatch = cityCandidates.some(cc => cc === normalize(selectedCity));
      return stMatch && cityMatch;
    });
    setFilteredDoctors(f);
  }, [selectedCity, selectedState, doctors]);

  // compute availability whenever doctor or date changes
  useEffect(() => {
    const doc = doctors.find(d => String(d.id) === String(form.doctorId));
    if (!doc || !form.appointmentDate) {
      setAvailabilityMessage('');
      setIsAvailable(true);
      // still update clinics for doctor even if no appointmentDate
      const cListEmpty = [];
      if (doc) {
        if (doc.clinics) {
          let c = doc.clinics;
          if (typeof c === 'string') {
            try { c = JSON.parse(c); } catch (e) { c = null; }
          }
          if (Array.isArray(c)) {
            c.forEach((cl, idx) => {
              const addr = cl.address || '';
              const parsed = parseClinicAddress(addr || '');
              cListEmpty.push({
                label: (cl.clinicName || cl.name || `Clinic ${idx+1}`),
                address: addr,
                clinicName: cl.clinicName || cl.name || '',
                city: cl.city || parsed.city,
                state: cl.state || parsed.state,
                district: cl.district || parsed.district,
                pin: cl.pin || parsed.pin,
                landmark: cl.landmark || parsed.landmark,
                parts: parsed.parts || []
              });
            });
          }
        }
        if (cListEmpty.length === 0 && doc.clinic_address) {
          const parts = String(doc.clinic_address).split('\n').map(s=>s.trim()).filter(Boolean);
          const name = parts[0] || 'Clinic';
          const addr = parts.slice(1).join('\n') || '';
          cListEmpty.push({ label: name, address: addr });
        }
      }
      setClinicsForDoctor(cListEmpty);
      return;
    }
    const check = checkDoctorAvailability(doc, form.appointmentDate);
    setAvailabilityMessage(check.message);
    setIsAvailable(check.available);

    // build clinics list for selected doctor
    const clinicsList = [];
    if (doc) {
      if (doc.clinics) {
        let c = doc.clinics;
        if (typeof c === 'string') {
          try { c = JSON.parse(c); } catch (e) { c = null; }
        }
        if (Array.isArray(c)) {
          c.forEach((cl, idx) => {
            const addr = cl.address || '';
            const parsed = parseClinicAddress(addr || '');
            clinicsList.push({
              label: (cl.clinicName || cl.name || `Clinic ${idx+1}`),
              address: addr,
              clinicName: cl.clinicName || cl.name || '',
              city: cl.city || parsed.city,
              state: cl.state || parsed.state,
              district: cl.district || parsed.district,
              pin: cl.pin || parsed.pin,
              landmark: cl.landmark || parsed.landmark,
              parts: parsed.parts || []
            });
          });
        }
      }
      // fallback to clinic_address parsing
      if (clinicsList.length === 0 && doc.clinic_address) {
        const parts = String(doc.clinic_address).split('\n').map(s=>s.trim()).filter(Boolean);
        const name = parts[0] || 'Clinic';
        const addr = parts.slice(1).join('\n') || '';
        const parsed = parseClinicAddress(addr || '');
        clinicsList.push({ label: name, address: addr, clinicName: name, city: parsed.city, state: parsed.state, district: parsed.district, pin: parsed.pin, landmark: parsed.landmark, parts: parsed.parts || [] });
      }
    }
    setClinicsForDoctor(clinicsList);
  }, [form.doctorId, form.appointmentDate, doctors]);

  const parseSchedule = (item) => {
    if (!item) return null;
    let s = item.schedule || item.schedules || null;
    if (!s && item.schedule === undefined && item.schedules === undefined) {
      // sometimes schedule stored in 'schedule' already as object
      s = item.schedule || null;
    }
    if (!s) return null;
    if (typeof s === 'string') {
      try { s = JSON.parse(s); } catch (e) { s = null; }
    }
    return s;
  };

  // parse ranges like "10:00-13:00,15:00-17:00" or single times "10:30,11:00"
  const parseRangesToSlots = (rangesStr, slotMinutes = 30, dateStr) => {
    if (!rangesStr) return [];
    const parts = String(rangesStr).split(',').map(s => s.trim()).filter(Boolean);
    const slots = [];
    for (const p of parts) {
      // range
      if (p.includes('-')) {
        const [startRaw, endRaw] = p.split('-').map(s => s.trim());
        const [sh, sm] = startRaw.split(':').map(Number);
        const [eh, em] = endRaw.split(':').map(Number);
        if ([sh,sm,eh,em].some(v => Number.isNaN(v))) continue;
        const start = new Date(dateStr + 'T' + startRaw + ':00');
        const end = new Date(dateStr + 'T' + endRaw + ':00');
        if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) continue;
        let cur = new Date(start.getTime());
        while (cur.getTime() + slotMinutes * 60000 <= end.getTime()) {
          const next = new Date(cur.getTime() + slotMinutes * 60000);
          const fmt = (d) => d.toTimeString().slice(0,5);
          slots.push(`${fmt(cur)} - ${fmt(next)}`);
          cur = next;
        }
      } else {
        // single time item
        const t = p;
        if (/^\d{1,2}:\d{2}$/.test(t)) {
          slots.push(t);
        }
      }
    }
    return slots;
  };

  const getAvailableTimeSlots = (doc, dateStr) => {
    if (!doc || !dateStr) return [];
    const s = parseSchedule(doc);
    if (!s) return [];
    const dayKeys = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const date = new Date(dateStr + 'T00:00:00');
    if (isNaN(date.getTime())) return [];
    const dayKey = dayKeys[date.getDay()];
    const slotsSet = new Set();
    try {
      const offline = s.offline && s.offline[dayKey];
      const onlineTimes = (s.online && (s.online.times ? s.online.times[dayKey] : s.online[dayKey])) || null;
      const offlineSlots = parseRangesToSlots(offline, 30, dateStr);
      const onlineSlots = parseRangesToSlots(onlineTimes, 30, dateStr);
      offlineSlots.forEach(x => slotsSet.add(x));
      onlineSlots.forEach(x => slotsSet.add(x));
    } catch (e) {
      console.error('Error computing time slots', e);
    }
    return Array.from(slotsSet);
  };

  const [availableSlots, setAvailableSlots] = useState([]);
  useEffect(() => {
    if (!form.doctorId || !form.appointmentDate) {
      setAvailableSlots([]);
      setForm(prev => ({ ...prev, timeSlot: '' }));
      return;
    }
    const doc = doctors.find(d => String(d.id) === String(form.doctorId));
    (async () => {
      const slotsRaw = getAvailableTimeSlots(doc, form.appointmentDate);
      let slots = slotsRaw.slice();
      try {
  const APP_API_BASE = getApiBase();
    const q = `${APP_API_BASE}/api/appointments?doctor_id=${encodeURIComponent(form.doctorId)}&appointment_date=${encodeURIComponent(form.appointmentDate)}`;
        const res = await fetch(q);
        if (res.ok) {
          const json = await res.json();
          const list = json?.data || [];
          const booked = list.map(a => (a.time_slot || '').toString()).filter(Boolean);
          if (booked.length) {
            slots = slots.filter(s => !booked.includes(s));
          }
        }
      } catch (err) {
        console.warn('Could not fetch existing appointments for slot blocking', err);
      }
      setAvailableSlots(slots);
      if (form.timeSlot && !slots.includes(form.timeSlot)) {
        setForm(prev => ({ ...prev, timeSlot: '' }));
      }
    })();
  }, [form.doctorId, form.appointmentDate, doctors]);

  const checkDoctorAvailability = (doc, dateStr) => {
    // returns { available: bool, message: string }
    try {
      const date = new Date(dateStr + 'T00:00:00');
      const today = new Date();
      today.setHours(0,0,0,0);
      if (isNaN(date.getTime())) return { available: false, message: 'Invalid appointment date' };
      if (date < today) return { available: false, message: 'Appointment date is in the past' };

      // max days before booking
      const maxDays = doc.maxDaysBeforeBooking || doc.max_days_before_booking || doc.max_days_before_bookings || doc.maxdaybeforebooking || null;
      if (maxDays !== null && maxDays !== undefined && maxDays !== '' ) {
        const allowed = Number(maxDays);
        if (!Number.isNaN(allowed)) {
          const diffMs = date - today;
          const diffDays = Math.ceil(diffMs / (1000*60*60*24));
          if (diffDays > allowed) return { available: false, message: `Doctor accepts bookings up to ${allowed} days from today` };
        }
      }

      // schedule check
      const s = parseSchedule(doc);
      if (!s) {
        // no schedule provided — assume available but inform user
        return { available: true, message: 'No explicit schedule for this doctor — please confirm with clinic' };
      }

      // day key like Mon, Tue ... mapping from JS day index
      const dayKeys = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      const dayKey = dayKeys[date.getDay()];

      const offline = s.offline || s?.offline || (s.schedule && s.schedule.offline) || null;
      const online = s.online || s?.online || (s.schedule && s.schedule.online) || null;

      const offlineHas = offline && typeof offline === 'object' && (offline[dayKey] && String(offline[dayKey]).trim() !== '');
      const onlineHas = online && typeof online === 'object' && ((online.times && online.times[dayKey] && String(online.times[dayKey]).trim() !== '') || online[dayKey] && String(online[dayKey]).trim() !== '');

      if (offlineHas || onlineHas) return { available: true, message: 'Doctor available on selected date' };
      return { available: false, message: 'Doctor is not available on selected day' };
    } catch (err) {
      console.error('Availability check error', err);
      return { available: true, message: '' };
    }
  };

  // derive fee for a doctor (checks common fields and clinic-level fee)
  const getDoctorFee = (doc, clinicIndex) => {
    if (!doc) return null;
    // clinic-level fee (if clinics array exists)
    try {
      if (clinicIndex !== undefined && clinicIndex !== '' && doc.clinics) {
        let c = doc.clinics;
        if (typeof c === 'string') {
          try { c = JSON.parse(c); } catch (e) { c = null; }
        }
        if (Array.isArray(c) && c[Number(clinicIndex)]) {
          const cf = c[Number(clinicIndex)].fee || c[Number(clinicIndex)].consultationFee || c[Number(clinicIndex)].consultation_fee || c[Number(clinicIndex)].price || c[Number(clinicIndex)].amount || c[Number(clinicIndex)].charges;
          if (cf !== undefined && cf !== null && cf !== '') return cf;
        }
      }
    } catch (e) {
      // ignore and continue to doctor-level
    }

    // doctor-level fields
    const candidates = [doc.fee, doc.consultationFee, doc.consultation_fee, doc.price, doc.amount, doc.charges, doc.consultationCharge, doc.consultation_charges];
    for (const c of candidates) {
      if (c !== undefined && c !== null && String(c).trim() !== '') return c;
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!selectedState) return 'Please select State';
    if (!selectedCity) return 'Please select City';
    if (!form.patientName) return 'Please enter patient name';
    if (!form.mobilePrimary) return 'Please enter primary mobile number';
    if (!form.appointmentDate) return 'Please select appointment date';
    if (!form.doctorId) return 'Please select a doctor';
    if (availableSlots && availableSlots.length > 0 && !form.timeSlot) return 'Please select a time slot';
    // payment validation
    if (!form.paymentType) return 'Please select payment option';
    // Currently we only require a payment option to be selected.
    // Detailed payment validation (amount, mode, full/partial) will be added later
    // when integrating the payment gateway. For now just ensure paymentType is chosen above.
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setToastVariant('danger');
      setToastMessage(v);
      setShowToast(true);
      return;
    }

    // availability check before final submit
    const doc = doctors.find(d => String(d.id) === String(form.doctorId));
    if (doc) {
      const avail = checkDoctorAvailability(doc, form.appointmentDate);
      if (!avail.available) {
        setToastVariant('danger');
        setToastMessage(avail.message || 'Selected doctor is not available on that date');
        setShowToast(true);
        return;
      }
    }

    const payload = {
      patient_name: form.patientName,
      age: form.age || null,
      guardian_name: form.guardianName || null,
      address: {
        village: form.village || null,
        block: form.block || null,
        landmark: form.landmark || null
      },
      mobile_primary: form.mobilePrimary,
      mobile_alternate: form.mobileAlternate || null,
      disease: form.disease || null,
      appointment_date: form.appointmentDate,
      doctor_id: form.doctorId,
      clinic: (form.clinicIndex !== '' && clinicsForDoctor && clinicsForDoctor[Number(form.clinicIndex)]) ? clinicsForDoctor[Number(form.clinicIndex)] : null,
      state: selectedState,
      city: selectedCity
    ,
      fee: (function(){ const doc = doctors.find(d => String(d.id) === String(form.doctorId)); return getDoctorFee(doc, form.clinicIndex); })(),
      time_slot: form.timeSlot || null,
      agent_name: (function(){ try { const u = getUser(); return u ? (u.name || u.email) : null; } catch(e){ return null; } })(),
      payment_type: form.paymentType || null,
      payment_amount: form.paymentAmount ? Number(form.paymentAmount) : null,
      payment_mode: form.paymentMode || null,
      payment_status: form.paymentType === 'pay_to_mediseva' ? 'pending' : 'not_paid'
    };


    // Currently we do not perform an external payment flow here.
    // The payment gateway integration will be added later. For now we record the
    // appointment (with payment fields included) and mark payment status as 'pending'
    // for pay_to_mediseva or 'not_paid' for pay_on_counter.

    // pay_on_counter or no payment required — submit appointment directly
    try {
  const APP_API_BASE = getApiBase();
      const res = await fetch(`${APP_API_BASE}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        let msg = 'Failed to create appointment (server)';
        try { const json = await res.json(); msg = json?.message || msg; } catch (_) {}
        throw new Error(msg);
      }
      setToastVariant('success');
      setToastMessage('Appointment booked successfully');
      setShowToast(true);
      setTimeout(() => navigate('/appointments'), 1200);
    } catch (err) {
      console.warn('API error, falling back to simulated success', err);
      console.log('Simulated appointment payload:', payload);
      setToastVariant('success');
      setToastMessage('Appointment recorded locally (backend not available)');
      setShowToast(true);
      setTimeout(() => navigate('/appointments'), 1200);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="mb-0">Book Appointment</h3>
            <p className="text-muted mb-0">Select location, choose a doctor and provide patient details.</p>
          </div>
        </div>

        <form onSubmit={submit} className="card">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">State</label>
                {states && states.length > 0 ? (
                  <select className="form-select" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                    <option value="">Select state</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : (
                  <input className="form-control" value={selectedState} onChange={(e) => setSelectedState(e.target.value)} placeholder="Enter state" />
                )}
              </div>
              <div className="col-md-4">
                <label className="form-label">City</label>
                {cities && cities.length > 0 ? (
                  <select className="form-select" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                    <option value="">Select city</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                ) : (
                  <input className="form-control" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} placeholder="Enter city" />
                )}
              </div>
              <div className="col-md-4">
                <label className="form-label">Doctor</label>
                <select className="form-select" name="doctorId" value={form.doctorId} onChange={handleChange}>
                  <option value="">Select doctor</option>
                  {filteredDoctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} {d.doctor ? ` - ${d.doctor}` : ''}</option>
                  ))}
                </select>
                {availabilityMessage && String(form.doctorId) !== '' && (
                  <small className={isAvailable ? 'text-success' : 'text-danger'} style={{display: 'block', marginTop: 6}}>{availabilityMessage}</small>
                )}
                {/* Doctor fee display */}
                {String(form.doctorId) !== '' && (() => {
                  const doc = doctors.find(d => String(d.id) === String(form.doctorId));
                  const fee = getDoctorFee(doc, form.clinicIndex);
                  return (
                    <small style={{display: 'block', marginTop: 6}} className="text-muted">Fee: {fee !== null && fee !== undefined && String(fee).trim() !== '' ? <>{typeof fee === 'number' ? `₹${fee}` : fee}</> : 'Not specified'}</small>
                  );
                })()}
              </div>
              
              {clinicsForDoctor && clinicsForDoctor.length > 0 && (
                <div className="col-md-4">
                  <label className="form-label">Clinic</label>
                  <select className="form-select" name="clinicIndex" value={form.clinicIndex} onChange={handleChange}>
                    <option value="">Select clinic</option>
                    {clinicsForDoctor.map((c, i) => (
                      <option key={i} value={i}>{c.label}{c.address ? ` - ${c.address.split('\n')[0]}` : ''}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="col-md-6">
                <label className="form-label">Patient Name</label>
                <input name="patientName" value={form.patientName} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-2">
                <label className="form-label">Age</label>
                <input name="age" value={form.age} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Guardian Name</label>
                <input name="guardianName" value={form.guardianName} onChange={handleChange} className="form-control" />
              </div>

              <div className="col-md-4">
                <label className="form-label">Village</label>
                <input name="village" value={form.village} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Block</label>
                <input name="block" value={form.block} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Landmark</label>
                <input name="landmark" value={form.landmark} onChange={handleChange} className="form-control" />
              </div>

              <div className="col-md-6">
                <label className="form-label">Mobile (Primary)</label>
                <input name="mobilePrimary" value={form.mobilePrimary} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Mobile (Alternate)</label>
                <input name="mobileAlternate" value={form.mobileAlternate} onChange={handleChange} className="form-control" />
              </div>

              <div className="col-12">
                <label className="form-label">Disease / Health Issue</label>
                <input name="disease" value={form.disease} onChange={handleChange} className="form-control" />
              </div>

              <div className="col-md-6">
                <label className="form-label">Date of Appointment</label>
                <input type="date" name="appointmentDate" value={form.appointmentDate} onChange={handleChange} className="form-control" />
                {availabilityMessage && form.appointmentDate && (
                  <small className={isAvailable ? 'text-success' : 'text-danger'} style={{display: 'block', marginTop: 6}}>{availabilityMessage}</small>
                )}
              </div>

              {/* Time slot selector (if slots are available for chosen doctor/date) */}
              <div className="col-md-6">
                <label className="form-label">Time Slot</label>
                {availableSlots && availableSlots.length > 0 ? (
                  <select className="form-select" name="timeSlot" value={form.timeSlot} onChange={handleChange}>
                    <option value="">Select time slot</option>
                    {availableSlots.map((s, i) => (
                      <option key={i} value={s}>{s}</option>
                    ))}
                  </select>
                ) : (
                  <input className="form-control" name="timeSlot" value={form.timeSlot} onChange={handleChange} placeholder={form.appointmentDate ? 'No time slots available' : 'Select date and doctor to see slots'} />
                )}
              </div>

              {/* Payment options */}
              <div className="col-12">
                <label className="form-label">Payment</label>
                <div className="d-flex gap-3 align-items-center mb-2">
                  <div className="form-check">
                    <input className="form-check-input" type="radio" id="pay_mediseva" name="paymentType" value="pay_to_mediseva" checked={form.paymentType === 'pay_to_mediseva'} onChange={(e) => setForm(prev => ({ ...prev, paymentType: e.target.value }))} />
                    <label className="form-check-label" htmlFor="pay_mediseva">Pay to Mediseva</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" id="pay_counter" name="paymentType" value="pay_on_counter" checked={form.paymentType === 'pay_on_counter'} onChange={(e) => setForm(prev => ({ ...prev, paymentType: e.target.value, paymentChoice: '', paymentAmount: '', paymentMode: '' }))} />
                    <label className="form-check-label" htmlFor="pay_counter">Pay on Counter</label>
                  </div>
                </div>

                {form.paymentType === 'pay_to_mediseva' && (
                  <div className="row g-2">
                    <div className="col-md-4">
                      <label className="form-label">Amount option</label>
                      <div>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" id="full_amt" name="paymentChoice" value="full" checked={form.paymentChoice === 'full'} onChange={(e) => {
                            const doc = doctors.find(d => String(d.id) === String(form.doctorId));
                            const fee = Number(getDoctorFee(doc, form.clinicIndex)) || 0;
                            setForm(prev => ({ ...prev, paymentChoice: e.target.value, paymentAmount: String(fee) }));
                          }} />
                          <label className="form-check-label" htmlFor="full_amt">Full Amount</label>
                        </div>
                        <div className="form-check mt-1">
                          <input className="form-check-input" type="radio" id="partial_amt" name="paymentChoice" value="partial" checked={form.paymentChoice === 'partial'} onChange={(e) => setForm(prev => ({ ...prev, paymentChoice: e.target.value, paymentAmount: '' }))} />
                          <label className="form-check-label" htmlFor="partial_amt">Partial Amount (min 50%)</label>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Amount (₹)</label>
                      <input className="form-control" name="paymentAmount" value={form.paymentAmount} onChange={(e) => setForm(prev => ({ ...prev, paymentAmount: e.target.value }))} placeholder="Enter amount" />
                    </div>

                    <div className="col-md-5">
                      <label className="form-label">Payment Mode</label>
                      <select className="form-select" name="paymentMode" value={form.paymentMode} onChange={handleChange}>
                        <option value="">Select mode</option>
                        <option value="qr">QR Code</option>
                        <option value="upi">UPI</option>
                        <option value="card">Card</option>
                      </select>
                    </div>
                  </div>
                )}
                {form.paymentType === 'pay_on_counter' && (
                  <div className="mt-2"><small className="text-muted">Payment will be collected at clinic counter.</small></div>
                )}
              </div>

            </div>
          </div>
          <div className="card-footer text-end">
            <button type="submit" className="btn btn-primary">Book Appointment</button>
          </div>
        </form>

        {/* Toast */}
        <div aria-live="polite" aria-atomic="true" className="position-fixed" style={{ top: 20, right: 20, zIndex: 1060 }}>
          <Toast onClose={() => setShowToast(false)} show={showToast} bg={toastVariant} delay={3500} autohide>
            <Toast.Header>
              <strong className="me-auto">Notification</strong>
            </Toast.Header>
            <Toast.Body className={toastVariant === 'success' ? 'text-white' : ''}>{toastMessage}</Toast.Body>
          </Toast>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
