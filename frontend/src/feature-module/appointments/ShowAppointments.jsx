import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PrimeDataTable from '../../components/data-table';
import TableTopHead from '../../components/table-top-head';
import { getApiBase } from '../../utils/apiBase';

const ShowAppointments = () => {
  const [data, setData] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [selectedPatientProfile, setSelectedPatientProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editPatient, setEditPatient] = useState(null);
  const [rows, setRows] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [paymentFilter, setPaymentFilter] = useState('all'); // all | full | partial
  const [consultFilter, setConsultFilter] = useState('all'); // all | consulted | pending
  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [rows, currentPage, paymentFilter, consultFilter, searchQuery]);

  const fetchData = async () => {
    try {
      const base = getApiBase();
      let apptUrl = `${base}/api/appointments?per_page=${rows}&page=${currentPage}&payment=${encodeURIComponent(paymentFilter)}&consult=${encodeURIComponent(consultFilter)}`;
      if (searchQuery && String(searchQuery).trim() !== '') {
        apptUrl += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }
      const [resAppt, resOnb] = await Promise.all([
        fetch(apptUrl),
        fetch(`${base}/api/onboarding?per_page=1000`)
      ]);
      if (!resAppt.ok) throw new Error('Failed to load appointments');
      const apptJson = await resAppt.json();
  let appts = apptJson?.data || apptJson || [];

      // build doctor map
      let doctorMap = {};
      if (resOnb.ok) {
        const onbJson = await resOnb.json();
        const list = onbJson?.data || onbJson || [];
        list.forEach(item => {
          doctorMap[item.id] = item.name || item.doctor || '';
        });
      }

      const rowsData = appts.map(a => ({
        id: a.id,
        // keep plain patient name for exports and search
        patient: a.patient_name,
        // renderable patient display (clickable) used by the table — styled like normal text
        patientDisplay: (
          <span
            role="button"
            onClick={() => openPatientProfileFromAppointment(a)}
            style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none', padding: 0, border: 0, background: 'transparent' }}
          >
            {a.patient_name}
          </span>
        ),
        mobile: a.mobile_primary,
        appointment_date: a.appointment_date ? (new Date(a.appointment_date)).toISOString().slice(0,10) : '',
        doctor: doctorMap[a.doctor_id] || (a.doctor_id ? `#${a.doctor_id}` : ''),
        agent: a.agent_name || '-',
        clinic: (a.clinic && (a.clinic.clinicName || a.clinic.name || a.clinic.label)) ? (a.clinic.clinicName || a.clinic.name || a.clinic.label) : (a.clinic && a.clinic.address ? (String(a.clinic.address).split('\n')[0]) : ''),
        city: a.city || '',
        status: (a.payment_status || a.status || 'unknown'),
        action: (
          <div className="btn-group" role="group" aria-label="status-actions">
            <button type="button" className={`btn btn-sm ${ (a.payment_status||a.status) === 'pending' ? 'btn-warning' : 'btn-outline-secondary' }`} onClick={() => updateAppointmentStatus(a.id, 'pending')}>Pending</button>
            <button type="button" className={`btn btn-sm ${ (a.payment_status||a.status) === 'consulted' ? 'btn-success' : 'btn-outline-secondary' }`} onClick={() => updateAppointmentStatus(a.id, 'consulted')}>Consulted</button>
          </div>
        ),
        raw: a
      }));

      // preserve full dataset for client-side filtering and exports
      setFullData(rowsData);
      if (consultFilter && consultFilter !== 'all') {
        const f = rowsData.filter(r => String((r.status || '').toLowerCase()) === String(consultFilter).toLowerCase());
        setData(f);
        setTotalRecords(f.length);
      } else {
        setData(rowsData);
        setTotalRecords(apptJson?.total ?? rowsData.length);
      }
      setCurrentPage(apptJson?.current_page || currentPage);
    } catch (err) {
      console.error('ShowAppointments fetch error', err);
      setData([]);
      setTotalRecords(0);
    }
  };

  const exportCsv = () => {
    const src = data && data.length ? data : fullData;
    if (!src || src.length === 0) return;
    const headers = ['Patient','Mobile','Appointment Date','Doctor','Agent','Clinic','City','Status'];
    const csvRows = [headers.join(',')];
    src.forEach(r => {
      const vals = [r.patient, r.mobile, r.appointment_date, r.doctor, r.agent, r.clinic, r.city, r.status];
      const esc = vals.map(v => v == null ? '' : `"${String(v).replace(/"/g,'""')}"`);
      csvRows.push(esc.join(','));
    });
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'appointments.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    if (!data || data.length === 0) return;
    const style = `<style>body{font-family: Arial}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f6fa}</style>`;
  const headers = ['Patient','Mobile','Appointment Date','Doctor','Agent','Clinic','City','Status'];
  const rowsHtml = data.map(r => `<tr><td>${escapeHtml(r.patient)}</td><td>${escapeHtml(r.mobile)}</td><td>${escapeHtml(r.appointment_date)}</td><td>${escapeHtml(r.doctor)}</td><td>${escapeHtml(r.agent)}</td><td>${escapeHtml(r.clinic)}</td><td>${escapeHtml(r.city)}</td><td>${escapeHtml(r.status)}</td></tr>`).join('');
    const html = `<!doctype html><html><head><meta charset="utf-8"/>${style}</head><body><h2>Appointments</h2><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rowsHtml}</tbody></table></body></html>`;
    const w = window.open('','_blank'); if (!w) return; w.document.open(); w.document.write(html); w.document.close(); setTimeout(()=>{ w.focus(); w.print(); }, 400);
  };

  const escapeHtml = (unsafe) => {
    if (unsafe === null || unsafe === undefined) return '';
    return String(unsafe).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  };

  

  const columns = [
    { header: 'Patient', field: 'patientDisplay' },
    { header: 'Mobile', field: 'mobile' },
    { header: 'Appointment Date', field: 'appointment_date' },
    { header: 'Doctor', field: 'doctor' },
    { header: 'Agent', field: 'agent' },
    { header: 'Clinic', field: 'clinic' },
    { header: 'City', field: 'city' },
    { header: 'Status', field: 'status' },
    { header: 'Action', field: 'action' }
  ];

  const openPatientProfileFromAppointment = (appt) => {
    if (!appt) return;
    // try to find stored patient in localStorage by name or mobile
    try {
      const raw = localStorage.getItem('patients');
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          const byName = arr.find(p => (p.name || '').toLowerCase() === String(appt.patient_name || '').toLowerCase());
          if (byName) { setSelectedPatientProfile(byName); return; }
          const byMobile = arr.find(p => (String(p.mobilePrimary || '') === String(appt.mobile_primary || '') && String(p.mobilePrimary || '') !== ''));
          if (byMobile) { setSelectedPatientProfile(byMobile); return; }
        }
      }
    } catch (e) {
      // ignore parse errors
    }
    // fallback: build a lightweight profile from appointment data
    const fallback = {
      id: `appt-${appt.id}`,
      name: appt.patient_name || appt.patient || 'Unknown',
      mobilePrimary: appt.mobile_primary || '',
      email: appt.email || '',
      address: (appt.address && (appt.address.line || appt.address)) || appt.address || '',
      age: appt.age || '',
      dob: appt.dob || '',
      gender: appt.gender || '',
      bloodGroup: appt.blood_group || '',
      allergies: appt.allergies || ''
    };
    setSelectedPatientProfile(fallback);
  };

  const updateAppointmentStatus = async (apptId, newStatus) => {
    // optimistic UI: update local rows
    setData(prev => prev.map(r => {
      if (String(r.id) === String(apptId)) {
        return { ...r, status: newStatus, raw: { ...(r.raw || {}), status: newStatus, payment_status: newStatus } };
      }
      return r;
    }));

    try {
      const base = getApiBase();
      const body = { status: newStatus };
      // also send consulted boolean to help server-side filtering
      if (String(newStatus).toLowerCase() === 'consulted') {
        body.consulted = true;
      } else if (String(newStatus).toLowerCase() === 'pending') {
        body.consulted = false;
      }
      const res = await fetch(`${base}/api/appointments/${encodeURIComponent(apptId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      console.error('Status update failed', err);
      // revert optimistic update on error
      fetchData();
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <div>
            <h3 className="mb-0">Booked Appointments</h3>
            <p className="text-muted mb-0">All recorded appointments</p>
          </div>
          <TableTopHead onPdf={exportPdf} onExcel={exportCsv} onRefresh={fetchData} />
        </div>

        {/* Filters (moved below header) */}
        <div className="mb-3">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <div>
              <div className="btn-group" role="group" aria-label="Payment filter">
                <button type="button" className={`btn btn-sm ${paymentFilter==='all' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setPaymentFilter('all')}>All Appointment</button>
                <button type="button" className={`btn btn-sm ${paymentFilter==='full' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setPaymentFilter('full')}>Full Payment</button>
                <button type="button" className={`btn btn-sm ${paymentFilter==='partial' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setPaymentFilter('partial')}>Partial Payment</button>
                <button type="button" className={`btn btn-sm ${paymentFilter==='counter' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setPaymentFilter('counter')}>Paid on Counter</button>
              </div>
            </div>
            <div>
              <div className="btn-group" role="group" aria-label="Consult filter">
                <button type="button" className={`btn btn-sm ${consultFilter==='all' ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => setConsultFilter('all')}>All</button>
                <button type="button" className={`btn btn-sm ${consultFilter==='consulted' ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => setConsultFilter('consulted')}>Consulted</button>
                <button type="button" className={`btn btn-sm ${consultFilter==='pending' ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => setConsultFilter('pending')}>Pending</button>
              </div>
            </div>
            <div className="ms-auto d-flex gap-2 align-items-center">
              <input type="text" className="form-control form-control-sm" style={{minWidth:250}} placeholder="Search patient name or phone" value={searchText} onChange={(e) => setSearchText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { setCurrentPage(1); setSearchQuery(searchText); } }} />
              <button type="button" className="btn btn-sm btn-primary" onClick={() => { setCurrentPage(1); setSearchQuery(searchText); }}>Search</button>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => { setSearchText(''); setSearchQuery(''); setCurrentPage(1); }}>Clear</button>
            </div>
          </div>
        </div>

        <div className="card table-list-card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <PrimeDataTable
                column={columns}
                data={data}
                totalRecords={totalRecords}
                rows={rows}
                setRows={setRows}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
        {/* Patient profile modal */}
        {selectedPatientProfile && (
          <div style={{position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={() => setSelectedPatientProfile(null)}>
            <div role="dialog" aria-modal="true" className="card" style={{width: 860, maxWidth: '95%', cursor: 'auto'}} onClick={(e) => e.stopPropagation()}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Patient Profile</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setSelectedPatientProfile(null)} />
              </div>
              <div className="card-body d-flex gap-3">
                <div style={{width: 160}}>
                  { (editMode ? (editPatient && editPatient.photo) : selectedPatientProfile.photo) ? (
                    <img src={(editMode ? (editPatient && editPatient.photo) : selectedPatientProfile.photo)} style={{width: '100%', height: 160, objectFit: 'cover', borderRadius: 6}} alt="patient" />
                  ) : (
                    <div style={{width: '100%', height: 160, background: '#f1f1f1', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6}}>No photo</div>
                  )}
                  {editMode && (
                    <div className="mt-2">
                      <input type="file" accept="image/*" className="form-control form-control-sm" onChange={(e) => {
                        const f = e?.target?.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => setEditPatient(prev => ({ ...prev, photo: r.result })); r.readAsDataURL(f);
                      }} />
                    </div>
                  )}
                </div>
                <div style={{flex: 1}}>
                  {!editMode ? (
                    <>
                      <h4 className="mb-1">{selectedPatientProfile.name}</h4>
                      <div className="small text-muted mb-2">{selectedPatientProfile.guardianName ? `Guardian: ${selectedPatientProfile.guardianName}` : ''}</div>

                      <div className="row">
                        <div className="col-md-6"><strong>Phone:</strong> {selectedPatientProfile.mobilePrimary || '-'}</div>
                        <div className="col-md-6"><strong>Email:</strong> {selectedPatientProfile.email || '-'}</div>
                        <div className="col-md-6"><strong>Age / DOB:</strong> {selectedPatientProfile.age || '-'} {selectedPatientProfile.dob ? ` / ${selectedPatientProfile.dob}` : ''}</div>
                        <div className="col-md-6"><strong>Gender:</strong> {selectedPatientProfile.gender || '-'}</div>
                        <div className="col-md-6"><strong>Blood Group:</strong> {selectedPatientProfile.bloodGroup || '-'}</div>
                        <div className="col-md-6"><strong>Marital Status:</strong> {selectedPatientProfile.maritalStatus || '-'}</div>
                        <div className="col-12 mt-2"><strong>Address:</strong> {selectedPatientProfile.address || '-'}</div>
                        <div className="col-12 mt-2"><strong>Allergies:</strong> {selectedPatientProfile.allergies || '-'}</div>
                      </div>
                    </>
                  ) : (
                    <div className="row g-2">
                      <div className="col-md-6">
                        <label className="form-label">Name</label>
                        <input className="form-control" value={editPatient.name || ''} onChange={(e) => setEditPatient(prev => ({ ...prev, name: e.target.value }))} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Guardian</label>
                        <input className="form-control" value={editPatient.guardianName || ''} onChange={(e) => setEditPatient(prev => ({ ...prev, guardianName: e.target.value }))} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Phone</label>
                        <input className="form-control" value={editPatient.mobilePrimary || ''} onChange={(e) => setEditPatient(prev => ({ ...prev, mobilePrimary: e.target.value }))} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Email</label>
                        <input className="form-control" value={editPatient.email || ''} onChange={(e) => setEditPatient(prev => ({ ...prev, email: e.target.value }))} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Age</label>
                        <input className="form-control" value={editPatient.age || ''} onChange={(e) => setEditPatient(prev => ({ ...prev, age: e.target.value }))} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">DOB</label>
                        <input type="date" className="form-control" value={editPatient.dob || ''} onChange={(e) => setEditPatient(prev => ({ ...prev, dob: e.target.value }))} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Gender</label>
                        <input className="form-control" value={editPatient.gender || ''} onChange={(e) => setEditPatient(prev => ({ ...prev, gender: e.target.value }))} />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Address</label>
                        <input className="form-control" value={editPatient.address || ''} onChange={(e) => setEditPatient(prev => ({ ...prev, address: e.target.value }))} />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Allergies</label>
                        <input className="form-control" value={editPatient.allergies || ''} onChange={(e) => setEditPatient(prev => ({ ...prev, allergies: e.target.value }))} />
                      </div>
                    </div>
                  )}
                </div>
                <div style={{width: 180}}>
                  <div className="d-flex flex-column gap-2">
                    {!editMode ? (
                      <>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => { setEditPatient({ ...selectedPatientProfile }); setEditMode(true); }}>Edit</button>
                        {/* Copy JSON removed */}
                        <button type="button" className="btn btn-primary" onClick={() => setSelectedPatientProfile(null)}>Close</button>
                      </>
                    ) : (
                      <>
                        <button type="button" className="btn btn-success" onClick={async () => {
                          // save to localStorage
                          const updated = { ...editPatient };
                          try {
                            const raw = localStorage.getItem('patients');
                            let arr = [];
                            if (raw) { arr = JSON.parse(raw) || []; }
                            const idx = arr.findIndex(x => String(x.id) === String(updated.id));
                            if (idx >= 0) { arr[idx] = updated; } else { updated.id = updated.id || Date.now(); arr.unshift(updated); }
                            localStorage.setItem('patients', JSON.stringify(arr));
                            setSelectedPatientProfile(updated);
                            setEditMode(false);
                            // try to sync to server if API available
                            try {
                              const base = getApiBase();
                              const apiUrl = base + '/api/patients';
                              // if id looks numeric, attempt PUT, else POST
                              if (updated.id && String(updated.id).match(/^\d+$/)) {
                                await fetch(`${apiUrl}/${updated.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
                              } else {
                                await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
                              }
                            } catch (syncErr) {
                              // ignore sync errors — local save succeeded
                            }
                          } catch (e) {
                            console.error('Save patient error', e);
                          }
                        }}>Save</button>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => { setEditMode(false); setEditPatient(null); }}>Cancel</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowAppointments;
