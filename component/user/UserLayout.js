import React, { useEffect, useState } from "react";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.css";
import { ToastContainer } from "react-toastify";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Header from "./navbar/Header";
import Footer from "./navbar/Footer";

const UserLayout = ({ children }) => {
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 1000);
  }, []);
  return (
    <>
      <Head>
        <meta charset="utf-8" />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <title>Finance HTML-5 Template </title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="site.webmanifest" />
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="assets/img/favicon.ico"
        />

        <link rel="stylesheet" href="/assets/css/user/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/user/slicknav.css" />
        <link rel="stylesheet" href="/assets/css/user/flaticon.css" />
        <link rel="stylesheet" href="/assets/css/user/animate.min.css" />
        <link rel="stylesheet" href="/assets/css/user/magnific-popup.css" />
        <link
          rel="stylesheet"
          href="/assets/css/user/fontawesome-all.min.css"
        />
        <link rel="stylesheet" href="/assets/css/user/themify-icons.css" />
        <link rel="stylesheet" href="/assets/css/user/slick.css" />
        <link rel="stylesheet" href="/assets/css/user/nice-select.css" />
        <link rel="stylesheet" href="/assets/css/user/style.css" />
      </Head>
      <body>
        {loader ? (
          <div id="preloader-active">
            <div class="preloader d-flex align-items-center justify-content-center">
              <div class="preloader-inner position-relative">
                <div class="preloader-circle"></div>
                <div class="preloader-img pere-text">
                  <img src="/assets/image/user/logo/logo.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}

        {!loader && (
          <>
            <Header />
            <main>{children}</main>
            <Footer />
          </>
        )}

        <ToastContainer />

        <script src="/assets/js/user/vendor/modernizr-3.5.0.min.js"></script>
        <script src="/assets/js/user/vendor/jquery-1.12.4.min.js"></script>
        <script src="/assets/js/user/popper.min.js"></script>
        <script src="/assets/js/user/bootstrap.min.js"></script>
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
