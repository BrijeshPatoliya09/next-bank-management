import React, { useState } from "react";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import { checkEmail, checkName } from "../../../helper/common";

const registerAccount = () => {
  const [user, setUser] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    email: "",
    contact: "",
    dob: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    nationalProof: "",
    nationalProofNumber: "",
    nationalProofImage: "",
    nomineeName: "",
    accountType: "",
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const imgUploadHandler = async (imgData) => {
    const formData = new FormData();
    formData.append("file", imgData);

    const res = await fetch(
      `${process.env.apiUrl}/user/fileUpload/proofImage`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.imgUrl;
  };

  const removeImgHandler = async (imgData) => {
    const res = await fetch(
      `${process.env.apiUrl}/user/fileUpload/proofImageRemove`,
      {
        method: "POST",
        body: JSON.stringify(imgData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
  };

  const getIsoCode = (name, type, country) => {
    if (type == "country") {
      const countryIso = Country.getAllCountries().filter(
        (val) => val.name === name
      );
      return countryIso[0]?.isoCode;
    } else {
      const code = getIsoCode(country, "country");
      const stateIso = State?.getStatesOfCountry(code).filter(
        (val) => val.name === name
      );
      return stateIso[0]?.isoCode;
    }
  };

  const submitHandler = async () => {
    //!User
    let validationUser = [];
    Object.keys(user).map((eachData) => {
      if (
        !user[eachData] ||
        user[eachData] == "" ||
        user[eachData] == undefined
      ) {
        validationUser.push(`Please enter ${eachData}`);
      }
    });

    let textValid = [];
    ["firstName", "middleName", "lastName", "nomineeName"].map((eachData) => {
      if (!checkName(user[eachData])) {
        textValid.push(`Please enter valid ${eachData}`);
      }
    });

    if (validationUser.length > 0) {
      return toast.error(validationUser[0]);
    } else if (textValid.length > 0) {
      return toast.error(textValid[0]);
    } else if (!checkEmail(user.email)) {
      return toast.error("Please enter valid email");
    } else if (user.contact.length != 10) {
      return toast.error("Please enter valid contact no.");
    } else if (user.zipCode.length != 6) {
      return toast.error("Please enter valid pin code");
    }

    const res = await fetch(`${process.env.apiUrl}/user/auth/registerAccount`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log(data);
  };
  return (
    <>
      <div className="hero-area2  slider-height2 hero-overly2 d-flex align-items-center ">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="hero-cap text-center pt-50">
                <h2>Bank Register</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="apply-area pt-150 pb-150">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="apply-wrapper">
                <form action="#">
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="single-form">
                        <label>First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          placeholder="Enter First Name"
                          onChange={changeHandler}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="single-form">
                        <label>Middle Name</label>
                        <input
                          type="text"
                          name="middleName"
                          placeholder="Enter Middle Name"
                          onChange={changeHandler}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="single-form">
                        <label>Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Enter Last Name"
                          onChange={changeHandler}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="single-form">
                        <label>Gender</label>
                        <div className="select-radio6 mt-4">
                          <div className="radio">
                            <input
                              id="radio"
                              name="gender"
                              value={0}
                              type="radio"
                              onChange={changeHandler}
                            />
                            <label for="radio-6" className="radio-label">
                              Male
                            </label>
                          </div>
                          <div className="radio">
                            <input
                              id="radio"
                              name="gender"
                              value={1}
                              onChange={changeHandler}
                              type="radio"
                            />
                            <label for="radio-7" className="radio-label">
                              Female
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="single-form">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="Enter Email"
                          onChange={changeHandler}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="single-form">
                        <label>Contact</label>
                        <input
                          type="number"
                          name="contact"
                          placeholder="Enter Cantact"
                          onInput={(e) => {
                            e.target.value = e.target.value
                              .replace(/[^0-9]/g, "")
                              .replace(/(\..*)\./g, "$1");
                            setUser({ ...user, contact: e.target.value });
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="single-form">
                        <label>Date of Birth</label>
                        <input
                          type="date"
                          name="dob"
                          placeholder="Enter Date of Birth"
                          onChange={async (e) =>
                            setUser({
                              ...user,
                              dob: new Date(e.target.value).getTime() / 1000,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="single-form">
                        <label>Address</label>
                        <input
                          type="text"
                          name="address"
                          placeholder="Enter Address"
                          onChange={changeHandler}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="single-form">
                        <label>Country</label>
                        <div className="select-option mb-10">
                          <select
                            name="country"
                            className="nice-select"
                            value={user.country}
                            onChange={changeHandler}
                            tabIndex="0"
                          >
                            <option value="" className="option selected focus">
                              Choose Categories
                            </option>
                            {Country.getAllCountries().map((country, i) => (
                              <option value={country.name} key={i}>
                                {country.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="single-form">
                        <label>State</label>
                        <div className="select-option mb-10">
                          <select
                            name="state"
                            className="nice-select"
                            tabIndex="0"
                            value={user.state}
                            onChange={changeHandler}
                            disabled={!user.country}
                          >
                            <option value="" className="option selected focus">
                              Choose State
                            </option>
                            {State.getStatesOfCountry(
                              getIsoCode(user.country, "country") || ""
                            ).map((state, i) => (
                              <option value={state.name} key={i}>
                                {state.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="single-form">
                        <label>City</label>
                        <div className="select-option mb-10">
                          <select
                            name="city"
                            className="nice-select"
                            tabIndex="0"
                            value={user.city}
                            onChange={changeHandler}
                            disabled={!user.state}
                          >
                            <option value="" className="option selected focus">
                              Choose City
                            </option>
                            {City.getCitiesOfState(
                              getIsoCode(user.country, "country") || "",
                              getIsoCode(user.state, "state", user.country)
                            ).map((city, i) => (
                              <option value={city.name} key={i}>
                                {city.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="single-form">
                        <label>Pin Code</label>
                        <input
                          type="number"
                          name="zipCode"
                          placeholder="Enter Pin Code"
                          onInput={(e) => {
                            e.target.value = e.target.value
                              .replace(/[^0-9]/g, "")
                              .replace(/(\..*)\./g, "$1");
                            setUser({ ...user, zipCode: e.target.value });
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="single-form">
                        <label>National Proof</label>
                        <div className="select-option mb-10">
                          <select
                            name="nationalProof"
                            className="nice-select"
                            tabIndex="0"
                            onChange={changeHandler}
                            value={user.nationalProof}
                          >
                            <option value="" className="option selected focus">
                              Choose City
                            </option>
                            <option value="Adhar Card" className="option">
                              Adhar Card
                            </option>
                            <option value="Pan Card" className="option">
                              Pan Card
                            </option>
                            <option value="Passport" className="option">
                              Passport
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="single-form">
                        <label>National Proof Number</label>
                        <input
                          type="number"
                          name="nationalProofNumber"
                          placeholder="Enter Pin Code"
                          onChange={changeHandler}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      {user.nationalProofImage ? (
                        <div>
                          <img
                            src={user.nationalProofImage}
                            style={{
                              width: "60px",
                              position: "relative",
                            }}
                          />
                          <span
                            onClick={() => {
                              removeImgHandler(user.nationalProofImage);
                              setUser({ ...user, nationalProofImage: "" });
                            }}
                            className="pl-2 position-absolute top-0 start-0 translate-middle"
                            style={{ cursor: "pointer" }}
                          >
                            <i className="bi bi-x-circle"></i>
                          </span>
                        </div>
                      ) : (
                        <div className="single-form">
                          <label>National Proof Image</label>
                          <input
                            type="file"
                            name="nationalProofImage"
                            accept="image/*"
                            onChange={async (e) => {
                              const url = await imgUploadHandler(
                                e.target.files[0]
                              );
                              setUser({
                                ...user,
                                nationalProofImage: `/assets/image/user/${url}`,
                              });
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="col-lg-6">
                      <div className="single-form">
                        <label>Nominee Name</label>
                        <input
                          type="text"
                          name="nomineeName"
                          placeholder="Enter Nominee Name"
                          onChange={changeHandler}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="single-form">
                        <label>Account</label>
                        <div className="select-option mb-10">
                          <select
                            name="accountType"
                            className="nice-select"
                            tabIndex="0"
                            value={user.accountType}
                            onChange={changeHandler}
                          >
                            <option value="" className="option selected focus">
                              Choose Account
                            </option>
                            <option value="0" className="option">
                              Saving Account
                            </option>
                            <option value="1" className="option">
                              Current Account
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn btn-primary p-3 border-0 fw-bold apply-btn mt-30"
                    onClick={submitHandler}
                  >
                    APPLY NOW{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default registerAccount;
