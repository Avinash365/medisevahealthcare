import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PrimeDataTable from '../../components/data-table';
import TableTopHead from '../../components/table-top-head';
import { getApiBase } from '../../utils/apiBase';

const ShowAppointments = () => {
  const [data, setData] = useState([]);
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
        patient: a.patient_name,
        mobile: a.mobile_primary,
        appointment_date: a.appointment_date ? (new Date(a.appointment_date)).toISOString().slice(0,10) : '',
        doctor: doctorMap[a.doctor_id] || (a.doctor_id ? `#${a.doctor_id}` : ''),
        agent: a.agent_name || '-',
        clinic: (a.clinic && (a.clinic.clinicName || a.clinic.name || a.clinic.label)) ? (a.clinic.clinicName || a.clinic.name || a.clinic.label) : (a.clinic && a.clinic.address ? (String(a.clinic.address).split('\n')[0]) : ''),
        city: a.city || '',
        status: (a.payment_status || a.status || 'unknown'),
        raw: a
      }));

  setData(rowsData);
  setTotalRecords(apptJson?.total ?? rowsData.length);
  setCurrentPage(apptJson?.current_page || currentPage);
    } catch (err) {
      console.error('ShowAppointments fetch error', err);
      setData([]);
      setTotalRecords(0);
    }
  };

  const exportCsv = () => {
    if (!data || data.length === 0) return;
    const headers = ['Patient','Mobile','Appointment Date','Doctor','Agent','Clinic','City','Status'];
    const csvRows = [headers.join(',')];
    data.forEach(r => {
      const vals = [r.patient, r.mobile, r.appointment_date, r.doctor, r.agent, r.clinic, r.city, r.status];
      const esc = vals.map(v => v == null ? '' : String(v).replace(/"/g,'""'));
      csvRows.push(esc.join(','));
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `appointments-${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
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
    { header: 'Patient', field: 'patient' },
    { header: 'Mobile', field: 'mobile' },
    { header: 'Appointment Date', field: 'appointment_date' },
    { header: 'Doctor', field: 'doctor' },
    { header: 'Agent', field: 'agent' },
    { header: 'Clinic', field: 'clinic' },
    { header: 'City', field: 'city' },
    { header: 'Status', field: 'status' }
  ];

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
                <button type="button" className={`btn btn-sm ${paymentFilter==='all' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setPaymentFilter('all')}>All Payments</button>
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
      </div>
    </div>
  );
};

export default ShowAppointments;
