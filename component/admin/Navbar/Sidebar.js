import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Sidebar = () => {
  const router = useRouter();

  const logoutHandler = async () => {
    const res = await fetch(`${process.env.apiUrl}/admin/auth/logout`);
    const data = await res.json();
    if (data.message) {
      router.push("/admin/auth/login");
    }
  };

  const path = router.pathname;
  return (
    <>
      <div
        className="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3"
        id="sidenav-main"
      >
        <div className="sidenav-header">
          <i
            className="fas fa-times p-3 cursor-pointer text-white opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
            aria-hidden="true"
            id="iconSidenav"
          ></i>
          <Link className="navbar-brand m-0" href="/admin">
            <img
              src="/assets/image/admin/logo-ct.png"
              className="navbar-brand-img h-100"
              alt="main_logo"
            />
            <span className="ms-1 font-weight-bold">Dashboard</span>
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
                className={`nav-link  ${path == "/admin" ? "active" : ""}`}
                href="/admin"
              >
                <span className=" text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">dashboard</i>
                </span>
                <span className="nav-link-text ms-1">Dashboard</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link  ${
                  path == "/admin/table" ? "active" : ""
                }`}
                href="/admin/table"
              >
                <span className=" text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">table_view</i>
                </span>
                <span className="nav-link-text ms-1">Employee</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link  ${
                  path == "/admin/bank/create" ? "active" : ""
                }`}
                href="/admin/bank/create"
              >
                <span className=" text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">local_pharmacy</i>
                </span>
                <span className="nav-link-text ms-1">Bank Registration</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link  ${
                  path == "/admin/user/userTable" ? "active" : ""
                }`}
                href="/admin/user/userTable"
              >
                <span className=" text-center me-2 d-flex align-items-center justify-content-center">
                  <i class="bi bi-person-lines-fill fs-5"></i>
                </span>
                <span className="nav-link-text ms-1">User Table</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link  ${
                  path == "/admin/transaction/transactionTable" ? "active" : ""
                }`}
                href="/admin/transaction/transactionTable"
              >
                <span className=" text-center me-2 d-flex align-items-center justify-content-center">
                  <i class="bi bi-cash-coin fs-5"></i>
                </span>
                <span className="nav-link-text ms-1">Transaction Table</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link  ${
                  path == "/admin/loan/loanTable" ? "active" : ""
                }`}
                href="/admin/loan/loanTable"
              >
                <span className=" text-center me-2 d-flex align-items-center justify-content-center">
                  <i class="bi bi-piggy-bank-fill fs-5"></i>
                </span>
                <span className="nav-link-text ms-1">Loan Table</span>
              </Link>
            </li>
            <li className="nav-item mt-3">
              <h6 className="ps-4 ms-2 text-uppercase text-xs  font-weight-bolder opacity-8">
                Account pages
              </h6>
            </li>
            <li className="nav-item">
              <a type="button" className="nav-link  " onClick={logoutHandler}>
                <span className="text-center me-2 d-flex align-items-center justify-content-center">
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
      </div>
    </>
  );
};

export default Sidebar;
