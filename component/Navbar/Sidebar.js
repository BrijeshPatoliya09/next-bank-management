import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Sidebar = () => {
  const router = useRouter();

  const logoutHandler = async () => {
    const res = await fetch(`${process.env.baseUrl}/api/auth/logout`);
    const data = await res.json();
    if (data.message) {
      router.push("/auth/login");
    }
  };

  const path = router.pathname;
  return (
    <>
      <div
        className="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 bg-gradient-dark"
        id="sidenav-main"
      >
        <div className="sidenav-header">
          <i
            className="fas fa-times p-3 cursor-pointer text-white opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
            aria-hidden="true"
            id="iconSidenav"
          ></i>
          <Link className="navbar-brand m-0" href="/">
            <img
              src="/assets/image/logo-ct.png"
              className="navbar-brand-img h-100"
              alt="main_logo"
            />
            <span className="ms-1 font-weight-bold text-white">Dashboard</span>
          </Link>
        </div>
        <hr className="horizontal light mt-0 mb-2" />
        <div
          className="collapse navbar-collapse  w-auto  max-height-vh-100"
          id="sidenav-collapse-main"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                className={`nav-link text-white ${
                  path == "/" ? "active bg-gradient-primary" : ""
                }`}
                href="/"
              >
                <span className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">dashboard</i>
                </span>
                <span className="nav-link-text ms-1">Dashboard</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link text-white ${
                  path == "/table" ? "active bg-gradient-primary" : ""
                }`}
                href="/table"
              >
                <span className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">table_view</i>
                </span>
                <span className="nav-link-text ms-1">Tables</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link text-white ${
                  path == "/bank/create" ? "active bg-gradient-primary" : ""
                }`}
                href="/bank/create"
              >
                <span className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">local_pharmacy</i>
                </span>
                <span className="nav-link-text ms-1">Create bank</span>
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white " href="./pages/billing.html">
                <span className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">receipt_long</i>
                </span>
                <span className="nav-link-text ms-1">Billing</span>
              </a>
            </li>
            {/* <li className="nav-item">
              <a
                className="nav-link text-white "
                href="./pages/virtual-reality.html"
              >
                <span className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">view_in_ar</i>
                </span>
                <span className="nav-link-text ms-1">Virtual Reality</span>
              </a>
            </li> */}
            <li className="nav-item">
              <a className="nav-link text-white " href="./pages/rtl.html">
                <span className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">
                    format_textdirection_r_to_l
                  </i>
                </span>
                <span className="nav-link-text ms-1">RTL</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-white "
                href="./pages/notifications.html"
              >
                <span className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">notifications</i>
                </span>
                <span className="nav-link-text ms-1">Notifications</span>
              </a>
            </li>
            <li className="nav-item mt-3">
              <h6 className="ps-4 ms-2 text-uppercase text-xs text-white font-weight-bolder opacity-8">
                Account pages
              </h6>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white " href="./pages/profile.html">
                <span className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">person</i>
                </span>
                <span className="nav-link-text ms-1">Profile</span>
              </a>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white " href="/auth/login">
                <span className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">login</i>
                </span>
                <span className="nav-link-text ms-1">Sign In</span>
              </Link>
            </li>
            <li className="nav-item">
              <a
                type="button"
                className="nav-link text-white "
                onClick={logoutHandler}
              >
                <span className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">logout</i>
                </span>
                <span className="nav-link-text ms-1">Logout</span>
              </a>
            </li>
            {/* <li className="nav-item">
              <Link className="nav-link text-white " href="/auth/registeration">
                <span className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">assignment</i>
                </span>
                <span className="nav-link-text ms-1">Sign Up</span>
              </Link>
            </li> */}
          </ul>
        </div>
        <div className="sidenav-footer position-absolute w-100 bottom-0 ">
          <div className="mx-3">
            <a
              className="btn bg-gradient-primary mt-4 w-100"
              href="https://www.creative-tim.com/product/material-dashboard-pro?ref=sidebarfree"
              type="button"
            >
              Upgrade to pro
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
