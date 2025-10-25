
import { Link } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import Chart from "react-apexcharts";
import ReactApexChart from "react-apexcharts";
import { Doughnut } from "react-chartjs-2";
import ApexCharts from "react-apexcharts";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend } from
"chart.js";
import { all_routes } from "../../routes/all_routes";
import {
  customer11,
  customer12,
  customer13,
  customer14,
  customer15,
  customer16,
  customer17,
  customer18,
  product1,
  product10,
  product11,
  product12,
  product13,
  product14,
  product15,
  product16,
  product3,
  product4,
  product5,
  product6,
  product7,
  product8,
  product9 } from
"../../utils/imagepath";
import CommonDateRangePicker from "../../components/date-range-picker/common-date-range-picker";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
const NewDashboard = () => {
  const route = all_routes;

  const salesDayChart = {
    chart: {
      height: 245,
      type: "bar",
      stacked: true,
      toolbar: {
        show: false
      }
    },
  colors: ["#0B6E99", "#8ED1D1"],
    responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: "bottom",
          offsetX: -10,
          offsetY: 0
        }
      }
    }],

    plotOptions: {
      bar: {
        borderRadius: 8,
        borderRadiusWhenStacked: "all",
        horizontal: false,
        endingShape: "rounded"
      }
    },
    series: [
    {
      name: "Admissions",
      data: [12, 18, 14, 20, 22, 18, 12, 10, 8, 15, 20, 18]
    },
    {
      name: "Discharges",
      data: [8, 10, 12, 9, 14, 12, 6, 8, 10, 12, 15, 10]
    }],

    xaxis: {
  categories: [
  "00",
  "02",
  "04",
  "06",
  "08",
  "10",
  "12",
  "14",
  "16",
  "18",
  "20",
  "22"],

      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "13px"
        }
      }
    },
    yaxis: {
      labels: {
  formatter: (val) => `${val}`,
        offsetX: -15,
        style: {
          colors: "#6B7280",
          fontSize: "13px"
        }
      }
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 5,
      padding: {
        left: -16,
        top: 0,
        bottom: 0,
        right: 0
      }
    },
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1
    }
  };

  const customerChart = {
    chart: {
      type: "radialBar",
      height: 130,
      width: "100%",
      parentHeightOffset: 0,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 10,
          size: "30%"
        },
        track: {
          background: "#E6EAED",
          strokeWidth: "100%",
          margin: 5
        },
        dataLabels: {
          name: {
            offsetY: -5
          },
          value: {
            offsetY: 5
          }
        }
      }
    },
    grid: {
      padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
    },
    stroke: {
      lineCap: "round"
    },
    colors: ["#0B6E99", "#1FB6C7"],
    labels: ["Inpatients", "Outpatients"]
  };

  const series = [65, 35];

  const options = {
    series: [
    {
      name: "Admissions",
      data: [32, 45, 28, 50, 46, 38, 45, 35, 40, 28, 22, 30]
    },
    {
      name: "Discharges",
      data: [-20, -25, -18, -30, -28, -20, -24, -22, -18, -20, -15, -18]
    }],

    grid: {
      padding: {
        top: 5,
        right: 5
      }
    },
  colors: ["#0B6E99", "#E04F16"],
    chart: {
      type: "bar",
      height: 290,
      stacked: true,
      zoom: {
        enabled: true
      }
    },
    responsive: [
    {
      breakpoint: 280,
      options: {
        legend: {
          position: "bottom",
          offsetY: 0
        }
      }
    }],

    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        borderRadiusApplication: "around",
        borderRadiusWhenStacked: "all",
        columnWidth: "20%"
      }
    },
    dataLabels: {
      enabled: false
    },
    yaxis: {
      labels: {
        offsetX: -15,
        formatter: (val) => `${val}`
      },
      min: -60,
      max: 60,
      tickAmount: 6
    },
    xaxis: {
  categories: [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"]

    },
    legend: {
      show: false
    },
    fill: {
      opacity: 1
    }
  };

  const data = {
    datasets: [
    {
      label: ["Emergency", "Surgery", "General"],
      data: [40, 35, 25],
      backgroundColor: ["#0B6E99", "#E04F16", "#8ED1D1"],
      borderWidth: 5,
      borderRadius: 10,
      hoverBorderWidth: 0,
      cutout: "50%"
    }]

  };
  const option = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: -20,
        bottom: -20
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  const heat_chart = {
    chart: {
      type: "heatmap",
      height: 370
    },
    plotOptions: {
      heatmap: {
        radius: 4,
        enableShades: false,
        colorScale: {
          ranges: [
          {
            from: 0,
            to: 99,
            color: "#FFE3CB"
          },
          {
            from: 100,
            to: 200,
            color: "#FE9F43"
          }]

        }
      }
    },
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      padding: {
        top: -20,
        bottom: 0,
        left: 0,
        right: 0
      }
    },
    yaxis: {
      labels: {
        offsetX: -15
      }
    },
    series: [
    {
      name: "2 Am",
      data: [
      { x: "Mon", y: 100 },
      { x: "Tue", y: 100 },
      { x: "Wed", y: 100 },
      { x: "Thu", y: 32 },
      { x: "Fri", y: 32 },
      { x: "Sat", y: 32 },
      { x: "Sun", y: 32 }]

    },
    {
      name: "4 Am",
      data: [
      { x: "Mon", y: 100, color: "#ff5722" },
      { x: "Tue", y: 100 },
      { x: "Wed", y: 100 },
      { x: "Thu", y: 120 },
      { x: "Fri", y: 32 },
      { x: "Sat", y: 50 },
      { x: "Sun", y: 40 }]

    },
    {
      name: "6 Am",
      data: [
      { x: "Mon", y: 22 },
      { x: "Tue", y: 29 },
      { x: "Wed", y: 13 },
      { x: "Thu", y: 32 },
      { x: "Fri", y: 32 },
      { x: "Sat", y: 32 },
      { x: "Sun", y: 32 }]

    },
    {
      name: "8 Am",
      data: [
      { x: "Mon", y: 0 },
      { x: "Tue", y: 29 },
      { x: "Wed", y: 13 },
      { x: "Thu", y: 32 },
      { x: "Fri", y: 30 },
      { x: "Sat", y: 100 },
      { x: "Sun", y: 100 }]

    },
    {
      name: "10 Am",
      data: [
      { x: "Mon", y: 200 },
      { x: "Tue", y: 200 },
      { x: "Wed", y: 200 },
      { x: "Thu", y: 32 },
      { x: "Fri", y: 0 },
      { x: "Sat", y: 0 },
      { x: "Sun", y: 32 }]

    },
    {
      name: "12 Am",
      data: [
      { x: "Mon", y: 0 },
      { x: "Tue", y: 0 },
      { x: "Wed", y: 75 },
      { x: "Thu", y: 0 },
      { x: "Fri", y: 0 },
      { x: "Sat", y: 0 },
      { x: "Sun", y: 0 }]

    },
    {
      name: "14 Pm",
      data: [
      { x: "Mon", y: 0 },
      { x: "Tue", y: 20 },
      { x: "Wed", y: 13 },
      { x: "Thu", y: 32 },
      { x: "Fri", y: 0 },
      { x: "Sat", y: 0 },
      { x: "Sun", y: 32 }]

    },
    {
      name: "16 Pm",
      data: [
      { x: "Mon", y: 13 },
      { x: "Tue", y: 20 },
      { x: "Wed", y: 13 },
      { x: "Thu", y: 32 },
      { x: "Fri", y: 200 },
      { x: "Sat", y: 13 },
      { x: "Sun", y: 32 }]

    },
    {
      name: "18 Am",
      data: [
      { x: "Mon", y: 0 },
      { x: "Tue", y: 20 },
      { x: "Wed", y: 13 },
      { x: "Thu", y: 32 },
      { x: "Fri", y: 0 },
      { x: "Sat", y: 200 },
      { x: "Sun", y: 200 }]

    }]

  };


  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-2">
          <div className="mb-3">
            <h1 className="mb-1">Welcome, Hospital Admin</h1>
            <p className="fw-medium">
              You have <span className="text-primary fw-bold">120</span>{" "}
              Patients Today
            </p>
          </div>
          <div className="input-icon-start position-relative mb-3">
            <span className="input-icon-addon fs-16 text-gray-9">
              <i className="ti ti-calendar" />
            </span>
           <CommonDateRangePicker />
          </div>
        </div>
        <div className="alert bg-info-transparent alert-dismissible fade show mb-4">
          <div>
            <span>
              <i className="ti ti-alert-triangle fs-14 text-info me-2" />
              ICU Bed Alert:
            </span>
            <span className="text-info fw-semibold">
              Only 2 ICU beds available
            </span>
            . Please reassign or discharge patients.
            <Link
              to="#"
              className="link-info text-decoration-underline fw-semibold"
              data-bs-toggle="modal"
              data-bs-target="#manage-beds">
              Manage Beds
            </Link>
          </div>
          <button
            type="button"
            className="btn-close text-gray-9 fs-14"
            data-bs-dismiss="alert"
            aria-label="Close">
            <i className="ti ti-x" />
          </button>
        </div>
         
         
        <div className="row">
          <>
            {/* Sales & Purchase */}
            <div className="col-xxl-8 col-xl-7 col-sm-12 col-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div className="d-inline-flex align-items-center">
                    <span className="title-icon bg-soft-primary fs-16 me-2">
                      <i className="ti ti-shopping-cart" />
                    </span>
                    <h5 className="card-title mb-0">Admissions &amp; Discharges</h5>
                  </div>
                  <ul className="nav btn-group custom-btn-group">
                    <Link className="btn btn-outline-light" to="#">
                      1D
                    </Link>
                    <Link className="btn btn-outline-light" to="#">
                      1W
                    </Link>
                    <Link className="btn btn-outline-light" to="#">
                      1M
                    </Link>
                    <Link className="btn btn-outline-light" to="#">
                      3M
                    </Link>
                    <Link className="btn btn-outline-light" to="#">
                      6M
                    </Link>
                    <Link className="btn btn-outline-light active" to="#">
                      1Y
                    </Link>
                  </ul>
                </div>
                <div className="card-body pb-0">
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <div className="border p-2 br-8">
                          <p className="d-inline-flex align-items-center mb-1">
                            <i className="ti ti-circle-filled fs-8 text-primary-300 me-1" />
                            Total Admissions
                          </p>
                          <h4>320</h4>
                        </div>
                        <div className="border p-2 br-8">
                          <p className="d-inline-flex align-items-center mb-1">
                            <i className="ti ti-circle-filled fs-8 text-primary me-1" />
                            Total Discharges
                          </p>
                          <h4>240</h4>
                        </div>
                    </div>
                    <div id="sales-daychart">
                      <Chart
                        options={salesDayChart}
                        series={salesDayChart.series}
                        type="bar"
                        height={245} />
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Sales & Purchase */}
          </>

          {/* Top Selling Products */}
          <div className="col-xxl-4 col-xl-5 d-flex">
            <div className="card flex-fill">
              <div className="card-header">
                <div className="d-inline-flex align-items-center">
                  <span className="title-icon bg-soft-info fs-16 me-2">
                    <i className="ti ti-info-circle" />
                  </span>
                  <h5 className="card-title mb-0">Hospital Overview</h5>
                </div>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="info-item border bg-light p-3 text-center">
                      <div className="mb-3 text-info fs-24">
                        <i className="ti ti-user-check" />
                      </div>
                      <p className="mb-1">Suppliers</p>
                      <h5>6987</h5>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="info-item border bg-light p-3 text-center">
                      <div className="mb-3 text-orange fs-24">
                        <i className="ti ti-users" />
                      </div>
                      <p className="mb-1">Customer</p>
                      <h5>4896</h5>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="info-item border bg-light p-3 text-center">
                      <div className="mb-3 text-teal fs-24">
                        <i className="ti ti-shopping-cart" />
                      </div>
                      <p className="mb-1">Orders</p>
                      <h5>487</h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer pb-sm-0">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                  <h6>Department Overview</h6>
                  <div className="dropdown dropdown-wraper">
                    <Link
                      to="#"
                      className="dropdown-toggle btn btn-sm"
                      data-bs-toggle="dropdown"
                      aria-expanded="false">
                      
                      <i className="ti ti-calendar me-1" />
                      Today
                    </Link>
                    <ul className="dropdown-menu p-3">
                      <li>
                        <Link to="#" className="dropdown-item">
                          Today
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item">
                          Weekly
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item">
                          Monthly
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className="col-sm-5">
                    <div id="customer-chart">
                      <Chart
                        options={customerChart}
                        series={series}
                        type="radialBar"
                        height={130} />
                      
                    </div>
                  </div>
                  <div className="col-sm-7">
                    <div className="row gx-0">
                      <div className="col-sm-6">
                        <div className="text-center border-end">
                          <h2 className="mb-1">5.5K</h2>
                          <p className="text-orange mb-2">First Time</p>
                          <span className="badge badge-success badge-xs d-inline-flex align-items-center">
                            <i className="ti ti-arrow-up-left me-1" />
                            25%
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="text-center">
                          <h2 className="mb-1">3.5K</h2>
                          <p className="text-teal mb-2">Return</p>
                          <span className="badge badge-success badge-xs d-inline-flex align-items-center">
                            <i className="ti ti-arrow-up-left me-1" />
                            21%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {/* Top Selling Products */}
          <div className="col-xxl-4 col-md-6 d-flex">
            <div className="card flex-fill">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div className="d-inline-flex align-items-center">
                  <span className="title-icon bg-soft-pink fs-16 me-2">
                    <i className="ti ti-box" />
                  </span>
                  <h5 className="card-title mb-0">Top Departments</h5>
                </div>
                <div className="dropdown">
                  <Link
                    to="#"
                    className="dropdown-toggle btn btn-sm btn-white"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    
                    <i className="ti ti-calendar me-1" />
                    Today
                  </Link>
                  <ul className="dropdown-menu p-3">
                    <li>
                      <Link to="#" className="dropdown-item">
                        Today
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item">
                        Weekly
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item">
                        Monthly
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card-body sell-product">
                <div className="d-flex align-items-center justify-content-between border-bottom">
                  <div className="d-flex align-items-center">
                    <Link to="#" className="avatar avatar-lg">
                      <img src={product1} alt="img" />
                    </Link>
                    <div className="ms-2">
                      <h6 className="fw-bold mb-1">
                        <Link to="#">Emergency Department</Link>
                      </h6>
                      <div className="d-flex align-items-center item-list">
                        <p>Critical Care</p>
                        <p>125 Patients</p>
                      </div>
                    </div>
                  </div>
                  <span className="badge bg-outline-success badge-xs d-inline-flex align-items-center">
                    <i className="ti ti-arrow-up-left me-1" />
                    25%
                  </span>
                </div>
                <div className="d-flex align-items-center justify-content-between border-bottom">
                  <div className="d-flex align-items-center">
                    <Link to="#" className="avatar avatar-lg">
                      <img src={product16} alt="img" />
                    </Link>
                    <div className="ms-2">
                      <h6 className="fw-bold mb-1">
                        <Link to="#">Surgery Department</Link>
                      </h6>
                      <div className="d-flex align-items-center item-list">
                        <p>Scheduled Ops</p>
                        <p>98 Patients</p>
                      </div>
                    </div>
                  </div>
                  <span className="badge bg-outline-success badge-xs d-inline-flex align-items-center">
                    <i className="ti ti-arrow-up-left me-1" />
                    25%
                  </span>
                </div>
                <div className="d-flex align-items-center justify-content-between border-bottom">
                  <div className="d-flex align-items-center">
                    <Link to="#" className="avatar avatar-lg">
                      <img src={product3} alt="img" />
                    </Link>
                    <div className="ms-2">
                      <h6 className="fw-bold mb-1">
                        <Link to="#">General Ward</Link>
                      </h6>
                      <div className="d-flex align-items-center item-list">
                        <p>Inpatients</p>
                        <p>70 Patients</p>
                      </div>
                    </div>
                  </div>
                  <span className="badge bg-outline-success badge-xs d-inline-flex align-items-center">
                    <i className="ti ti-arrow-up-left me-1" />
                    25%
                  </span>
                </div>
                <div className="d-flex align-items-center justify-content-between border-bottom">
                  <div className="d-flex align-items-center">
                    <Link to="#" className="avatar avatar-lg">
                      <img src={product4} alt="img" />
                    </Link>
                    <div className="ms-2">
                      <h6 className="fw-bold mb-1">
                        <Link to="#">Pediatrics</Link>
                      </h6>
                      <div className="d-flex align-items-center item-list">
                        <p>Ward</p>
                        <p>42 Patients</p>
                      </div>
                    </div>
                  </div>
                  <span className="badge bg-outline-danger badge-xs d-inline-flex align-items-center">
                    <i className="ti ti-arrow-down-left me-1" />
                    21%
                  </span>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <Link to="#" className="avatar avatar-lg">
                      <img src={product5} alt="img" />
                    </Link>
                    <div className="ms-2">
                      <h6 className="fw-bold mb-1">
                        <Link to="#">Samsung Galaxy S21 Fe 5g</Link>
                      </h6>
                      <div className="d-flex align-items-center item-list">
                        <p>$898</p>
                        <p>365+ Sales</p>
                      </div>
                    </div>
                  </div>
                  <span className="badge bg-outline-success badge-xs d-inline-flex align-items-center">
                    <i className="ti ti-arrow-up-left me-1" />
                    25%
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* /Top Selling Products */}
          {/* Low Stock Products */}
          <div className="col-xxl-4 col-md-6 d-flex">
            <div className="card flex-fill">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div className="d-inline-flex align-items-center">
                  <span className="title-icon bg-soft-danger fs-16 me-2">
                    <i className="ti ti-alert-triangle" />
                  </span>
                  <h5 className="card-title mb-0">Critical Supplies</h5>
                </div>
                <Link
                  to={route.lowstock}
                  className="fs-13 fw-bold text-decoration-underline">
                  
                  View All
                </Link>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center">
                    <Link to="#" className="avatar avatar-lg">
                      <img src={product6} alt="img" />
                    </Link>
                    <div className="ms-2">
                      <h6 className="fw-bold mb-1">
                        <Link to="#">Ventilator - Model V20</Link>
                      </h6>
                      <p className="fs-13">Serial : #V20-665814</p>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="fs-13 mb-1">Instock</p>
                    <h6 className="text-orange fw-bold">08</h6>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center">
                    <Link to="#" className="avatar avatar-lg">
                      <img src={product7} alt="img" />
                    </Link>
                    <div className="ms-2">
                      <h6 className="fw-bold mb-1">
                        <Link to="#">Oxygen Cylinder</Link>
                      </h6>
                      <p className="fs-13">Serial : #OX-940004</p>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="fs-13 mb-1">Instock</p>
                    <h6 className="text-orange fw-bold">14</h6>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center">
                    <Link to="#" className="avatar avatar-lg">
                      <img src={product8} alt="img" />
                    </Link>
                    <div className="ms-2">
                      <h6 className="fw-bold mb-1">
                        <Link to="#">PPE Kits</Link>
                      </h6>
                      <p className="fs-13">Batch : #PPE-325569</p>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="fs-13 mb-1">Instock</p>
                    <h6 className="text-orange fw-bold">21</h6>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center">
                    <Link to="#" className="avatar avatar-lg">
                      <img src={product9} alt="img" />
                    </Link>
                    <div className="ms-2">
                      <h6 className="fw-bold mb-1">
                        <Link to="#">Glucose Strips</Link>
                      </h6>
                      <p className="fs-13">Batch : #GL-124588</p>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="fs-13 mb-1">Instock</p>
                    <h6 className="text-orange fw-bold">12</h6>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-0">
                  <div className="d-flex align-items-center">
                    <Link to="#" className="avatar avatar-lg">
                      <img src={product10} alt="img" />
                    </Link>
                    <div className="ms-2">
                      <h6 className="fw-bold mb-1">
                        <Link to="#">IV Fluids</Link>
                      </h6>
                      <p className="fs-13">Batch : #IV-365586</p>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="fs-13 mb-1">Instock</p>
                    <h6 className="text-orange fw-bold">10</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Low Stock Products */}
          {/* Recent Sales */}
          <div className="col-xxl-4 col-md-12 d-flex">
            <div className="card flex-fill">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div className="d-inline-flex align-items-center">
                  <span className="title-icon bg-soft-pink fs-16 me-2">
                    <i className="ti ti-box" />
                  </span>
                  <h5 className="card-title mb-0">Recent Admissions</h5>
                </div>
                <div className="dropdown">
                  <Link
                    to="#"
                    className="dropdown-toggle btn btn-sm btn-white"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    
                    <i className="ti ti-calendar me-1" />
                    Weekly
                  </Link>
                  <ul className="dropdown-menu p-3">
                    <li>
                      <Link to="#" className="dropdown-item">
                        Today
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item">
                        Weekly
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item">
                        Monthly
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center">
                    <Link to="#" className="avatar avatar-lg">
                      <img src={customer16} alt="img" />
                    </Link>
                    <div className="ms-2">
                      <h6 className="fw-bold mb-1">
                        <Link to="#">John Doe</Link>
                      </h6>
                      <div className="d-flex align-items-center item-list">
                        <p>Emergency</p>
                        <p className="text-gray-9">Room: ER-12</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="fs-13 mb-1">Today</p>
                    <span className="badge badge-success badge-xs d-inline-flex align-items-center">
                      <i className="ti ti-circle-filled fs-5 me-1" />
                      Admitted
                    </span>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center">
                    <Link to="#" className="avatar avatar-lg">
                      <img src={customer17} alt="img" />
                    </Link>
                    <div className="ms-2">
                      <h6 className="fw-bold mb-1">
                        <Link to="#">Mary Smith</Link>
                      </h6>
                      <div className="d-flex align-items-center item-list">
                        <p>Surgery</p>
                        <p className="text-gray-9">Scheduled Op: OR-3</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="fs-13 mb-1">Today</p>
                    <span className="badge badge-warning badge-xs d-inline-flex align-items-center">
                      <i className="ti ti-circle-filled fs-5 me-1" />
                      Scheduled
                    </span>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center">
                    <Link to="#" className="avatar avatar-lg">
                      <img src={customer18} alt="img" />
                    </Link>
                    <div className="ms-2">
                      <h6 className="fw-bold mb-1">
                        <Link to="#">Liam Brown</Link>
                      </h6>
                      <div className="d-flex align-items-center item-list">
                        <p>General Ward</p>
                        <p className="text-gray-9">Age: 54</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="fs-13 mb-1">15 Oct 2025</p>
                    <span className="badge badge-cyan badge-xs d-inline-flex align-items-center">
                      <i className="ti ti-circle-filled fs-5 me-1" />
                      Under Observation
                    </span>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center">
                    <Link to="#" className="avatar avatar-lg">
                      <img src={customer15} alt="img" />
                    </Link>
                    <div className="ms-2">
                      <h6 className="fw-bold mb-1">
                        <Link to="#">Emma Johnson</Link>
                      </h6>
                      <div className="d-flex align-items-center item-list">
                        <p>Pediatrics</p>
                        <p className="text-gray-9">Room: P-21</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="fs-13 mb-1">12 Oct 2025</p>
                    <span className="badge bg-purple badge-xs d-inline-flex align-items-center">
                      <i className="ti ti-circle-filled fs-5 me-1" />
                      Admitted
                    </span>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-0">
                  <div className="d-flex align-items-center">
                    <Link to="#" className="avatar avatar-lg">
                      <img src={customer11} alt="img" />
                    </Link>
                    <div className="ms-2">
                      <h6 className="fw-bold mb-1">
                        <Link to="#">Oliver Davis</Link>
                      </h6>
                      <div className="d-flex align-items-center item-list">
                        <p>Maternity</p>
                        <p className="text-gray-9">Room: M-05</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="fs-13 mb-1">11 Oct 2025</p>
                    <span className="badge badge-success badge-xs d-inline-flex align-items-center">
                      <i className="ti ti-circle-filled fs-5 me-1" />
                      Discharged
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Recent Sales */}
        </div>
        <div className="row">
          {/* Sales Statics */}
          <div className="col-xl-6 col-sm-12 col-12 d-flex">
            <div className="card flex-fill">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div className="d-inline-flex align-items-center">
                  <span className="title-icon bg-soft-danger fs-16 me-2">
                    <i className="ti ti-alert-triangle" />
                  </span>
                  <h5 className="card-title mb-0">Admissions Statistics</h5>
                </div>
                <div className="dropdown">
                  <Link
                    to="#"
                    className="dropdown-toggle btn btn-sm btn-white"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    
                    <i className="ti ti-calendar me-1" />
                    2025
                  </Link>
                  <ul className="dropdown-menu p-3">
                    <li>
                      <Link to="#" className="dropdown-item">
                        2025
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item">
                        2022
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item">
                        2021
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card-body pb-0">
                <div className="d-flex align-items-center flex-wrap gap-2">
                  <div className="border p-2 br-8">
                    <h5 className="d-inline-flex align-items-center text-teal">
                      $12,189
                      <span className="badge badge-success badge-xs d-inline-flex align-items-center ms-2">
                        <i className="ti ti-arrow-up-left me-1" />
                        25%
                      </span>
                    </h5>
                    <p>Revenue</p>
                  </div>
                  <div className="border p-2 br-8">
                    <h5 className="d-inline-flex align-items-center text-orange">
                      $48,988,078
                      <span className="badge badge-danger badge-xs d-inline-flex align-items-center ms-2">
                        <i className="ti ti-arrow-down-right me-1" />
                        25%
                      </span>
                    </h5>
                    <p>Expense</p>
                  </div>
                </div>
                <div id="sales-statistics">
                  <ReactApexChart
                    options={options}
                    series={options.series}
                    type="bar"
                    height={290} />
                  
                </div>
              </div>
            </div>
          </div>
          {/* /Sales Statics */}
          {/* Recent Transactions */}
          <div className="col-xl-6 col-sm-12 col-12 d-flex">
            <div className="card flex-fill">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div className="d-inline-flex align-items-center">
                  <span className="title-icon bg-soft-orange fs-16 me-2">
                    <i className="ti ti-flag" />
                  </span>
                  <h5 className="card-title mb-0">Recent Activities</h5>
                </div>
                <Link
                  to={route.onlineorder}
                  className="fs-13 fw-medium text-decoration-underline">
                  
                  View All
                </Link>
              </div>
              <div className="card-body p-0">
                <ul className="nav nav-tabs nav-justified transaction-tab">
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      to="#sale"
                      data-bs-toggle="tab">
                      
                      Sale
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="#purchase-transaction"
                      data-bs-toggle="tab">
                      
                      Purchase
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="#quotation"
                      data-bs-toggle="tab">
                      
                      Quotation
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="#expenses"
                      data-bs-toggle="tab">
                      
                      Expenses
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="#invoices"
                      data-bs-toggle="tab">
                      
                      Invoices
                    </Link>
                  </li>
                </ul>
                <div className="tab-content">
                  <div className="tab-pane show active" id="sale">
                    <div className="table-responsive">
                      <table className="table table-borderless custom-table">
                        <thead className="thead-light">
                          <tr>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Status</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>24 May 2025</td>
                            <td>
                              <div className="d-flex align-items-center file-name-icon">
                                <Link to="#" className="avatar avatar-md">
                                  <img
                                    src={customer16}
                                    className="img-fluid"
                                    alt="img" />
                                  
                                </Link>
                                <div className="ms-2">
                                  <h6 className="fw-medium">
                                    <Link to="#">Andrea Willer</Link>
                                  </h6>
                                  <span className="fs-13 text-orange">
                                    #114589
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-success badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Completed
                              </span>
                            </td>
                            <td className="fs-16 fw-bold text-gray-9">
                              $4,560
                            </td>
                          </tr>
                          <tr>
                            <td>23 May 2025</td>
                            <td>
                              <div className="d-flex align-items-center file-name-icon">
                                <Link to="#" className="avatar avatar-md">
                                  <img
                                    src={customer17}
                                    className="img-fluid"
                                    alt="img" />
                                  
                                </Link>
                                <div className="ms-2">
                                  <h6 className="fw-medium">
                                    <Link to="#">Timothy Sandsr</Link>
                                  </h6>
                                  <span className="fs-13 text-orange">
                                    #114589
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-success badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Completed
                              </span>
                            </td>
                            <td className="fs-16 fw-bold text-gray-9">
                              $3,569
                            </td>
                          </tr>
                          <tr>
                            <td>22 May 2025</td>
                            <td>
                              <div className="d-flex align-items-center file-name-icon">
                                <Link to="#" className="avatar avatar-md">
                                  <img
                                    src={customer18}
                                    className="img-fluid"
                                    alt="img" />
                                  
                                </Link>
                                <div className="ms-2">
                                  <h6 className="fw-medium">
                                    <Link to="#">Bonnie Rodrigues</Link>
                                  </h6>
                                  <span className="fs-13 text-orange">
                                    #114589
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-pink badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Draft
                              </span>
                            </td>
                            <td className="fs-16 fw-bold text-gray-9">
                              $4,560
                            </td>
                          </tr>
                          <tr>
                            <td>21 May 2025</td>
                            <td>
                              <div className="d-flex align-items-center file-name-icon">
                                <Link to="#" className="avatar avatar-md">
                                  <img
                                    src={customer15}
                                    className="img-fluid"
                                    alt="img" />
                                  
                                </Link>
                                <div className="ms-2">
                                  <h6 className="fw-medium">
                                    <Link to="#">Randy McCree</Link>
                                  </h6>
                                  <span className="fs-13 text-orange">
                                    #114589
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-success badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Completed
                              </span>
                            </td>
                            <td className="fs-16 fw-bold text-gray-9">
                              $2,155
                            </td>
                          </tr>
                          <tr>
                            <td>21 May 2025</td>
                            <td>
                              <div className="d-flex align-items-center file-name-icon">
                                <Link to="#" className="avatar avatar-md">
                                  <img
                                    src={customer13}
                                    className="img-fluid"
                                    alt="img" />
                                  
                                </Link>
                                <div className="ms-2">
                                  <h6 className="fw-medium">
                                    <Link to="#">Dennis Anderson</Link>
                                  </h6>
                                  <span className="fs-13 text-orange">
                                    #114589
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-success badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Completed
                              </span>
                            </td>
                            <td className="fs-16 fw-bold text-gray-9">
                              $5,123
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="purchase-transaction">
                    <div className="table-responsive">
                      <table className="table table-borderless custom-table">
                        <thead className="thead-light">
                          <tr>
                            <th>Date</th>
                            <th>Supplier</th>
                            <th>Status</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>24 May 2025</td>
                            <td>
                              <Link to="#" className="fw-semibold">
                                Electro Mart
                              </Link>
                            </td>
                            <td>
                              <span className="badge badge-success badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Completed
                              </span>
                            </td>
                            <td className="text-gray-9">$1000</td>
                          </tr>
                          <tr>
                            <td>23 May 2025</td>
                            <td>
                              <Link to="#" className="fw-semibold">
                                Quantum Gadgets
                              </Link>
                            </td>
                            <td>
                              <span className="badge badge-success badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Completed
                              </span>
                            </td>
                            <td className="text-gray-9">$1500</td>
                          </tr>
                          <tr>
                            <td>22 May 2025</td>
                            <td>
                              <Link to="#" className="fw-semibold">
                                Prime Bazaar
                              </Link>
                            </td>
                            <td>
                              <span className="badge badge-cyan badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Pending
                              </span>
                            </td>
                            <td className="text-gray-9">$2000</td>
                          </tr>
                          <tr>
                            <td>21 May 2025</td>
                            <td>
                              <Link to="#" className="fw-semibold">
                                Alpha Mobiles
                              </Link>
                            </td>
                            <td>
                              <span className="badge badge-success badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Completed
                              </span>
                            </td>
                            <td className="text-gray-9">$1200</td>
                          </tr>
                          <tr>
                            <td>21 May 2025</td>
                            <td>
                              <Link to="#" className="fw-semibold">
                                Aesthetic Bags
                              </Link>
                            </td>
                            <td>
                              <span className="badge badge-success badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Completed
                              </span>
                            </td>
                            <td className="text-gray-9">$1300</td>
                          </tr>
                          <tr>
                            <td>28 May 2025</td>
                            <td>
                              <Link to="#" className="fw-semibold">
                                Sigma Chairs
                              </Link>
                            </td>
                            <td>
                              <span className="badge badge-success badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Completed
                              </span>
                            </td>
                            <td className="text-gray-9">$1600</td>
                          </tr>
                          <tr>
                            <td>26 May 2025</td>
                            <td>
                              <Link to="#" className="fw-semibold">
                                A-Z Store s
                              </Link>
                            </td>
                            <td>
                              <span className="badge badge-success badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Completed
                              </span>
                            </td>
                            <td className="text-gray-9">$1100</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="tab-pane" id="quotation">
                    <div className="table-responsive">
                      <table className="table table-borderless custom-table">
                        <thead className="thead-light">
                          <tr>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Status</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>24 May 2025</td>
                            <td>
                              <div className="d-flex align-items-center file-name-icon">
                                <Link to="#" className="avatar avatar-md">
                                  <img
                                    src={customer16}
                                    className="img-fluid"
                                    alt="img" />
                                  
                                </Link>
                                <div className="ms-2">
                                  <h6 className="fw-medium">
                                    <Link to="#">Andrea Willer</Link>
                                  </h6>
                                  <span className="fs-13 text-orange">
                                    #114589
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-success badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Sent
                              </span>
                            </td>
                            <td className="text-gray-9">$4,560</td>
                          </tr>
                          <tr>
                            <td>23 May 2025</td>
                            <td>
                              <div className="d-flex align-items-center file-name-icon">
                                <Link to="#" className="avatar avatar-md">
                                  <img
                                    src={customer17}
                                    className="img-fluid"
                                    alt="img" />
                                  
                                </Link>
                                <div className="ms-2">
                                  <h6 className="fw-medium">
                                    <Link to="#">Timothy Sandsr</Link>
                                  </h6>
                                  <span className="fs-13 text-orange">
                                    #114589
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-warning badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Ordered
                              </span>
                            </td>
                            <td className="text-gray-9">$3,569</td>
                          </tr>
                          <tr>
                            <td>22 May 2025</td>
                            <td>
                              <div className="d-flex align-items-center file-name-icon">
                                <Link to="#" className="avatar avatar-md">
                                  <img
                                    src={customer18}
                                    className="img-fluid"
                                    alt="img" />
                                  
                                </Link>
                                <div className="ms-2">
                                  <h6 className="fw-medium">
                                    <Link to="#">Bonnie Rodrigues</Link>
                                  </h6>
                                  <span className="fs-13 text-orange">
                                    #114589
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-cyan badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Pending
                              </span>
                            </td>
                            <td className="text-gray-9">$4,560</td>
                          </tr>
                          <tr>
                            <td>21 May 2025</td>
                            <td>
                              <div className="d-flex align-items-center file-name-icon">
                                <Link to="#" className="avatar avatar-md">
                                  <img
                                    src={customer15}
                                    className="img-fluid"
                                    alt="img" />
                                  
                                </Link>
                                <div className="ms-2">
                                  <h6 className="fw-medium">
                                    <Link to="#">Randy McCree</Link>
                                  </h6>
                                  <span className="fs-13 text-orange">
                                    #114589
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-warning badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Ordered
                              </span>
                            </td>
                            <td className="text-gray-9">$2,155</td>
                          </tr>
                          <tr>
                            <td>21 May 2025</td>
                            <td>
                              <div className="d-flex align-items-center file-name-icon">
                                <Link to="#" className="avatar avatar-md">
                                  <img
                                    src={customer13}
                                    className="img-fluid"
                                    alt="img" />
                                  
                                </Link>
                                <div className="ms-2">
                                  <h6 className="fw-medium">
                                    <Link to="#">Dennis Anderson</Link>
                                  </h6>
                                  <span className="fs-13 text-orange">
                                    #114589
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-success badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Sent
                              </span>
                            </td>
                            <td className="text-gray-9">$5,123</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="expenses">
                    <div className="table-responsive">
                      <table className="table table-borderless custom-table">
                        <thead className="thead-light">
                          <tr>
                            <th>Date</th>
                            <th>Expenses</th>
                            <th>Status</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>24 May 2025</td>
                            <td>
                              <h6 className="fw-medium">
                                <Link to="#">Electricity Payment</Link>
                              </h6>
                              <span className="fs-13 text-orange">#EX849</span>
                            </td>
                            <td>
                              <span className="badge badge-success badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Approved
                              </span>
                            </td>
                            <td className="text-gray-9">$200</td>
                          </tr>
                          <tr>
                            <td>23 May 2025</td>
                            <td>
                              <h6 className="fw-medium">
                                <Link to="#">Electricity Payment</Link>
                              </h6>
                              <span className="fs-13 text-orange">#EX849</span>
                            </td>
                            <td>
                              <span className="badge badge-success badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Approved
                              </span>
                            </td>
                            <td className="text-gray-9">$200</td>
                          </tr>
                          <tr>
                            <td>22 May 2025</td>
                            <td>
                              <h6 className="fw-medium">
                                <Link to="#">Stationery Purchase</Link>
                              </h6>
                              <span className="fs-13 text-orange">#EX848</span>
                            </td>
                            <td>
                              <span className="badge badge-success badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Approved
                              </span>
                            </td>
                            <td className="text-gray-9">$50</td>
                          </tr>
                          <tr>
                            <td>21 May 2025</td>
                            <td>
                              <h6 className="fw-medium">
                                <Link to="#">AC Repair Service</Link>
                              </h6>
                              <span className="fs-13 text-orange">#EX847</span>
                            </td>
                            <td>
                              <span className="badge badge-cyan badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Pending
                              </span>
                            </td>
                            <td className="text-gray-9">$800</td>
                          </tr>
                          <tr>
                            <td>21 May 2025</td>
                            <td>
                              <h6 className="fw-medium">
                                <Link to="#">Client Meeting</Link>
                              </h6>
                              <span className="fs-13 text-orange">#EX846</span>
                            </td>
                            <td>
                              <span className="badge badge-success badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Approved
                              </span>
                            </td>
                            <td className="text-gray-9">$100</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="tab-pane" id="invoices">
                    <div className="table-responsive">
                      <table className="table table-borderless custom-table">
                        <thead className="thead-light">
                          <tr>
                            <th>Customer</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center file-name-icon">
                                <Link to="#" className="avatar avatar-md">
                                  <img
                                    src={customer16}
                                    className="img-fluid"
                                    alt="img" />
                                  
                                </Link>
                                <div className="ms-2">
                                  <h6 className="fw-medium">
                                    <Link to="#">Andrea Willer</Link>
                                  </h6>
                                  <span className="fs-13 text-orange">
                                    #INV005
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>24 May 2025</td>
                            <td>
                              <span className="badge badge-success badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Paid
                              </span>
                            </td>
                            <td className="text-gray-9">$1300</td>
                          </tr>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center file-name-icon">
                                <Link to="#" className="avatar avatar-md">
                                  <img
                                    src={customer17}
                                    className="img-fluid"
                                    alt="img" />
                                  
                                </Link>
                                <div className="ms-2">
                                  <h6 className="fw-medium">
                                    <Link to="#">Timothy Sandsr</Link>
                                  </h6>
                                  <span className="fs-13 text-orange">
                                    #INV004
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>23 May 2025</td>
                            <td>
                              <span className="badge badge-warning badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Overdue
                              </span>
                            </td>
                            <td className="text-gray-9">$1250</td>
                          </tr>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center file-name-icon">
                                <Link to="#" className="avatar avatar-md">
                                  <img
                                    src={customer18}
                                    className="img-fluid"
                                    alt="img" />
                                  
                                </Link>
                                <div className="ms-2">
                                  <h6 className="fw-medium">
                                    <Link to="#">Bonnie Rodrigues</Link>
                                  </h6>
                                  <span className="fs-13 text-orange">
                                    #INV003
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>22 May 2025</td>
                            <td>
                              <span className="badge badge-success badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Paid
                              </span>
                            </td>
                            <td className="text-gray-9">$1700</td>
                          </tr>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center file-name-icon">
                                <Link to="#" className="avatar avatar-md">
                                  <img
                                    src={customer15}
                                    className="img-fluid"
                                    alt="img" />
                                  
                                </Link>
                                <div className="ms-2">
                                  <h6 className="fw-medium">
                                    <Link to="#">Randy McCree</Link>
                                  </h6>
                                  <span className="fs-13 text-orange">
                                    #INV002
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>21 May 2025</td>
                            <td>
                              <span className="badge badge-danger badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Unpaid
                              </span>
                            </td>
                            <td className="text-gray-9">$1500</td>
                          </tr>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center file-name-icon">
                                <Link to="#" className="avatar avatar-md">
                                  <img
                                    src={customer13}
                                    className="img-fluid"
                                    alt="img" />
                                  
                                </Link>
                                <div className="ms-2">
                                  <h6 className="fw-medium">
                                    <Link to="#">Dennis Anderson</Link>
                                  </h6>
                                  <span className="fs-13 text-orange">
                                    #INV001
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>21 May 2025</td>
                            <td>
                              <span className="badge badge-success badge-xs d-inline-flex align-items-center">
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                Paid
                              </span>
                            </td>
                            <td className="text-gray-9">$1000</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Recent Transactions */}
        </div>
        <div className="row">
          {/* Top Customers */}
          <div className="col-xxl-4 col-md-6 d-flex">
            <div className="card flex-fill">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div className="d-inline-flex align-items-center">
                  <span className="title-icon bg-soft-orange fs-16 me-2">
                    <i className="ti ti-users" />
                  </span>
                  <h5 className="card-title mb-0">Top Doctors</h5>
                </div>
                <Link
                  to={route.customer}
                  className="fs-13 fw-medium text-decoration-underline">
                  
                  View All
                </Link>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between border-bottom mb-3 pb-3 flex-wrap gap-2">
                  <div className="d-flex align-items-center">
                    <Link to="#" className="avatar avatar-lg flex-shrink-0">
                      <img src={customer11} alt="img" />
                    </Link>
                    <div className="ms-2">
                      <h6 className="fs-14 fw-bold mb-1">
                        <Link to="#">Dr. Carlos Curran</Link>
                      </h6>
                      <div className="d-flex align-items-center item-list">
                        <p className="d-inline-flex align-items-center">
                          <i className="ti ti-stethoscope me-1" />
                          Cardiology
                        </p>
                        <p>24 Patients</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <h5>$8,9645</h5>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between border-bottom mb-3 pb-3 flex-wrap gap-2">
                  <div className="d-flex align-items-center">
                    <Link to="#" className="avatar avatar-lg flex-shrink-0">
                      <img src={customer12} alt="img" />
                    </Link>
                    <div className="ms-2">
                      <h6 className="fs-14 fw-bold mb-1">
                        <Link to="#">Dr. Stan Gaunter</Link>
                      </h6>
                      <div className="d-flex align-items-center item-list">
                        <p className="d-inline-flex align-items-center">
                          <i className="ti ti-stethoscope me-1" />
                          Orthopedics
                        </p>
                        <p>22 Patients</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <h5>$16,985</h5>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between border-bottom mb-3 pb-3 flex-wrap gap-2">
                  <div className="d-flex align-items-center">
                    <Link to="#" className="avatar avatar-lg flex-shrink-0">
                      <img src={customer13} alt="img" />
                    </Link>
                    <div className="ms-2">
                      <h6 className="fs-14 fw-bold mb-1">
                        <Link to="#">Dr. Richard Wilson</Link>
                      </h6>
                      <div className="d-flex align-items-center item-list">
                        <p className="d-inline-flex align-items-center">
                          <i className="ti ti-stethoscope me-1" />
                          Neurology
                        </p>
                        <p>14 Patients</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <h5>$5,366</h5>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between border-bottom mb-3 pb-3 flex-wrap gap-2">
                  <div className="d-flex align-items-center">
                    <Link to="#" className="avatar avatar-lg flex-shrink-0">
                      <img src={customer14} alt="img" />
                    </Link>
                    <div className="ms-2">
                      <h6 className="fs-14 fw-bold mb-1">
                        <Link to="#">Dr. Mary Bronson</Link>
                      </h6>
                      <div className="d-flex align-items-center item-list">
                        <p className="d-inline-flex align-items-center">
                          <i className="ti ti-stethoscope me-1" />
                          Pediatrics
                        </p>
                        <p>08 Patients</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <h5>$4,569</h5>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div className="d-flex align-items-center">
                    <Link to="#" className="avatar avatar-lg flex-shrink-0">
                      <img src={customer15} alt="img" />
                    </Link>
                    <div className="ms-2">
                      <h6 className="fs-14 fw-bold mb-1">
                        <Link to="#">Dr. Annie Tremblay</Link>
                      </h6>
                      <div className="d-flex align-items-center item-list">
                        <p className="d-inline-flex align-items-center">
                          <i className="ti ti-stethoscope me-1" />
                          Obstetrics
                        </p>
                        <p>14 Patients</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <h5>$3,5698</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Top Customers */}
          {/* Top Categories */}
          <div className="col-xxl-4 col-md-6 d-flex">
            <div className="card flex-fill">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div className="d-inline-flex align-items-center">
                  <span className="title-icon bg-soft-orange fs-16 me-2">
                    <i className="ti ti-users" />
                  </span>
                  <h5 className="card-title mb-0">Top Wards</h5>
                </div>
                <div className="dropdown">
                  <Link
                    to="#"
                    className="dropdown-toggle btn btn-sm btn-white d-flex align-items-center"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    
                    <i className="ti ti-calendar me-1" />
                    Weekly
                  </Link>
                  <ul className="dropdown-menu p-3">
                    <li>
                      <Link to="#" className="dropdown-item">
                        Today
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item">
                        Weekly
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item">
                        Monthly
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-4 mb-4">
                  <div>
                    <Doughnut
                      data={data}
                      options={option}
                      style={{
                        boxSizing: "border-box",
                        height: "230px",
                        width: "200px"
                      }} />
                    
                  </div>
                  <div>
                    <div className="category-item category-primary">
                      <p className="fs-13 mb-1">Emergency</p>
                      <h2 className="d-flex align-items-center">
                        125
                        <span className="fs-13 fw-normal text-default ms-1">
                          Patients
                        </span>
                      </h2>
                    </div>
                    <div className="category-item category-orange">
                      <p className="fs-13 mb-1">Surgery</p>
                      <h2 className="d-flex align-items-center">
                        98
                        <span className="fs-13 fw-normal text-default ms-1">
                          Patients
                        </span>
                      </h2>
                    </div>
                    <div className="category-item category-secondary">
                      <p className="fs-13 mb-1">General</p>
                      <h2 className="d-flex align-items-center">
                        70
                        <span className="fs-13 fw-normal text-default ms-1">
                          Patients
                        </span>
                      </h2>
                    </div>
                  </div>
                </div>
                <h6 className="mb-2">Department Statistics</h6>
                <div className="border br-8">
                  <div className="d-flex align-items-center justify-content-between border-bottom p-2">
                    <p className="d-inline-flex align-items-center mb-0">
                      <i className="ti ti-square-rounded-filled text-indigo fs-8 me-2" />
                      Total Departments
                    </p>
                    <h5>12</h5>
                  </div>
                  <div className="d-flex align-items-center justify-content-between p-2">
                    <p className="d-inline-flex align-items-center mb-0">
                      <i className="ti ti-square-rounded-filled text-orange fs-8 me-2" />
                      Total Staff
                    </p>
                    <h5>420</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Top Categories */}
          {/* Order Statistics */}
          <div className="col-xxl-4 col-md-12 d-flex">
            <div className="card flex-fill">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div className="d-inline-flex align-items-center">
                  <span className="title-icon bg-soft-indigo fs-16 me-2">
                    <i className="ti ti-package" />
                  </span>
                  <h5 className="card-title mb-0">Bed Occupancy</h5>
                </div>
                <div className="dropdown">
                  <Link
                    to="#"
                    className="dropdown-toggle btn btn-sm btn-white"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    
                    <i className="ti ti-calendar me-1" />
                    Weekly
                  </Link>
                  <ul className="dropdown-menu p-3">
                    <li>
                      <Link to="#" className="dropdown-item">
                        Today
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item">
                        Weekly
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item">
                        Monthly
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card-body pb-0">
                <div id="heat_chart">
                  <ApexCharts
                    options={heat_chart}
                    series={heat_chart.series}
                    type="heatmap"
                    height={370} />
                  
                </div>
              </div>
            </div>
          </div>
          {/* /Order Statistics */}
        </div>
      </div>
      <div className="copyright-footer d-flex align-items-center justify-content-between border-top bg-white gap-3 flex-wrap">
        <p className="fs-13 text-gray-9 mb-0">
          2014-2025 © Mediseva Healthcare. All Rights Reserved
        </p>
        <p>
          Designed &amp; Developed By Mediseva
        </p>
      </div>
    </div>);

};

export default NewDashboard;