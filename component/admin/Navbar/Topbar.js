import { Link } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Topbar = () => {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState("");

  const getLoginUser = async () => {
    const res = await fetch(`${process.env.apiUrl}/admin/auth/getLoginUser`);
    const data = await res.json();
    setLoggedIn(data.data);
  };

  useEffect(() => {
    getLoginUser();
  }, []);

  return (
    <>
      <nav
        className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl"
        id="navbarBlur"
        navbar-scroll="true"
      >
        <div className="container-fluid py-1 px-3">
          <nav aria-label="breadcrumb">
            {router.pathname != "/admin" && (
              <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                <li className="breadcrumb-item text-sm">
                  <Link className="opacity-5 text-dark" href="/admin">
                    Dashboard
                  </Link>
                </li>
                <li
                  className="breadcrumb-item text-sm text-dark active"
                  aria-current="page"
                >
                  {router.pathname.includes("table")
                    ? "Employee"
                    : router.pathname.includes("bank/create")
                    ? "Bank Registration"
                    : router.pathname.includes("user/userTable")
                    ? "User Table"
                    : router.pathname.includes("transaction/transactionTable")
                    ? "Transaction Table"
                    : router.pathname.includes("loan/loanTable")
                    ? "Loan Table"
                    : "Dashboard"}
                </li>
              </ol>
            )}
            <h6 className="font-weight-bolder mb-0">
              {router.pathname.includes("table")
                ? "Employee"
                : router.pathname.includes("bank/create")
                ? "Bank Registration"
                : router.pathname.includes("user/userTable")
                ? "User Table"
                : router.pathname.includes("transaction/transactionTable")
                ? "Transaction Table"
                : router.pathname.includes("loan/loanTable")
                ? "Loan Table"
                : "Dashboard"}
            </h6>
          </nav>
          <div
            className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4"
            id="navbar"
          >
            <div className="search-toggle ms-md-auto pe-md-3 d-flex align-items-center">
              <img
                src="https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png"
                className="img-fluid rounded-circle"
                alt="user"
              />
              <div className="caption ms-3">
                <h6 className="mb-0">{loggedIn && loggedIn.name}</h6>
                <p className="mb-0" style={{ fontSize: "14px" }}>
                  {loggedIn && loggedIn.email}
                </p>
              </div>
            </div>{" "}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Topbar;
