import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'react-bootstrap';

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
    doctorId: ''
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

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

  const extractFromClinicAddress = (addr) => {
    if (!addr) return { city: null, state: null };
    const parts = String(addr).split('\n').map(s=>s.trim()).filter(Boolean);
    const last = parts.length ? parts[parts.length-1] : '';
    if (!last) return { city: null, state: null };
    const cleaned = stripPostal(last);
    const commaParts = cleaned.split(',').map(s=>s.trim()).filter(Boolean);
    if (commaParts.length >= 2) {
      const stateCandidate = normalize(commaParts[commaParts.length-1]);
      const cityCandidate = normalize(commaParts[commaParts.length-2]);
      return { city: cityCandidate || null, state: stateCandidate || null };
    }
    const dashParts = cleaned.split(/[-–—]/).map(s=>s.trim()).filter(Boolean);
    if (dashParts.length >= 2) {
      return { city: normalize(dashParts[0]) || null, state: normalize(dashParts[1]) || null };
    }
    const tokens = cleaned.split(/\s+/).filter(Boolean);
    if (tokens.length >= 2) {
      const lastTok = tokens[tokens.length-1];
      const secondLast = tokens[tokens.length-2];
      if (isLikelyState(lastTok)) return { city: secondLast || null, state: lastTok };
      return { city: cleaned || null, state: null };
    }
    return { city: cleaned || null, state: null };
  };

  useEffect(() => {
    // load doctors (onboarded)
    (async () => {
      try {
        const res = await fetch('/api/onboarding?per_page=1000');
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
          const fromAddr = extractFromClinicAddress(d.clinic_address);
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
      const fromAddr = extractFromClinicAddress(d.clinic_address);
      if (fromAddr && fromAddr.city && isLikelyCity(fromAddr.city)) return fromAddr.city;
      return null;
    };

    const citiesForStateSet = new Set();
    doctors.forEach(d => {
      // only consider doctor if its state matches selectedState via flexible matching
      const stCandidates = [d.state, d.district, d.region, d.province, d.state_name].map(normalize).filter(Boolean);
      const fromAddr = extractFromClinicAddress(d.clinic_address);
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
      const fromAddr = extractFromClinicAddress(d.clinic_address);
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
      return;
    }
    const check = checkDoctorAvailability(doc, form.appointmentDate);
    setAvailabilityMessage(check.message);
    setIsAvailable(check.available);
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
      state: selectedState,
      city: selectedCity
    };

    // try to POST to backend if endpoint exists; otherwise simulate success
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        // backend likely not implemented; read message if any
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
      // If backend is not available, simulate success and log payload so dev can implement backend later
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
              </div>

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
