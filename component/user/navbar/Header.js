import { Link } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Header = () => {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState("");

  const getLoginUser = async () => {
    const res = await fetch(`${process.env.apiUrl}/user/auth/getLoginUser`);
    const data = await res.json();
    setLoggedIn(data.data);
  };

  useEffect(() => {
    getLoginUser();
  }, []);

  return (
    <>
      <header>
        <div className="header-area header-transparent">
          <div className="main-header  header-sticky">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-xl-2 col-lg-2 col-md-1">
                  <div className="logo">
                    <a href="index.html">
                      <img src="/assets/image/user/logo/logo.png" alt="" />
                    </a>
                  </div>
                </div>
                <div className="col-xl-10 col-lg-10 col-md-10">
                  <div className="menu-main d-flex align-items-center justify-content-end">
                    <div className="main-menu f-right d-none d-lg-block">
                      <nav>
                        <ul id="navigation">
                          <li
                            className={
                              router.pathname == "/user" ? "active" : ""
                            }
                          >
                            <Link href="/user">Home</Link>
                          </li>
                          <li>
                            <a href="about.html">About</a>
                          </li>
                          <li>
                            <a href="blog.html">Blog</a>
                            <ul className="submenu">
                              <li>
                                <a href="blog.html">Blog</a>
                              </li>
                              <li>
                                <a href="blog_details.html">Blog Details</a>
                              </li>
                              <li>
                                <a href="elements.html">Element</a>
                              </li>
                            </ul>
                          </li>
                          {loggedIn && (
                            <li
                              className={
                                router.pathname.includes("payment")
                                  ? "active"
                                  : ""
                              }
                            >
                              <Link href="/user/transaction/payment">
                                Payment
                              </Link>
                            </li>
                          )}
                          <li
                            className={
                              router.pathname.includes("registerAccount")
                                ? "active"
                                : ""
                            }
                          >
                            <Link href="/user/auth/registerAccount">
                              Register
                            </Link>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="mobile_menu d-block d-lg-none"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
