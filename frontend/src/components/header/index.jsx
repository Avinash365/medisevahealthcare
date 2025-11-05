import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { all_routes } from "../../routes/all_routes";
import {
  arabicFlag,
  avatar01,
  avatar1,
  avatar10,
  avatar_02,
  avatar_03,
  avatar_13,
  avatar_17,
  avator1,
  commandSvg,
  englishFlag,
  logoPng,
  logoSmallPng,
  logoWhitePng,
  store_01,
  store_02,
  store_03,
  store_04,
  usFlag } from
"../../utils/imagepath";
import { clearToken, fetchWithAuth } from "../../utils/auth";
const Header = () => {
  const route = all_routes;
  const navigate = useNavigate();
  const [toggle, SetToggle] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [flagImage, _setFlagImage] = useState(usFlag);
  // const { t, i18n } = useTranslation();
  const changeLanguage = (_lng) => {











    // Debugging statement
    // i18n.changeLanguage(lng);
    // setFlagImage(
    //   lng === "en"
    //     ? 'assets/img/flags/us-flag.svg'
    //     : lng === "fr"
    //       ? 'assets/img/flags/fr.png'
    //       : lng === "es"
    //         ? 'assets/img/flags/es.png'
    //         : 'assets/img/flags/de.png'
    // );
  };const isElementVisible = (element) => {return element.offsetWidth > 0 || element.offsetHeight > 0;};useEffect(() => {const handleMouseover = (e) => {
        e.stopPropagation();

        const body = document.body;
        const toggleBtn =
        document.getElementById("toggle_btn");

        if (
        body.classList.contains("mini-sidebar") &&
        isElementVisible(toggleBtn))
        {
          e.preventDefault();
        }
      };

      document.addEventListener("mouseover", handleMouseover);

      return () => {
        document.removeEventListener("mouseover", handleMouseover);
      };
    }, []);
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);
  // header search state for patient preview
  const [headerSearchText, setHeaderSearchText] = useState('');
  const [patientResults, setPatientResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    id: '',
    name: '',
    guardianName: '',
    gender: '',
    dob: '',
    age: '',
    bloodGroup: '',
    maritalStatus: '',
    photo: '',
    mobilePrimary: '',
    email: '',
    address: '',
    allergies: ''
  });
  const [npErrors, setNpErrors] = useState({});

  const performHeaderSearch = (query) => {
    const q = String(query || '').trim().toLowerCase();
    setSelectedPatient(null);
    if (!q) { setPatientResults([]); return; }
    try {
      const raw = localStorage.getItem('patients');
      if (!raw) { setPatientResults([]); return; }
      const arr = JSON.parse(raw) || [];
      const matches = arr.filter(p => {
        const name = (p.name || '').toLowerCase();
        const mobile = String(p.mobilePrimary || p.mobile || '').toLowerCase();
        return name.includes(q) || mobile.includes(q);
      });
      setPatientResults(matches.slice(0, 8));
    } catch (e) {
      setPatientResults([]);
    }
  };

  const openPatientPreview = (p) => {
    setSelectedPatient(p || null);
    setShowPatientModal(!!p);
  };

  const resetNewPatient = () => {
    setNewPatient({
      id: '', name: '', guardianName: '', gender: '', dob: '', age: '', bloodGroup: '', maritalStatus: '', photo: '',
      mobilePrimary: '', email: '', address: '', allergies: ''
    });
    setNpErrors({});
  };

  const handleNewPatientPhoto = (e) => {
    const f = e?.target?.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => setNewPatient(prev => ({ ...prev, photo: r.result }));
    r.readAsDataURL(f);
  };

  const validateNewPatient = () => {
    const errs = {};
    if (!newPatient.name || String(newPatient.name).trim() === '') errs.name = 'Name is required';
    if (!newPatient.mobilePrimary || String(newPatient.mobilePrimary).trim() === '') errs.mobilePrimary = 'Mobile is required';
    setNpErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const saveNewPatientFromHeader = async () => {
    if (!validateNewPatient()) return;
    try {
      const raw = localStorage.getItem('patients');
      let arr = [];
      if (raw) arr = JSON.parse(raw) || [];
      const toSave = { ...newPatient };
      toSave.id = toSave.id || Date.now();
      arr.unshift(toSave);
      localStorage.setItem('patients', JSON.stringify(arr));
      // update suggestions and show profile modal
      setShowAddPatientModal(false);
      setSelectedPatient(toSave);
      setShowPatientModal(true);
      if (toSave.name) setHeaderSearchText(toSave.name);
      performHeaderSearch(toSave.name || '');
    } catch (e) {
      // silent fail - could add toast later
    }
  };
  const handlesidebar = () => {
    document.body.classList.toggle("mini-sidebar");
    SetToggle((current) => !current);
  };
  const location = useLocation();

  const sidebarOverlay = () => {
    document?.querySelector(".main-wrapper")?.classList?.toggle("slide-nav");
    document?.querySelector(".sidebar-overlay")?.classList?.toggle("opened");
    document?.querySelector("html")?.classList?.toggle("menu-opened");
  };
  useEffect(() => {
    document.querySelector(".main-wrapper")?.classList.remove("slide-nav");
    document.querySelector(".sidebar-overlay")?.classList.remove("opened");
    document.querySelector("html")?.classList.remove("menu-opened");
  }, [location.pathname]);

  let pathname = location.pathname;

  const exclusionArray = [
  "/dream-pos/index-three",
  "/dream-pos/index-one"];

  if (exclusionArray.indexOf(window.location.pathname) >= 0) {
    return "";
  }
















  const toggleFullscreen = (elem) => {
    const doc = document;
    elem = elem || document.documentElement;
    if (
    !doc.fullscreenElement &&
    !doc.mozFullScreenElement &&
    !doc.webkitFullscreenElement &&
    !doc.msFullscreenElement)
    {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(1);
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      }
    }
  };







  const { expandMenus } = useSelector(
    (state) => state.themeSetting.expandMenus
  );
  const dataLayout = useSelector(
    (state) => state.themeSetting.dataLayout
  );

  const expandMenu = () => {
    document.body.classList.remove("expand-menu");
  };
  const expandMenuOpen = () => {
    document.body.classList.add("expand-menu");
  };

  return (
    <>
      <div className="header">
        {/* Logo */}
        <div className="main-header">
          <div
            className={`header-left
             ${toggle ? "" : "active"}
             ${expandMenus || dataLayout === "layout-hovered" ? "expand-menu" : ""}
             `}
            onMouseLeave={expandMenu}
            onMouseOver={expandMenuOpen}>
            
            <Link to="/dashboard" className="logo logo-normal">
              <img src={logoPng} alt="img" />
            </Link>
            <Link to="/dashboard" className="logo logo-white">
              <img src={logoWhitePng} alt="img" />
            </Link>
            <Link to="/dashboard" className="logo-small">
              <img src={logoSmallPng} alt="img" />
            </Link>
            <Link
              id="toggle_btn"
              to="#"
              style={{
                display:
                pathname.includes("tasks") || pathname.includes("pos") ?
                "none" :
                pathname.includes("compose") ?
                "none" :
                ""
              }}
              onClick={handlesidebar}>
              
              <i className="feather icon-chevrons-left feather-16" />
            </Link>
          </div>
          {/* /Logo */}
          <Link
            id="mobile_btn"
            className="mobile_btn"
            to="#"
            onClick={sidebarOverlay}>
            
            <span className="bar-icon">
              <span />
              <span />
              <span />
            </span>
          </Link>
          {/* Header Menu */}
          <ul className="nav user-menu">
            {/* Search */}
            <li className="nav-item nav-searchinputs">
              <div className="top-nav-search d-flex align-items-center gap-2">
                <Link to="#" className="responsive-search" onClick={(e) => { e.preventDefault(); performHeaderSearch(headerSearchText); }}>
                  <i className="feather icon-search" />
                </Link>
                <form action="#" className="dropdown">
                  <div
                    className="searchinputs input-group dropdown-toggle"
                    id="dropdownMenuClickable"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside">
                    
                    <input
                      type="text"
                      placeholder="Search"
                      value={headerSearchText}
                      onChange={(e) => {
                        const v = e.target.value;
                        setHeaderSearchText(v);
                        if (v && v.trim().length >= 2) {
                          performHeaderSearch(v);
                        } else if (v.trim().length === 0) {
                          performHeaderSearch('');
                        }
                      }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { performHeaderSearch(headerSearchText); } }}
                    />
                    <div className="search-addon">
                      <span>
                        <i className="ti ti-search" />
                      </span>
                    </div>
                    <span className="input-group-text">
                      <kbd className="d-flex align-items-center">
                        <img src={commandSvg} alt="img" className="me-1" />K
                      </kbd>
                    </span>
                  </div>

                  <div
                    className="dropdown-menu search-dropdown"
                    aria-labelledby="dropdownMenuClickable"
                    style={{ width: 340, maxHeight: 50, overflowY: 'auto', padding: '8px 10px' }}>
                    <div className="search-info">
                      <ul className="customers" style={{ margin: 0, padding: 0 }}>
                        {/* dynamic patient results from localStorage */}
                        {patientResults && patientResults.length > 0 ? (
                          patientResults.map((p) => (
                            <li key={p.id || p.mobilePrimary || p.name} style={{ listStyle: 'none' }}>
                              <a href="#" onClick={(e) => { e.preventDefault(); openPatientPreview(p); }}
                                 className="d-flex align-items-center justify-content-between"
                                 style={{ padding: '6px 8px', borderRadius: 6 }}>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 10 }}>
                                  {p.name || 'Unnamed'}
                                  <span className="text-muted" style={{ marginLeft: 6, fontSize: 12 }}>
                                    {p.mobilePrimary || ''}
                                  </span>
                                </span>
                                {p.photo ? <img src={p.photo} alt="" style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: '50%' }} /> : <img src={avatar1} alt="" style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: '50%' }} />}
                              </a>
                            </li>
                          ))
                        ) : (
                          <li className="text-muted small">Type name or mobile…</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </form>
                <button type="button" className="btn btn-sm btn-primary" onClick={() => { resetNewPatient(); setShowAddPatientModal(true); }}>
                  + Add Patient
                </button>
              </div>
            </li>
            {/* /Search */}

            {/* Select Store */}
             

            {/* Flag */}
            <li className="nav-item dropdown has-arrow flag-nav nav-item-box">
              <Link
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                to="#"
                role="button">
                
                {/* <i data-feather="globe" /> */}
                {/* <FeatherIcon icon="globe" /> */}
                <img src={flagImage} alt="img" height={16} />
              </Link>
              <div className="dropdown-menu dropdown-menu-right">
                <Link
                  to="#"
                  className="dropdown-item active"
                  onClick={() => changeLanguage("en")}>
                  
                  <img src={englishFlag} alt="img" height={16} />
                  {"English"}
                  {/* {t("English")} */}
                </Link>
                <Link
                  to="#"
                  className="dropdown-item"
                  onClick={() => changeLanguage("fr")}>
                  
                  <img src={arabicFlag} alt="img" height={16} /> Arabic
                </Link>
              </div>
            </li>
            {/* /Flag */}
            <li className="nav-item nav-item-box">
              <Link
                to="#"
                id="btnFullscreen"
                onClick={() => toggleFullscreen()}
                className={isFullscreen ? "Exit Fullscreen" : "Go Fullscreen"}>
                
                {/* <i data-feather="maximize" /> */}
                <i className="ti ti-maximize"></i>
              </Link>
            </li>
            <li className="nav-item nav-item-box">
              <Link to="/email">
                {/* <i data-feather="mail" /> */}
                <i className="ti ti-mail"></i>
                <span className="badge rounded-pill">1</span>
              </Link>
            </li>
            {/* Notifications */}
            <li className="nav-item dropdown nav-item-box">
              <Link
                to="#"
                className="dropdown-toggle nav-link"
                data-bs-toggle="dropdown">
                
                {/* <i data-feather="bell" /> */}
                <i className="ti ti-bell"></i>
                {/* <span className="badge rounded-pill">2</span> */}
              </Link>
              <div className="dropdown-menu notifications">
                <div className="topnav-dropdown-header">
                  <h5 className="notification-title">Notifications</h5>
                  <Link to="#" className="clear-noti">
                    Mark all as read
                  </Link>
                </div>
                <div className="noti-content">
                  <ul className="notification-list">
                    <li className="notification-message">
                      <Link to={route.activities}>
                        <div className="media d-flex">
                          <span className="avatar flex-shrink-0">
                            <img alt="Img" src={avatar_13} />
                          </span>
                          <div className="flex-grow-1">
                            <p className="noti-details">
                              <span className="noti-title">James Kirwin</span>{" "}
                              confirmed his order. Order No: #78901.Estimated
                              delivery: 2 days
                            </p>
                            <p className="noti-time">4 mins ago</p>
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li className="notification-message">
                      <Link to={route.activities}>
                        <div className="media d-flex">
                          <span className="avatar flex-shrink-0">
                            <img alt="Img" src={avatar_03} />
                          </span>
                          <div className="flex-grow-1">
                            <p className="noti-details">
                              <span className="noti-title">Leo Kelly</span>{" "}
                              cancelled his order scheduled for 17 Jan 2025
                            </p>
                            <p className="noti-time">10 mins ago</p>
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li className="notification-message">
                      <Link to={route.activities} className="recent-msg">
                        <div className="media d-flex">
                          <span className="avatar flex-shrink-0">
                            <img alt="Img" src={avatar_17} />
                          </span>
                          <div className="flex-grow-1">
                            <p className="noti-details">
                              Payment of $50 received for Order #67890 from{" "}
                              <span className="noti-title">Antonio Engle</span>
                            </p>
                            <p className="noti-time">05 mins ago</p>
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li className="notification-message">
                      <Link to={route.activities} className="recent-msg">
                        <div className="media d-flex">
                          <span className="avatar flex-shrink-0">
                            <img alt="Img" src={avatar_02} />
                          </span>
                          <div className="flex-grow-1">
                            <p className="noti-details">
                              <span className="noti-title">Andrea</span>{" "}
                              confirmed his order. Order No: #73401.Estimated
                              delivery: 3 days
                            </p>
                            <p className="noti-time">4 mins ago</p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="topnav-dropdown-footer d-flex align-items-center gap-3">
                  <Link to="#" className="btn btn-secondary btn-md w-100">
                    Cancel
                  </Link>
                  <Link
                    to={route.activities}
                    className="btn btn-primary btn-md w-100">
                    
                    View all
                  </Link>
                </div>
              </div>
            </li>
            {/* /Notifications */}
            <li className="nav-item nav-item-box">
              <Link to="/general-settings">
                <i className="feather icon-settings"></i>
              </Link>
            </li>
            <li className="nav-item dropdown has-arrow main-drop profile-nav">
              <Link
                to="#"
                className="nav-link userset"
                data-bs-toggle="dropdown">
                
                <span className="user-info p-0">
                  <span className="user-letter">
                    <img src={avator1} alt="Img" className="img-fluid" />
                  </span>
                </span>
              </Link>
              <div className="dropdown-menu menu-drop-user">
                <div className="profileset d-flex align-items-center">
                  <span className="user-img me-2">
                    <img src={avator1} alt="Img" />
                  </span>
                  <div>
                    <h6 className="fw-medium">John Smilga</h6>
                    <p>Admin</p>
                  </div>
                </div>
                <Link className="dropdown-item" to={route.profile}>
                  <i className="ti ti-user-circle me-2" />
                  MyProfile
                </Link>
                <Link className="dropdown-item" to={route.salesreport}>
                  <i className="ti ti-file-text me-2" />
                  Reports
                </Link>
                <Link className="dropdown-item" to={route.generalsettings}>
                  <i className="ti ti-settings-2 me-2" />
                  Settings
                </Link>
                <hr className="my-2" />
                <a className="dropdown-item logout pb-0" href="#" onClick={async (ev) => { ev.preventDefault(); try { await fetchWithAuth('/api/auth/logout', { method: 'POST' }); } catch (e) { /* ignore */ } clearToken(); navigate(route.signin); }}>
                  <i className="ti ti-logout me-2" />
                  Logout
                </a>
              </div>
            </li>
          </ul>
          {/* /Header Menu */}
          {/* Mobile Menu */}
          <div className="dropdown mobile-user-menu">
            <Link
              to="#"
              className="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false">
              
              <i className="fa fa-ellipsis-v" />
            </Link>
            <div className="dropdown-menu dropdown-menu-right">
              <Link className="dropdown-item" to="profile">
                My Profile
              </Link>
              <Link className="dropdown-item" to="generalsettings">
                Settings
              </Link>
              <Link className="dropdown-item" to="signin">
                Logout
              </Link>
            </div>
          </div>
          {/* /Mobile Menu */}
        </div>
      </div>

      {/* Patient profile modal from header search */}
      {showPatientModal && selectedPatient && (
        <div
          style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:3000, display:'flex', alignItems:'center', justifyContent:'center'}}
          onClick={() => { setShowPatientModal(false); }}
        >
          <div role="dialog" aria-modal="true" className="card" style={{width: 760, maxWidth:'95%'}} onClick={(e) => e.stopPropagation()}>
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="mb-0">Patient Profile</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowPatientModal(false)} />
            </div>
            <div className="card-body d-flex gap-3">
              <div style={{width: 160}}>
                {selectedPatient.photo ? (
                  <img src={selectedPatient.photo} alt="patient" style={{width:'100%',height:160,objectFit:'cover',borderRadius:6}} />
                ) : (
                  <div style={{width:'100%',height:160,background:'#f1f1f1',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}>No photo</div>
                )}
              </div>
              <div style={{flex:1}}>
                <h4 className="mb-1">{selectedPatient.name}</h4>
                <div className="small text-muted mb-2">{selectedPatient.guardianName ? `Guardian: ${selectedPatient.guardianName}` : ''}</div>
                <div className="row g-2">
                  <div className="col-md-6"><strong>Phone:</strong> {selectedPatient.mobilePrimary || '-'}</div>
                  <div className="col-md-6"><strong>Email:</strong> {selectedPatient.email || '-'}</div>
                  <div className="col-md-6"><strong>Age / DOB:</strong> {selectedPatient.age || '-'} {selectedPatient.dob ? ` / ${selectedPatient.dob}` : ''}</div>
                  <div className="col-md-6"><strong>Gender:</strong> {selectedPatient.gender || '-'}</div>
                  <div className="col-md-6"><strong>Blood Group:</strong> {selectedPatient.bloodGroup || '-'}</div>
                  <div className="col-md-6"><strong>Marital Status:</strong> {selectedPatient.maritalStatus || '-'}</div>
                  <div className="col-12 mt-2"><strong>Address:</strong> {selectedPatient.address || '-'}</div>
                  <div className="col-12 mt-2"><strong>Allergies:</strong> {selectedPatient.allergies || '-'}</div>
                </div>
              </div>
              <div style={{width:180}}>
                <div className="d-flex flex-column gap-2">
                  <button type="button" className="btn btn-primary" onClick={() => setShowPatientModal(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient modal (quick add from header) */}
      {showAddPatientModal && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:3100, display:'flex', alignItems:'center', justifyContent:'center'}} onClick={() => setShowAddPatientModal(false)}>
          <div role="dialog" aria-modal="true" className="card" style={{width: 820, maxWidth:'95%'}} onClick={(e) => e.stopPropagation()}>
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="mb-0">Add Patient</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowAddPatientModal(false)} />
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Name<span className="text-danger">*</span></label>
                  <input className={`form-control ${npErrors.name ? 'is-invalid':''}`} value={newPatient.name} onChange={(e) => setNewPatient(prev => ({...prev, name: e.target.value}))} />
                  {npErrors.name && <div className="invalid-feedback">{npErrors.name}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Guardian</label>
                  <input className="form-control" value={newPatient.guardianName} onChange={(e) => setNewPatient(prev => ({...prev, guardianName: e.target.value}))} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Mobile<span className="text-danger">*</span></label>
                  <input className={`form-control ${npErrors.mobilePrimary ? 'is-invalid':''}`} value={newPatient.mobilePrimary} onChange={(e) => setNewPatient(prev => ({...prev, mobilePrimary: e.target.value}))} />
                  {npErrors.mobilePrimary && <div className="invalid-feedback">{npErrors.mobilePrimary}</div>}
                </div>
                <div className="col-md-4">
                  <label className="form-label">Email</label>
                  <input className="form-control" value={newPatient.email} onChange={(e) => setNewPatient(prev => ({...prev, email: e.target.value}))} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Gender</label>
                  <input className="form-control" value={newPatient.gender} onChange={(e) => setNewPatient(prev => ({...prev, gender: e.target.value}))} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">DOB</label>
                  <input type="date" className="form-control" value={newPatient.dob} onChange={(e) => setNewPatient(prev => ({...prev, dob: e.target.value}))} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Age</label>
                  <input className="form-control" value={newPatient.age} onChange={(e) => setNewPatient(prev => ({...prev, age: e.target.value}))} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Photo</label>
                  <input type="file" accept="image/*" className="form-control" onChange={handleNewPatientPhoto} />
                </div>
                <div className="col-12">
                  <label className="form-label">Address</label>
                  <input className="form-control" value={newPatient.address} onChange={(e) => setNewPatient(prev => ({...prev, address: e.target.value}))} />
                </div>
                <div className="col-12">
                  <label className="form-label">Allergies</label>
                  <input className="form-control" value={newPatient.allergies} onChange={(e) => setNewPatient(prev => ({...prev, allergies: e.target.value}))} />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowAddPatientModal(false)}>Cancel</button>
                <button type="button" className="btn btn-success" onClick={saveNewPatientFromHeader}>Save Patient</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>);

};

export default Header;