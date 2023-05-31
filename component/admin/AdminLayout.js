import React, { useState } from "react";
import Sidebar from "./Navbar/Sidebar";
import Topbar from "./Navbar/Topbar";
import Footer from "./Navbar/Footer";
import FixedPlugin from "./Navbar/FixedPlugin";

const AdminLayout = ({ children }) => {
  const [sideBar, setSideBar] = useState(true);
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
          crossorigin="anonymous"
        ></script>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
          rel="stylesheet"
        />
        <link
          id="pagestyle"
          href="/assets/css/admin/template/material-dashboard.css?v=3.0.0"
          rel="stylesheet"
        />
      </Head>
      <div>
        {sideBar && <Sidebar />}
        <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
          <Topbar />
          <div className="container-fluid py-4">
            {children}
            <Footer />
          </div>
        </main>
        <FixedPlugin onSideBar={setSideBar} />
        
        <script
          src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.7/dist/umd/popper.min.js"
          integrity="sha384-zYPOMqeu1DAVkHiLqWBUTcbYfZ8osu1Nd6Z89ify25QV9guujx43ITvfi12/QExE"
          crossorigin="anonymous"
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.min.js"
          integrity="sha384-Y4oOpwW3duJdCWv5ly8SCFYWqFDsfob/3GkgExXKV4idmbt98QcxXYs9UoXAB7BZ"
          crossorigin="anonymous"
        ></script>
        <script src="/assets/js/plugins/perfect-scrollbar.min.js"></script>
        <script src="/assets/js/plugins/smooth-scrollbar.min.js"></script>
        <script src="/assets/js/plugins/chartjs.min.js"></script>
        <script async defer src="https://buttons.github.io/buttons.js"></script>
        {/* <script src="/assets/js/material-dashboard.min.js?v=3.0.0"></script> */}
      </div>
    </>
  );
};

export default AdminLayout;
