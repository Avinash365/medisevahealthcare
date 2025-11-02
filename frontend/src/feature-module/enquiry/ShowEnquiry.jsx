import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiBase } from '../../utils/apiBase';
import { Toast, Modal, Button } from 'react-bootstrap';
import PrimeDataTable from '../../components/data-table';
import TableTopHead from '../../components/table-top-head';

const ShowEnquiry = () => {
  const [data, setData] = useState([]);
  const [rows, setRows] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [remarkValue, setRemarkValue] = useState('');
  const [remarkRow, setRemarkRow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchData({ search: searchQuery }); }, [rows, currentPage, searchQuery]);

  const fetchData = async (opts = {}) => {
    try {
      const base = getApiBase();
      const q = (base !== '' ? base : '') + '/api/enquiries' + (opts.search ? '?search=' + encodeURIComponent(opts.search) : '');
      const res = await fetch(q);
      if (!res.ok) throw new Error('Failed to load enquiries');
      const json = await res.json();
      const list = json?.data || json || [];
      const rowsData = list.map(item => ({ id: item.id, name: item.name || item.patient_name || '-', mobile: item.mobile || '-', city: item.city || '-', message: item.message || '-', remark: item.remark || '', raw: item }));
      setData(rowsData);
      // use total returned by API (fallback to computed length)
      setTotalRecords(json?.total ?? rowsData.length);
      setCurrentPage(json?.current_page || 1);
    } catch (err) {
      console.error('ShowEnquiry fetch error', err);
      setData([]);
      setTotalRecords(0);
    }
  };

  const openRemarkModal = (row) => {
    setRemarkRow(row);
    setRemarkValue(row.remark || '');
    setShowRemarkModal(true);
  };

  const saveRemark = async () => {
    if (!remarkRow) return;
    try {
      const base = getApiBase();
      const url = (base !== '' ? base : '') + '/api/enquiries/' + encodeURIComponent(remarkRow.id);
      const res = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ remark: remarkValue }) });
      if (!res.ok) { const j = await res.json().catch(()=>null); throw new Error(j?.message || 'Failed to save remark'); }
      setShowRemarkModal(false);
      setToastVariant('success');
      setToastMessage('Remark saved');
      setShowToast(true);
      // refresh list
      fetchData({ search: searchQuery });
    } catch (err) {
      console.error('Save remark error', err);
      setToastVariant('danger');
      setToastMessage('Failed to save remark: ' + err.message);
      setShowToast(true);
    }
  };

  const exportCsv = () => {
    if (!data || data.length === 0) return;
    const headers = ['Name','Mobile','City','Message','Remark'];
    const rowsCsv = [headers.join(',')];
    data.forEach(r => {
      const vals = [r.name, r.mobile, r.city, r.message, r.remark];
      const esc = vals.map(v => v == null ? '' : String(v).replace(/"/g,'""'));
      rowsCsv.push(esc.join(','));
    });
    const blob = new Blob([rowsCsv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `enquiries-${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  const escapeHtml = (s) => s == null ? '' : String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  const columns = [
    { header: 'Name', field: 'name' },
    { header: 'Mobile', field: 'mobile' },
    { header: 'City', field: 'city' },
    { header: 'Message', field: 'message' },
    { header: 'Remark', field: 'remark' },
    { header: 'Action', field: 'action', body: (row) => (
      <div>
        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => openRemarkModal(row)}>Remark</button>
      </div>
    ) }
  ];

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Toast notification (top-right) */}
        <div aria-live="polite" aria-atomic="true" className="position-fixed" style={{ top: 20, right: 20, zIndex: 1060 }}>
          <Toast onClose={() => setShowToast(false)} show={showToast} bg={toastVariant} delay={3000} autohide>
            <Toast.Header>
              <strong className="me-auto">Notification</strong>
            </Toast.Header>
            <Toast.Body className={toastVariant === 'success' ? 'text-white' : ''}>{toastMessage}</Toast.Body>
          </Toast>
        </div>
        <div className="page-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <div>
            <h3 className="mb-0">Enquiries</h3>
            <p className="text-muted mb-0">Show enquiries submitted by agents</p>
          </div>
          <TableTopHead onPdf={() => {}} onExcel={exportCsv} onRefresh={() => fetchData({ search: searchQuery })} />
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
        {/* Remark modal */}
        <Modal show={showRemarkModal} onHide={() => setShowRemarkModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Remark</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Remark</label>
              <textarea className="form-control" rows={4} value={remarkValue} onChange={(e) => setRemarkValue(e.target.value)} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRemarkModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={saveRemark}>Save</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ShowEnquiry;
