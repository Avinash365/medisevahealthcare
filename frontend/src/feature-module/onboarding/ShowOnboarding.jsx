import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PrimeDataTable from "../../components/data-table";
import TableTopHead from "../../components/table-top-head";
import SearchFromApi from "../../components/data-table/search";

const ShowOnboarding = () => {
  const [rows, setRows] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selection, setSelection] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // fetch when page, rows, month or year change
    fetchData({ search: searchQuery, month, year, per_page: rows, page: currentPage });
  }, [rows, currentPage, month, year]);

  // Export CSV (for Excel)
  const exportCsv = () => {
    if (!data || data.length === 0) {
      alert('No records to export');
      return;
    }
    const headers = ["Reg. No","Doctor's Name","Qualification","Specialty","City","Agent"];
    const csvRows = [headers.join(',')];
    data.forEach((row) => {
      const values = [row.reg_no, row.doctor_name, row.qualification, row.specialty, row.city, row.agent];
      // Escape values that contain commas or quotes
      const esc = values.map((v) => {
        if (v === null || typeof v === 'undefined') return '';
        const s = String(v).replace(/"/g, '""');
        return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s;
      });
      csvRows.push(esc.join(','));
    });
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `onboardings-${new Date().toISOString().slice(0,10)}.csv`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export PDF (open printable window and call print)
  const exportPdf = () => {
    if (!data || data.length === 0) {
      alert('No records to export');
      return;
    }
    const style = `
      <style>
        body { font-family: Arial, Helvetica, sans-serif; color:#222 }
        table { width:100%; border-collapse: collapse; }
        th, td { padding: 8px 10px; border: 1px solid #ddd; text-align: left; }
        th { background: #f5f6fa; }
      </style>
    `;
    const headers = ['Reg. No', "Doctor's Name", 'Qualification', 'Specialty', 'City', 'Agent'];
    const rowsHtml = data.map(r => `
      <tr>
        <td>${escapeHtml(r.reg_no)}</td>
        <td>${escapeHtml(r.doctor_name)}</td>
        <td>${escapeHtml(r.qualification)}</td>
        <td>${escapeHtml(r.specialty)}</td>
        <td>${escapeHtml(r.city)}</td>
        <td>${escapeHtml(r.agent)}</td>
      </tr>
    `).join('');
    const html = `<!doctype html><html><head><meta charset="utf-8"/><title>Onboardings</title>${style}</head><body>
      <h2>Doctors Onboarded</h2>
      <table>
        <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </body></html>`;
    const w = window.open('', '_blank');
    if (!w) {
      alert('Unable to open print window. Please allow popups.');
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    // give the new window a moment to render before printing
    setTimeout(() => { w.focus(); w.print(); }, 500);
  };

  const escapeHtml = (unsafe) => {
    if (unsafe === null || unsafe === undefined) return '';
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const fetchData = async (opts = {}) => {
    try {
      const params = new URLSearchParams();
      if (opts.search) params.set('search', opts.search);
      if (opts.month) params.set('month', opts.month);
      if (opts.year) params.set('year', opts.year);
      params.set('per_page', opts.per_page || rows);
      params.set('page', opts.page || currentPage);

  const APP_API_BASE = import.meta.env.VITE_APP_API_BASE;
      const res = await fetch(`${APP_API_BASE}/api/onboarding?` + params.toString());
      if (!res.ok) throw new Error('Failed to load');
      const json = await res.json();

      const rowsData = (json?.data || []).map((item) => ({
        id: item.id,
        reg_no: item.reg_no,
        doctor_name: $displayName(item),
        qualification: parseQualifications(item.qualifications),
        specialty: item.doctor || item.department || '-',
        city: item.clinic_address || '-',
        agent: item.agent_name || '-',
        raw: item
      }));

      setData(rowsData);
      setTotalRecords(json?.total ?? rowsData.length);
      setCurrentPage(json?.current_page ?? 1);
    } catch (err) {
      console.error('Show Onboarding fetch error', err);
      setData([]);
      setTotalRecords(0);
    }
  };

  const $displayName = (item) => {
    return item.name || item.doctor || '-';
  };

  const parseQualifications = (q) => {
    if (!q) return '-';
    if (Array.isArray(q)) return q.join(', ');
    try {
      const parsed = JSON.parse(q);
      if (Array.isArray(parsed)) return parsed.join(', ');
    } catch (e) {
      // not JSON
    }
    return typeof q === 'string' ? q : '-';
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    fetchData({ search: value, per_page: rows, page: 1 });
  };

  const columns = [
    { header: '', field: 'checkbox', body: () => null, className: 'col-checkbox' },
    { header: 'Reg. No', field: 'reg_no' },
    { header: "Doctor's Name", field: 'doctor_name' },
    { header: 'Qualification', field: 'qualification' },
    { header: 'Specialty', field: 'specialty' },
  { header: 'City', field: 'city' },
  { header: 'Agent', field: 'agent' },
    {
      header: 'Action',
      field: 'action',
      sortable: false,
      body: (row) => (
        <div className="action-icon d-inline-flex">
          <button type="button" onClick={() => navigate(`/onboarding/new?editId=${row.id}`)} className="p-2 d-flex align-items-center border rounded me-2 btn btn-light">
            <i className="ti ti-edit" />
          </button>
          <button type="button" onClick={() => { setDeleteId(row.id); setDeleteName(row.doctor_name || row.reg_no); }} data-bs-toggle="modal" data-bs-target="#delete_modal" className="p-2 d-flex align-items-center border rounded btn btn-light">
            <i className="ti ti-trash" />
          </button>
        </div>
      )
    }
  ];

  const APP_API_BASE = import.meta.env.VITE_APP_API_BASE;
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`${APP_API_BASE}/api/onboarding/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Delete failed');
      }
      // refresh list
      fetchData({ search: searchQuery, month, year, per_page: rows, page: 1 });
      setDeleteId(null);
      setDeleteName('');
    } catch (err) {
      console.error('Delete error', err);
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <div>
            <h3 className="mb-0">Doctors Onboarded</h3>
            <p className="text-muted mb-0">Show All Doctors</p>
          </div>
          <TableTopHead onPdf={exportPdf} onExcel={exportCsv} onRefresh={() => fetchData({ search: searchQuery, month, year, per_page: rows, page: currentPage })} />
        </div>

        <div className="card table-list-card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <SearchFromApi callback={handleSearch} rows={rows} setRows={setRows} />

            <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                <select value={month} onChange={(e) => setMonth(e.target.value)} className="form-select me-2" style={{width:140}}>
                  <option value="">Select Month</option>
                  <option value="1">Jan</option>
                  <option value="2">Feb</option>
                  <option value="3">Mar</option>
                  <option value="4">Apr</option>
                  <option value="5">May</option>
                  <option value="6">Jun</option>
                  <option value="7">Jul</option>
                  <option value="8">Aug</option>
                  <option value="9">Sep</option>
                  <option value="10">Oct</option>
                  <option value="11">Nov</option>
                  <option value="12">Dec</option>
                </select>
                <select value={year} onChange={(e) => setYear(e.target.value)} className="form-select me-2" style={{width:140}}>
                  <option value="">Select Year</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
                <button className="btn btn-outline-primary" onClick={() => { setCurrentPage(1); fetchData({ search: searchQuery, month, year, per_page: rows, page: 1 }); }}>Filter</button>
            </div>
          </div>

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
                selectionMode={'checkbox'}
                selection={selection}
                onSelectionChange={(e) => setSelection(e.value)}
              />
            </div>
          </div>
        </div>

        {/* Delete Modal */}
        <div className="modal fade" id="delete_modal">
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content">
              <div className="modal-body text-center">
                <span className="avatar avatar-xl bg-danger-transparent rounded-circle text-danger mb-3">
                  <i className="ti ti-trash-x fs-36" />
                </span>
                <h4 className="mb-1">Confirm Delete</h4>
                <p className="mb-3">You want to delete <strong>{deleteName}</strong>. This can't be undone.</p>
                <div className="d-flex justify-content-center">
                  <button type="button" className="btn btn-secondary me-3" data-bs-dismiss="modal">Cancel</button>
                  <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleDelete}>Yes, Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
        <p className="mb-0 text-gray-9">2025 © Gen Skytech. All Right Reserved</p>
        <p>
          Designed &amp; Developed By <Link to="#" className="text-primary">Gen Skytech</Link>
        </p>
      </div>
    </div>
  );
};

export default ShowOnboarding;
