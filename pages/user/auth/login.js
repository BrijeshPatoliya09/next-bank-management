import React, { useState } from "react";
import { checkEmail, dec, keyStore } from "../../../helper/common";
import { checkPassword } from "../../../helper/common";
import { toast } from "react-toastify";
import { withSessionSsr } from "../../../helper/session";
import { useRouter } from "next/router";

const login = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [loader, setLoader] = useState(false);
  console.log(dec("DD1LPu2L5ghqy1EZqA==", keyStore("userPsw")));
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!user.email.trim()) {
      return toast.error("Please enter email");
    } else if (!user.password.trim()) {
      return toast.error("Please enter password");
    } else if (!checkEmail(user.email)) {
      return toast.error("Please enter valid email");
    } else if (!checkPassword(user.password)) {
      return toast.error("Please enter valid password");
    }

    if (!loader) {
      setLoader(true);
      const res = await fetch(`${process.env.apiUrl}/user/auth/login`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setLoader(false);

      if (data.status) {
        toast.success(data.message);
        setTimeout(() => router.push("/user"), 800);
      } else {
        toast.error(data.message);
      }
    }
  };
  return (
    <>
      <div className="limiter login_user">
        <div
          className="container-login100"
          style={{ backgroundImage: "url('/assets/image/user/bg-01.jpg')" }}
        >
          <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">
            <form
              onSubmit={submitHandler}
              className="login100-form validate-form"
            >
              <span className="login100-form-title p-b-49">Login</span>

              <div
                className="wrap-input100 validate-input m-b-23"
                data-validate="Username is reauired"
              >
                <span className="label-input100">Email</span>
                <input
                  className="input100"
                  type="email"
                  name="email"
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  placeholder="Type your username"
                />
                <span className="focus-input100"></span>
              </div>

              <div
                className="wrap-input100 validate-input"
                data-validate="Password is required"
              >
                <span className="label-input100">Password</span>
                <input
                  className="input100"
                  type="password"
                  name="password"
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  placeholder="Type your password"
                />
                <span className="focus-input101"></span>
              </div>

              <div className="text-right p-t-8 p-b-31">
                <a href="#">Forgot password?</a>
              </div>

              <div className="container-login100-form-btn">
                <div className="wrap-login100-form-btn">
                  <div className="login100-form-bgbtn"></div>
                  <button
                    type="submit"
                    className="login100-form-btn"
                    disabled={loader}
                  >
                    {loader && (
                      <div class="spinner-border me-2" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    )}
                    Login
                  </button>
                </div>
              </div>

              <div className="txt1 text-center p-t-54 p-b-20 mb-5">
                <a href="#">Register Account</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const user = req.session.user;
  if (user) {
    return {
      redirect: {
        destination: "/user",
        permanent: false,
      },
    };
  } else {
    return {
      props: {},
    };
  }
});

export default login;
