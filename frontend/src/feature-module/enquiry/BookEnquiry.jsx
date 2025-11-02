import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiBase } from '../../utils/apiBase';
import { Toast } from 'react-bootstrap';

const BookEnquiry = () => {
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    city: '',
    message: ''
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    console.log('BookEnquiry: submit clicked', form);
    setToastVariant('info');
    setToastMessage('Submitting enquiry...');
    setShowToast(true);
    try {
  const base = getApiBase();
  const url = (base !== '' ? base : '') + '/api/enquiries';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        let msg = 'Failed to submit enquiry';
        try { const json = await res.json(); msg = json?.message || msg; } catch (_) {}
        throw new Error(msg);
      }
      setToastVariant('success');
      setToastMessage('Enquiry submitted');
      setShowToast(true);
      // auto-hide and navigate to show page so user can verify
      setTimeout(() => {
        setShowToast(false);
        navigate('/enquiry');
      }, 900);
    } catch (err) {
      console.error('Enquiry submit error', err);
      setToastVariant('danger');
      setToastMessage('Failed to submit enquiry: ' + err.message);
      setShowToast(true);
    }
  };

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
            <h3 className="mb-0">Book Enquiry</h3>
            <p className="text-muted mb-0">Capture partial information for an enquiry (no fields required).</p>
          </div>
        </div>

        <form onSubmit={submit} className="card">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Mobile</label>
                <input name="mobile" value={form.mobile} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-4">
                <label className="form-label">City</label>
                <input name="city" value={form.city} onChange={handleChange} className="form-control" />
              </div>

              <div className="col-12">
                <label className="form-label">Message / Notes</label>
                <textarea name="message" value={form.message} onChange={handleChange} className="form-control" rows={4} />
              </div>

              <div className="col-12 mt-3">
                <button className="btn btn-primary" type="submit">Submit Enquiry</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookEnquiry;
