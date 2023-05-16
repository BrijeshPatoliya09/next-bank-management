import React from "react";
import Sidebar from "./Navbar/Sidebar";
import Topbar from "./Navbar/Topbar";
import Footer from "./Navbar/Footer";
import FixedPlugin from "./Navbar/FixedPlugin";

const Layout = ({ children }) => {
  return (
    <>
      <Sidebar />
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
        <Topbar />
        <div className="container-fluid py-4">
          {children}
          <Footer />
        </div>
      </main>
      <FixedPlugin />
    </>
  );
};

export default Layout;
