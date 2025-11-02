import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Toast } from 'react-bootstrap';


const initialState = {
  doctorName: "",
  regNo: "",
  gender: "",
  birthday: "",
  anniversary: "",
  qualifications: {
    MBBS: false,
    MD: false,
    MS: false,
    FRCS: false,
    Other: ""
  },
  department: "",
  specialty: "",
  searchParameters: "",
  experience: "",
  contact1: "",
  contact2: "",
  email: "",
  clinicName: "",
  address: "",
  clinics: [
    { clinicName: '', address: '', landmark: '', state: '', district: '', city: '', pin: '' }
  ],
  landmark: "",
  state: "",
  district: "",
  city: "",
  pin: "",
  contactPersonName: "",
  contactPersonNo: "",
  consultationFee: "",
  prescriptionValidity: "",
  scheduleOffline: {
    Mon: "",
    Tue: "",
    Wed: "",
    Thu: "",
    Fri: "",
    Sat: "",
    Sun: ""
  },
  scheduleOnline: {
    regular: false,
    pandemic: false,
    times: { Mon: "", Tue: "", Wed: "", Thu: "", Fri: "", Sat: "", Sun: "" }
  },
  maxDaysBeforeBooking: "",
  declaration: false
};

const NewOnboarding = () => {
  const [form, setForm] = useState(initialState);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const navigate = useNavigate();
  const location = useLocation();
  const [editId, setEditId] = useState(null);
  const APP_API_BASE = import.meta.env.VITE_APP_API_BASE;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('editId');
    if (id) {
      setEditId(id);
      // fetch record
      (async () => {
        try {
          const res = await fetch(`${APP_API_BASE}/api/onboarding/${id}`);
          if (!res.ok) throw new Error('Failed to load');
          const json = await res.json();
          const item = json?.data || json;
          if (!item) return;
          // map backend model to form
          const quals = (() => {
            if (!item.qualifications) return initialState.qualifications;
            let q = item.qualifications;
            if (typeof q === 'string') {
              try { q = JSON.parse(q); } catch (e) { q = q.split(',').map(s=>s.trim()).filter(Boolean); }
            }
            const qualObj = { ...initialState.qualifications };
            if (Array.isArray(q)) {
              q.forEach((qq) => {
                if (qualObj.hasOwnProperty(qq)) qualObj[qq] = true;
                else qualObj.Other = qq;
              });
            }
            return qualObj;
          })();

          const clinicParts = (item.clinic_address || '').split('\n');
          const clinicName = clinicParts[0] || '';
          const address = clinicParts.slice(1).join('\n') || '';

          // Load clinics: prefer explicit clinics array from backend, else fallback to clinic_address
          const parsedFallback = parseClinicAddress(address || '');
          let clinicsArr = [{ clinicName: clinicName, address: address, city: parsedFallback.city, state: parsedFallback.state, district: parsedFallback.district, pin: parsedFallback.pin, landmark: parsedFallback.landmark, parts: parsedFallback.parts || [] }];
          if (item.clinics) {
            let c = item.clinics;
            if (typeof c === 'string') {
              try { c = JSON.parse(c); } catch (e) { c = null; }
            }
            if (Array.isArray(c) && c.length) clinicsArr = c.map(x => {
              const addr = x.address || '';
              const p = parseClinicAddress(addr || '');
              return {
                clinicName: x.clinicName || x.name || '',
                address: addr,
                city: x.city || p.city,
                state: x.state || p.state,
                district: x.district || p.district,
                pin: x.pin || p.pin,
                landmark: x.landmark || p.landmark,
                parts: p.parts || []
              };
            });
          }

          const schedule = (() => {
            if (!item.schedule) return { offline: initialState.scheduleOffline, online: initialState.scheduleOnline };
            let s = item.schedule;
            if (typeof s === 'string') {
              try { s = JSON.parse(s); } catch (e) { s = {}; }
            }
            return {
              offline: s.offline || initialState.scheduleOffline,
              online: s.online || initialState.scheduleOnline
            };
          })();

          setForm((prev) => ({
            ...prev,
            doctorName: item.name || '',
            regNo: item.reg_no || '',
            gender: item.gender || '',
            birthday: item.dob ? item.dob.split(' ')[0] : '',
            qualifications: quals,
            department: item.department || '',
            specialty: item.doctor || '',
            contact1: item.contact || '',
            clinicName: clinicName,
            address: address,
            clinics: clinicsArr,
            scheduleOffline: schedule.offline,
            scheduleOnline: schedule.online,
            consultationFee: item.fee || '' ,
            declaration: !!item.declaration
          }));
        } catch (err) {
          console.error('Load onboarding for edit failed', err);
        }
      })();
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleQualChange = (e) => {
    const { name, checked, value } = e.target;
    setForm((prev) => ({
      ...prev,
      qualifications: {
        ...prev.qualifications,
        [name]: name === "Other" ? value : checked
      }
    }));
  };

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

  const parseClinicAddress = (addr) => {
    const result = { city: null, state: null, district: null, pin: null, landmark: null, parts: [] };
    if (!addr) return result;
    const raw = String(addr);
    const parts = raw.split('\n').map(s => s.trim()).filter(Boolean);
    result.parts = parts;
    const pinMatch = raw.match(/\b(\d{6})\b/);
    if (pinMatch) result.pin = pinMatch[1];
    const lastLine = parts.length ? parts[parts.length - 1] : '';
    const lastClean = stripPostal(lastLine || raw);
    const commaParts = lastClean.split(',').map(s => s.trim()).filter(Boolean);
    if (commaParts.length >= 2) {
      result.state = normalize(commaParts[commaParts.length - 1]) || null;
      result.city = normalize(commaParts[commaParts.length - 2]) || null;
      if (commaParts.length >= 3) result.district = normalize(commaParts[commaParts.length - 3]) || null;
    } else {
      const dashParts = lastClean.split(/[-–—]/).map(s => s.trim()).filter(Boolean);
      if (dashParts.length >= 2) {
        result.city = normalize(dashParts[0]) || null;
        result.state = normalize(dashParts[1]) || null;
      } else {
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
    const landmarkRegex = /(?:near|opp(?:osite)?|opposite|behind|beside|landmark|landmark:?)\s*[:\-–—\s]*([^,\n]+)/i;
    for (let i = 0; i < parts.length; i++) {
      const m = parts[i].match(landmarkRegex);
      if (m && m[1]) { result.landmark = m[1].trim(); break; }
    }
    if (!result.landmark && parts.length >= 2) {
      const p0 = parts[1];
      if (p0 && /\b(near|opp|opposite|behind|beside)\b/i.test(p0)) result.landmark = p0;
    }
    return result;
  };

  const handleClinicChange = (index, field, value) => {
    setForm(prev => {
      const clinics = Array.isArray(prev.clinics) ? [...prev.clinics] : [];
      clinics[index] = { ...clinics[index], [field]: value };
      return { ...prev, clinics };
    });
  };

  const addClinic = () => {
    setForm(prev => ({ ...prev, clinics: [...(prev.clinics || []), { clinicName: '', address: '', landmark: '', state: '', district: '', city: '', pin: '' }] }));
  };

  const removeClinic = (index) => {
    setForm(prev => ({ ...prev, clinics: (prev.clinics || []).filter((_, i) => i !== index) }));
  };

  const handleScheduleChange = (e, group, day) => {
    const { value } = e.target;
    if (group === "offline") {
      setForm((prev) => ({
        ...prev,
        scheduleOffline: { ...prev.scheduleOffline, [day]: value }
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        scheduleOnline: { ...prev.scheduleOnline, times: { ...prev.scheduleOnline.times, [day]: value } }
      }));
    }
  };

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const submit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!form.doctorName) {
      setToastVariant('danger');
      setToastMessage("Please enter Doctor's name");
      setShowToast(true);
      return;
    }

    try {
      // Build payload to match backend field names and types
      const qualificationsArr = Object.keys(form.qualifications).reduce((acc, k) => {
        if (k === 'Other') {
          if (form.qualifications.Other && form.qualifications.Other.trim()) acc.push(form.qualifications.Other.trim());
        } else if (form.qualifications[k]) {
          acc.push(k);
        }
        return acc;
      }, []);

      const schedule = {
        offline: form.scheduleOffline,
        online: form.scheduleOnline
      };

      // attach agent name (the person filling the form) if available
      try {
        const auth = await import('../../utils/auth');
        const u = auth.getUser();
        if (u && (u.name || u.email)) {
          payload.agent_name = u.name || u.email;
        }
      } catch (e) {
        // ignore if auth helper missing or errors
      }

      // attach parsed fields to clinics before sending
      const clinicsPayload = (form.clinics || []).map((c) => {
        const addr = c.address || '';
        const p = parseClinicAddress(addr || '');
        return {
          clinicName: c.clinicName || '',
          address: addr,
          city: c.city || p.city,
          state: c.state || p.state,
          district: c.district || p.district,
          pin: c.pin || p.pin,
          landmark: c.landmark || p.landmark
        };
      });

      const payload = {
        name: form.doctorName,
        doctor: form.specialty || null,
        reg_no: form.regNo || null,
        gender: form.gender || null,
        dob: form.birthday || null,
        qualifications: qualificationsArr,
        department: form.department || null,
        contact: form.contact1 || form.contact2 || null,
        // keep backward-compatible clinic_address (first clinic) and also send structured clinics array
        clinic_address: `${(form.clinics && form.clinics[0] && (form.clinics[0].clinicName || '') ? form.clinics[0].clinicName : form.clinicName) || ''}\n${(form.clinics && form.clinics[0] && form.clinics[0].address ? form.clinics[0].address : form.address) || ''}`.trim() || null,
  clinics: clinicsPayload.length ? clinicsPayload : null,
        schedule: schedule,
        fee: form.consultationFee || null,
        declaration: !!form.declaration
      };

      // Prefer using Vite proxy for local dev: send requests to '/api/onboarding' unless VITE_API_BASE is explicitly set.
      const envBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ? import.meta.env.VITE_API_BASE : '';
      const backendUrl = envBase && envBase.trim() !== '' ? `${envBase.replace(/\/$/, '')}/api/onboarding` : '/api/onboarding';
      const method = editId ? 'PUT' : 'POST';
      const url = editId ? `${backendUrl.replace(/\/$/, '')}/${editId}` : backendUrl;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Try to parse JSON; if it's HTML or text, include snippet and headers in the error for debugging
      let parsed = null;
      try {
        parsed = await res.json();
      } catch (parseErr) {
        // attempt to read as text
        let snippet = '<unreadable response>';
        try {
          const text = await res.clone().text();
          snippet = text.slice(0, 1000);
        } catch (tErr) {
          // try reading as blob and show first bytes as hex
          try {
            const blob = await res.clone().blob();
            const arrayBuffer = await blob.slice(0, 64).arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);
            snippet = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');
          } catch (bErr) {
            snippet = '<unreadable response (binary)>';
          }
        }

        const ctype = res.headers.get('content-type') || '<no content-type>';
        throw new Error(`Invalid JSON response (status ${res.status}). Content-Type: ${ctype}. Response starts with: ${snippet}`);
      }

      if (!res.ok) {
        // If API returned validation errors, include them
        const message = parsed?.message || (parsed?.errors ? JSON.stringify(parsed.errors) : JSON.stringify(parsed));
        throw new Error(message || 'Failed to submit onboarding');
      }

      console.log('Response from API:', parsed);
      setToastVariant('success');
      setToastMessage(editId ? 'Onboarding updated successfully.' : 'Onboarding submitted successfully.');
      setShowToast(true);
      // Give the user a moment to see the toast, then navigate back to list
      setTimeout(() => navigate('/onboarding'), 1200);
    } catch (err) {
      console.error('Submit error:', err);
      setToastVariant('danger');
      setToastMessage('Failed to submit onboarding: ' + err.message);
      setShowToast(true);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Toast notification (top-right) */}
        <div aria-live="polite" aria-atomic="true" className="position-fixed" style={{ top: 20, right: 20, zIndex: 1060 }}>
          <Toast onClose={() => setShowToast(false)} show={showToast} bg={toastVariant} delay={3500} autohide>
            <Toast.Header>
              <strong className="me-auto">Notification</strong>
            </Toast.Header>
            <Toast.Body className={toastVariant === 'success' ? 'text-white' : ''}>{toastMessage}</Toast.Body>
          </Toast>
        </div>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="mb-0">Doctor Onboarding</h3>
            <p className="text-muted mb-0">Fill the doctor's details to onboard.</p>
          </div>
        </div>

        <form onSubmit={submit} className="card">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label">Doctor's Name</label>
                <input name="doctorName" value={form.doctorName} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Reg. No.</label>
                <input name="regNo" value={form.regNo} onChange={handleChange} className="form-control" />
              </div>

              <div className="col-md-3">
                <label className="form-label">Birthday</label>
                <input type="date" name="birthday" value={form.birthday} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-3">
                <label className="form-label">Anniversary</label>
                <input type="date" name="anniversary" value={form.anniversary} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-3">
                <label className="form-label">Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} className="form-select">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Qualification</label>
                <div className="d-flex gap-3 align-items-center">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="MBBS" name="MBBS" checked={form.qualifications.MBBS} onChange={handleQualChange} />
                    <label className="form-check-label" htmlFor="MBBS">MBBS</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="MD" name="MD" checked={form.qualifications.MD} onChange={handleQualChange} />
                    <label className="form-check-label" htmlFor="MD">MD</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="MS" name="MS" checked={form.qualifications.MS} onChange={handleQualChange} />
                    <label className="form-check-label" htmlFor="MS">MS</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="FRCS" name="FRCS" checked={form.qualifications.FRCS} onChange={handleQualChange} />
                    <label className="form-check-label" htmlFor="FRCS">FRCS</label>
                  </div>
                  <div className="ms-2">
                    <input name="Other" value={form.qualifications.Other} onChange={handleQualChange} placeholder="Other" className="form-control" />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Department</label>
                <input name="department" value={form.department} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Specialty</label>
                <input name="specialty" value={form.specialty} onChange={handleChange} className="form-control" />
              </div>

              <div className="col-12">
                <label className="form-label">Search Parameters / Diseases</label>
                <input name="searchParameters" value={form.searchParameters} onChange={handleChange} className="form-control" />
              </div>

              <div className="col-md-6">
                <label className="form-label">Experience</label>
                <input name="experience" value={form.experience} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-3">
                <label className="form-label">Contact No. 1</label>
                <input name="contact1" value={form.contact1} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-3">
                <label className="form-label">Contact No. 2</label>
                <input name="contact2" value={form.contact2} onChange={handleChange} className="form-control" />
              </div>

              <div className="col-12">
                <label className="form-label">E-mail Id</label>
                <input name="email" value={form.email} onChange={handleChange} className="form-control" />
              </div>

              <div className="col-12">
                <label className="form-label">Clinic(s) Name & Address</label>
                <div className="mb-2">
                  {(form.clinics || []).map((c, idx) => (
                    <div key={idx} className="card mb-2 p-3 bg-light border">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <h6 className="mb-0">Clinic {idx + 1}</h6>
                          <small className="text-muted">{c.clinicName || ''}</small>
                        </div>
                        <div>
                          { (form.clinics || []).length > 1 && (
                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeClinic(idx)}>Remove</button>
                          ) }
                        </div>
                      </div>

                      <div className="mb-2">
                        <label className="form-label">Clinic name</label>
                        <input placeholder="Clinic name" value={c.clinicName || ''} onChange={(e) => handleClinicChange(idx, 'clinicName', e.target.value)} className="form-control mb-2" />

                        <label className="form-label">Address</label>
                        <textarea placeholder="Full address (use new lines)" value={c.address || ''} onChange={(e) => handleClinicChange(idx, 'address', e.target.value)} className="form-control mb-1" rows={3} />
                        { (c.parts && c.parts.length) ? (
                          <small className="text-muted">Parsed address parts: {c.parts.join(' • ')}</small>
                        ) : (
                          <small className="text-muted">Enter full address; the form will try to parse City/State/PIN.</small>
                        ) }
                      </div>

                      <div className="row g-2 mt-3">
                        <div className="col-md-6">
                          <label className="form-label">Landmark</label>
                          <input placeholder="Landmark" value={c.landmark || ''} onChange={(e) => handleClinicChange(idx, 'landmark', e.target.value)} className="form-control" />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">PIN</label>
                          <input placeholder="PIN (6 digits)" value={c.pin || ''} onChange={(e) => handleClinicChange(idx, 'pin', e.target.value)} className="form-control" />
                        </div>

                        <div className="col-md-4 mt-2">
                          <label className="form-label">State</label>
                          <input placeholder="State" value={c.state || ''} onChange={(e) => handleClinicChange(idx, 'state', e.target.value)} className="form-control" />
                        </div>
                        <div className="col-md-4 mt-2">
                          <label className="form-label">District</label>
                          <input placeholder="District" value={c.district || ''} onChange={(e) => handleClinicChange(idx, 'district', e.target.value)} className="form-control" />
                        </div>
                        <div className="col-md-4 mt-2">
                          <label className="form-label">City</label>
                          <input placeholder="City" value={c.city || ''} onChange={(e) => handleClinicChange(idx, 'city', e.target.value)} className="form-control" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div>
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={addClinic}>Add Clinic</button>
                  </div>
                </div>
              </div>
 

              <div className="col-md-6">
                <label className="form-label">Contact Person Name</label>
                <input name="contactPersonName" value={form.contactPersonName} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Contact Person No.</label>
                <input name="contactPersonNo" value={form.contactPersonNo} onChange={handleChange} className="form-control" />
              </div>

              <div className="col-md-4">
                <label className="form-label">Consultation Fee</label>
                <input name="consultationFee" value={form.consultationFee} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Prescription Validity (Days)</label>
                <input name="prescriptionValidity" value={form.prescriptionValidity} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-12">
                <label className="form-label">Consultancy Schedule Offline (time or notes)</label>
                <div className="row g-2">
                  {Object.keys(form.scheduleOffline).map((day) => (
                    <div className="col-md-3" key={day}>
                      <label className="form-label">{day}</label>
                      <input value={form.scheduleOffline[day]} onChange={(e) => handleScheduleChange(e, 'offline', day)} className="form-control" placeholder="e.g. 10:00-13:00" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-12">
                <label className="form-label">Consultancy Online</label>
                <div className="d-flex gap-3 align-items-center mb-2">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="regular" checked={form.scheduleOnline.regular} onChange={(e) => setForm(p => ({...p, scheduleOnline: {...p.scheduleOnline, regular: e.target.checked}}))} />
                    <label className="form-check-label" htmlFor="regular">Regular</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="pandemic" checked={form.scheduleOnline.pandemic} onChange={(e) => setForm(p => ({...p, scheduleOnline: {...p.scheduleOnline, pandemic: e.target.checked}}))} />
                    <label className="form-check-label" htmlFor="pandemic">Pandemic</label>
                  </div>
                </div>
                <div className="row g-2">
                  {Object.keys(form.scheduleOnline.times).map((day) => (
                    <div className="col-md-3" key={day}>
                      <label className="form-label">{day}</label>
                      <input value={form.scheduleOnline.times[day]} onChange={(e) => handleScheduleChange(e, 'online', day)} className="form-control" placeholder="e.g. 18:00-20:00" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-md-4">
                <label className="form-label">Max days before booking</label>
                <input name="maxDaysBeforeBooking" value={form.maxDaysBeforeBooking} onChange={handleChange} className="form-control" />
              </div>

              <div className="col-12">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="declaration" checked={form.declaration} onChange={(e) => setForm(p => ({...p, declaration: e.target.checked}))} />
                  <label className="form-check-label" htmlFor="declaration">I hereby declare that above details are true to the best of my knowledge and belief.</label>
                </div>
              </div>

            </div>
          </div>
          <div className="card-footer text-end">
            <button type="submit" className="btn btn-primary">Submit Onboarding</button>
            <Link to="/onboarding" className="btn btn-outline-secondary ms-2">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOnboarding;
