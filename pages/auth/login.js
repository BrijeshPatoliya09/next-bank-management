import Link from "next/link";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { checkEmail } from "../../helper/common";

const login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [login, setLogin] = useState(true);
  const [otp, setOtp] = useState("");

  const changeHandler = (e) => {
    const { value, name } = e.target;
    setUser({ ...user, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (login) {
      if (!user.email.trim()) {
        return toast.error("Please enter email");
      }

      if (!user.password.trim()) {
        return toast.error("Please enter password");
      }

      if (!checkEmail(user.email)) {
        return toast.error("Please enter valid email");
      }

      const res = await fetch(`${process.env.baseUrl}/api/auth/login`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.status) {
        setLogin(false);
      } else {
        toast.error(data.message);
      }
    } else {
      if (otp.trim()) {
        return toast.error("Please enter OTP");
      }

      const res = await fetch(`${process.env.baseUrl}/api/auth/verify2fa`, {
        method: "POST",
        body: JSON.stringify({ email: user.email, otp }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log(data);
    }
  };

  return (
    <>
      <main className="main-content  mt-0">
        <div className="page-header align-items-start min-vh-100">
          <span className="mask bg-gradient-dark opacity-6"></span>
          <div className="container my-auto">
            <div className="row">
              <div className="col-lg-4 col-md-8 col-12 mx-auto">
                <div className="card z-index-0 fadeIn3 fadeInBottom">
                  <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                    <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 pe-1">
                      <h4 className="text-white font-weight-bolder text-center mt-2 mb-0">
                        {login ? "Sign in" : "Verify"}
                      </h4>
                    </div>
                  </div>
                  <div className="card-body">
                    <form role="form" className="text-start">
                      {login ? (
                        <>
                          <div className="input-group input-group-outline my-3">
                            <input
                              type="email"
                              name="email"
                              className="form-control"
                              placeholder="Email"
                              onChange={changeHandler}
                            />
                          </div>
                          <div className="input-group input-group-outline mb-3">
                            <input
                              type="password"
                              name="password"
                              className="form-control"
                              placeholder="Password"
                              onChange={changeHandler}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="input-group input-group-outline my-3">
                            <input
                              type="number"
                              name="pin"
                              className="form-control"
                              placeholder="OTP"
                              onChange={(e) => setOtp(e.target.value)}
                            />
                          </div>
                        </>
                      )}
                      <div className="text-center">
                        <button
                          type="submit"
                          className="btn bg-gradient-primary w-100 my-4 mb-2"
                          onClick={submitHandler}
                        >
                          {login ? "Sign in" : "Verify OTP"}
                        </button>
                      </div>
                      {!login ? (
                        <p className="mt-4 text-sm text-center">
                          go back to{" "}
                          <button
                            type="button"
                            className="btn p-0 m-0 text-primary text-gradient font-weight-bold"
                            onClick={() => setLogin(true)}
                          >
                            Login
                          </button>
                          .
                        </p>
                      ) : (
                        <p className="mt-4 text-sm text-center">
                          login to stay connected.
                        </p>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer className="footer position-absolute bottom-2 py-2 w-100">
            <div className="container">
              <div className="row align-items-center justify-content-lg-between">
                <div className="col-12 col-md-6 my-auto">
                  <div className="copyright text-center text-sm text-white text-lg-start">
                    © <script>document.write(new Date().getFullYear())</script>,
                    made with <i className="fa fa-heart" aria-hidden="true"></i>{" "}
                    by
                    <a
                      href="#"
                      className="font-weight-bold text-white"
                      target="_blank"
                    >
                      Creative Tim
                    </a>
                    for a better web.
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <ul className="nav nav-footer justify-content-center justify-content-lg-end">
                    <li className="nav-item">
                      <a
                        href="#"
                        className="nav-link text-white"
                        target="_blank"
                      >
                        Creative Tim
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="#"
                        className="nav-link text-white"
                        target="_blank"
                      >
                        About Us
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="#"
                        className="nav-link text-white"
                        target="_blank"
                      >
                        Blog
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="#"
                        className="nav-link pe-0 text-white"
                        target="_blank"
                      >
                        License
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
          <ToastContainer />
        </div>
      </main>
    </>
  );
};

export default login;
