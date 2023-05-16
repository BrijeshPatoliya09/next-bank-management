import Link from "next/link";
import React, { useState } from "react";

const registeration = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    bankId: "",
  });

  const changeHandler = (e) => {
    const { value, name } = e.target;
    setUser({ ...user, [name]: value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
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
                        Sign up
                      </h4>
                      {/* <div className="row mt-3">
                        <div className="col-2 text-center ms-auto">
                          <a className="btn btn-link px-3" href="#">
                            <i className="fa fa-facebook text-white text-lg"></i>
                          </a>
                        </div>
                        <div className="col-2 text-center px-1">
                          <a className="btn btn-link px-3" href="#">
                            <i className="fa fa-github text-white text-lg"></i>
                          </a>
                        </div>

                        <div className="col-2 text-center me-auto">
                          <a className="btn btn-link px-3" href="#">
                            <i className="fa fa-google text-white text-lg"></i>
                          </a>
                        </div>
                      </div>      */}
                    </div>
                  </div>
                  <div className="card-body">
                    <form
                      onSubmit={submitHandler}
                      role="form"
                      className="text-start"
                    >
                      <div className="input-group input-group-outline mb-3">
                        <input
                          type="text"
                          name="name"
                          onChange={changeHandler}
                          className="form-control"
                          placeholder="Name"
                        />
                      </div>
                      <div className="input-group input-group-outline mb-3">
                        <input
                          type="email"
                          name="email"
                          onChange={changeHandler}
                          className="form-control"
                          placeholder="Email"
                        />
                      </div>
                      <div className="input-group input-group-outline mb-3">
                        <input
                          type="text"
                          name="bankId"
                          onChange={changeHandler}
                          className="form-control"
                          placeholder="Bank Id"
                        />
                      </div>
                      <div className="input-group input-group-outline mb-3">
                        <input
                          type="password"
                          name="password"
                          onChange={changeHandler}
                          className="form-control"
                          placeholder="Password"
                        />
                      </div>
                      <div className="form-check form-check-info text-start ps-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          I agree the{" "}
                          <a className="text-dark font-weight-bolder">
                            Terms and Conditions
                          </a>
                        </label>
                      </div>
                      <div className="text-center">
                        <button
                          type="submit"
                          className="btn btn-lg bg-gradient-primary btn-lg w-100 mt-4 mb-0"
                        >
                          Sign Up
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="card-footer text-center pt-0 px-lg-2 px-1">
                    <p className="mb-2 text-sm mx-auto">
                      Already have an account?
                      <Link
                        href="/auth/login"
                        className="text-primary text-gradient font-weight-bold"
                      >
                        Sign in
                      </Link>
                    </p>
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
        </div>
      </main>
    </>
  );
};

export default registeration;
