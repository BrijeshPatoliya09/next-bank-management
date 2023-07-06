import React, { useEffect, useState } from "react";
import Sidebar from "./Navbar/Sidebar";
import Topbar from "./Navbar/Topbar";
import Footer from "./Navbar/Footer";
import FixedPlugin from "./Navbar/FixedPlugin";
import Head from "next/head";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import NextNProgress from "nextjs-progressbar";

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const [sideBar, setSideBar] = useState(true);
  const [loader, setLoader] = useState(true);

  const [loggedIn, setLoggedIn] = useState("");

  const getLoginUser = async () => {
    const res = await fetch(`${process.env.apiUrl}/admin/auth/getLoginUser`);
    const data = await res.json();
    setLoggedIn(data.data);
  };

  useEffect(() => {
    getLoginUser();
    setTimeout(() => {
      setLoader(false);
    }, 1000);
  }, []);
  return (
    <>
      <Head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/assets/image/admin/apple-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          href="/assets/image/admin/favicon.png"
        />
        <title>Bank Management</title>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900|Roboto+Slab:400,700"
        />
        <link
          href="/assets/css/admin/template/nucleo-icons.css"
          rel="stylesheet"
        />
        <link
          href="/assets/css/admin/template/nucleo-svg.css"
          rel="stylesheet"
        />
        <script
          src="https://kit.fontawesome.com/42d5adcbca.js"
          crossOrigin="anonymous"
        ></script>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
          rel="stylesheet"
        />
        <link
          href="/assets/css/admin/template/material-dashboard.css?v=3.0.0"
          rel="stylesheet"
        />
        <link href="/assets/css/admin/style.css" rel="stylesheet" />
      </Head>
      <body>
        {loader ? (
          <div className="w-100 vh-100 d-flex">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            {router.pathname.includes("login") ? (
              <>{children}</>
            ) : (
              <>
                {sideBar && <Sidebar level={loggedIn?.level} />}
                <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
                  <Topbar loggedIn={loggedIn?.userData} />
                  <NextNProgress color="#216273" />
                  <div className="container-fluid py-4">
                    {children}
                    <Footer />
                  </div>
                </main>
                <FixedPlugin onSideBar={setSideBar} />
              </>
            )}
          </>
        )}
        <ToastContainer />

        <script
          src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.7/dist/umd/popper.min.js"
          integrity="sha384-zYPOMqeu1DAVkHiLqWBUTcbYfZ8osu1Nd6Z89ify25QV9guujx43ITvfi12/QExE"
          crossOrigin="anonymous"
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.min.js"
          integrity="sha384-Y4oOpwW3duJdCWv5ly8SCFYWqFDsfob/3GkgExXKV4idmbt98QcxXYs9UoXAB7BZ"
          crossOrigin="anonymous"
        ></script>
        <script src="/assets/js/admin/plugins/perfect-scrollbar.min.js"></script>
        <script src="/assets/js/admin/plugins/smooth-scrollbar.min.js"></script>
        <script src="/assets/js/admin/plugins/chartjs.min.js"></script>
        <script async defer src="https://buttons.github.io/buttons.js"></script>
        {/* <script src="/assets/js/material-dashboard.min.js?v=3.0.0"></script> */}
      </body>
    </>
  );
};

export default AdminLayout;
