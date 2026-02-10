import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TableTopHead from '../../components/table-top-head';
import { getApiBase } from '../../utils/apiBase';
import PrimeDataTable from '../../components/data-table';
import { all_routes } from '../../routes/all_routes';

const AppointmentValidation = () => {
    const [data, setData] = useState([]);
    const [rows, setRows] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const fetchData = async () => {
        try {
            const base = getApiBase();
            // Fetch appointments with full doctor details (assuming show=all or we manually filter)
            // Ideally backend should provide this filter, but for now we fetch recent and filter client side 
            // OR fetch all and filter client side if dataset is small.
            // Let's assume fetching recent appointments is enough, or fetch all if pagination supports it.
            // Since we need to join with Onboarding to check validity, we likely need to fetch appointments
            // and separate network request for doctor details if not included.
            // 'api/appointments' returns appointments. 'clinic' is typically included. 'doctor_id' is there without doctor details maybe?
            // On show appointments we did a separate fetch for onboardings.

            const resOnb = await fetch(`${base}/api/onboarding?per_page=1000`);
            const onbJson = await resOnb.json();
            const doctors = onbJson?.data || onbJson || [];

            // Filter relevant doctors with expiring validity
            // Logic: if doctor has 'prescriptionValidity' (days), calculated expiration relative to what?
            // "Show data which have Prescription Validity near about end". 
            // If this refers to the *Doctor's* contract validity (e.g. TPA validity, or Onboarding validity), 
            // we should show Doctors. 
            // If this refers to Appointments where the valid period (e.g. 7 days followup) is ending, 
            // then we show Appointments. 
            // Given "Appointment Validation", let's assume it's Appointments nearing the end of "Follow-up validity".

            // Fetch appointments
            const resAppt = await fetch(`${base}/api/appointments?per_page=1000`); // Fetch 1000 for client filtering
            const apptJson = await resAppt.json();
            const appointments = apptJson?.data || apptJson || [];

            const today = new Date();
            const warningDays = 3; // "Near about end" => e.g., expiring in next 3 days

            const filtered = appointments.map(appt => {
                const doc = doctors.find(d => d.id == appt.doctor_id);
                
                // Try to find custom validity days from doctor
                // 'prescriptionValidity' (days) might be in doctor object or qualifications/schedule json
                let validityDays = 7; // Default
                if (doc) {
                    if (doc.prescriptionValidity || doc.prescription_validity) {
                        validityDays = Number(doc.prescriptionValidity || doc.prescription_validity) || 7;
                    } else if (doc.raw && (doc.raw.prescriptionValidity || doc.raw.prescription_validity)) {
                        validityDays = Number(doc.raw.prescriptionValidity || doc.raw.prescription_validity) || 7;
                    }
                }
                
                const apptDate = new Date(appt.appointment_date);
                const expiryDate = new Date(apptDate);
                expiryDate.setDate(apptDate.getDate() + validityDays);
                
                // Diff in days from now
                const diffTime = expiryDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                // "Near about end": Valid but expiring soon (e.g. 0 to 3 days left)
                // Or maybe already expired? "Near about end" -> 0-2 days.
                
                if (diffDays >= 0 && diffDays <= warningDays) {
                    return {
                        ...appt,
                        doctor_name: doc?.name || doc?.doctor || '-',
                        validity_days: validityDays,
                        expiry_date: expiryDate.toISOString().slice(0,10),
                        days_left: diffDays
                    };
                }
                return null;
            }).filter(Boolean);

            setData(filtered);
            setTotalRecords(filtered.length);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        { header: 'Patient Name', field: 'patient_name' },
        { header: 'Mobile', field: 'mobile_primary' },
        { header: 'Doctor', field: 'doctor_name' },
        { header: 'Appt Date', field: 'appointment_date' },
        { header: 'Valid Until', field: 'expiry_date' },
        { header: 'Days Left', field: 'days_left' },
        { header: 'Status', field: 'status', body: (r) => <span className="badge bg-warning">Expiring Soon</span> }
    ];

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="row">
                        <div className="col-sm-12">
                            <h3 className="page-title">Appointment Validation</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link to={all_routes.dashboard}>Dashboard</Link></li>
                                <li className="breadcrumb-item active">Validation</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Expiring Prescriptions</h4>
                                <p className="card-text">Appointments where prescription validity is ending soon (next 3 days).</p>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <PrimeDataTable 
                                        data={data}
                                        column={columns}
                                        rows={rows}
                                        setRows={setRows}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        totalRecords={totalRecords}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentValidation;
