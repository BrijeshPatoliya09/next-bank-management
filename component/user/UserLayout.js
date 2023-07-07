import React, { useEffect, useState } from "react";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.css";
import { ToastContainer } from "react-toastify";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Header from "./navbar/Header";
import Footer from "./navbar/Footer";
import { useRouter } from "next/router";

const UserLayout = ({ children }) => {
  const router = useRouter();
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 700);
  }, []);
  return (
    <>
      <Head>
        <meta charset="utf-8" />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <title>Bank Management</title>
        <meta
          name="description"
          content="Bank Management Web to connect all banks of the world"
        />
        <meta property="og:title" content="Bank Management" />
        <meta
          property="og:description"
          content="Bank Management Web to connect all banks of the world"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="https://www.clipartmax.com/png/middle/217-2174551_bank-management-business-treasury-money-bank-icon-blue-png.png"
          sizes="any"
        />
        <link rel="manifest" href="site.webmanifest" />
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="/assets/img/favicon.ico"
        />

        <link rel="stylesheet" href="assets/css/user/bootstrap.min.css" />
        <link rel="stylesheet" href="assets/css/user/slicknav.css" />
        <link rel="stylesheet" href="assets/css/user/flaticon.css" />
        <link rel="stylesheet" href="assets/css/user/animate.min.css" />
        <link rel="stylesheet" href="assets/css/user/magnific-popup.css" />
        <link
          rel="stylesheet"
          href="/assets/css/user/fontawesome-all.min.css"
        />
        <link rel="stylesheet" href="assets/css/user/themify-icons.css" />
        <link rel="stylesheet" href="assets/css/user/slick.css" />
        <link rel="stylesheet" href="assets/css/user/nice-select.css" />
        <link rel="stylesheet" href="assets/css/user/login.css" />
        <link rel="stylesheet" href="assets/css/user/style.css" />
      </Head>
      <body>
        {loader ? (
          <div id="preloader-active">
            <div className="preloader d-flex align-items-center justify-content-center">
              <div className="preloader-inner position-relative">
                <div className="preloader-circle"></div>
                <div className="preloader-img pere-text">
                  <img src="/assets/image/user/logo/logo.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {router.pathname.includes("login") ? (
              <>{children}</>
            ) : (
              <>
                {" "}
                <Header />
                <main>{children}</main>
                <Footer />
              </>
            )}
          </>
        )}

        <ToastContainer />

        <script src="/assets/js/user/vendor/modernizr-3.5.0.min.js"></script>
        <script src="/assets/js/user/vendor/jquery-1.12.4.min.js"></script>
        <script src="/assets/js/user/jquery.slicknav.min.js"></script>

        <script src="/assets/js/user/slick.min.js"></script>
        <script src="/assets/js/user/wow.min.js"></script>
        <script src="/assets/js/user/animated.headline.js"></script>
        <script src="/assets/js/user/jquery.magnific-popup.js"></script>

        <script src="/assets/js/user/jquery.nice-select.min.js"></script>
        <script src="/assets/js/user/jquery.sticky.js"></script>

        <script src="/assets/js/user/contact.js"></script>
        <script src="/assets/js/user/jquery.form.js"></script>
        <script src="/assets/js/user/jquery.validate.min.js"></script>
        <script src="/assets/js/user/mail-script.js"></script>
        <script src="/assets/js/user/jquery.ajaxchimp.min.js"></script>

        <script src="/assets/js/user/plugins.js"></script>
        <script src="/assets/js/user/main.js"></script>
      </body>
    </>
  );
};

export default UserLayout;
