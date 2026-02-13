
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MetaConfig = () => {
  const [settings, setSettings] = useState({
    phone_number_id: "",
    access_token: "",
    business_account_id: "",
    enabled: false,
  });

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings/sms");
      const data = await response.json();
      if (data.meta) {
        setSettings({
          phone_number_id: data.meta.phone_number_id || "",
          access_token: data.meta.access_token || "",
          business_account_id: data.meta.business_account_id || "",
          enabled: data.meta.enabled || false,
        });
      }
    } catch (error) {
      console.error("Error fetching settings", error);
    }
  };

  useEffect(() => {
    const modal = document.getElementById('meta-config');
    if (modal) {
        modal.addEventListener('shown.bs.modal', fetchSettings);
    }
    fetchSettings();
    return () => {
        if (modal) {
            modal.removeEventListener('shown.bs.modal', fetchSettings);
        }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/settings/sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meta: settings }),
      });

      if (response.ok) {
        alert("Settings updated successfully");
         const closeBtn = document.querySelector('#meta-config .close');
         if(closeBtn) closeBtn.click();
         window.location.reload(); 
      } else {
        console.error("Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings", error);
    }
  };

  return (
    <div>
      {/* Meta Config */}
      <div className="modal fade" id="meta-config">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Meta WhatsApp</h4>
                  </div>
                  <div className="status-toggle modal-status d-flex justify-content-between align-items-center ms-auto me-2">
                    <input
                      type="checkbox"
                      id="meta_enabled"
                      className="check"
                      name="enabled"
                      checked={settings.enabled}
                      onChange={handleChange}
                    />
                    
                    <label htmlFor="meta_enabled" className="checktoggle">
                      {" "}
                    </label>
                  </div>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close">
                    
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body custom-modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Phone Number ID <span> *</span>
                          </label>
                          <input 
                            type="text" 
                            className="form-control"
                            name="phone_number_id" 
                            value={settings.phone_number_id}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Access Token <span> *</span>
                          </label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="access_token"
                            value={settings.access_token}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="mb-0">
                          <label className="form-label">
                            {" "}
                            Business Account ID <span> *</span>
                          </label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="business_account_id"
                            value={settings.business_account_id}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer-btn">
                      <button
                        type="button"
                        className="btn btn-cancel me-2"
                        data-bs-dismiss="modal">
                        
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-submit">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Meta Config */}
    </div>);

};

export default MetaConfig;
