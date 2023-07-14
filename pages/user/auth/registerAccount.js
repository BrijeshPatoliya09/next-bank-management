import React, { useState } from "react";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import {
  checkEmail,
  checkName,
  imgUploadHandler,
  removeImgHandler,
} from "../../../helper/common";
import CreatableSelect from "react-select";

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
    bank: "",
  });

  const [bankSelect, setBankSelect] = useState([]);

  const [loader, setLoader] = useState(false);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
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

  const getNearBank = async (bankName) => {
    const res = await fetch(`${process.env.apiUrl}/user/bank/getNearBanks`, {
      method: "POST",
      body: JSON.stringify(bankName),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    setBankSelect(data.data);
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

    if (!loader) {
      setLoader(true);
      const res = await fetch(
        `${process.env.apiUrl}/user/auth/registerAccount`,
        {
          method: "POST",
          body: JSON.stringify(user),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      setLoader(false);
      if (data.status) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    }
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
      <div className="apply-area py-80">
        <div className="container">
          <div className="row justify-content-center">
            <div className="mb-3 col-lg-12">
              <div className="apply-wrapper">
                <form action="#">
                  <div className="row">
                    <div className="mb-3 col-lg-4">
                      <label>First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="firstName"
                        placeholder="Enter First Name"
                        onChange={changeHandler}
                      />
                    </div>
                    <div className="mb-3 col-lg-4">
                      <label>Middle Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="middleName"
                        placeholder="Enter Middle Name"
                        onChange={changeHandler}
                      />
                    </div>
                    <div className="mb-3 col-lg-4">
                      <label>Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        placeholder="Enter Last Name"
                        onChange={changeHandler}
                      />
                    </div>
                    <div className="mb-3 col-lg-3 single-form">
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
                    <div className="mb-3 col-lg-3">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Enter Email"
                        onChange={changeHandler}
                      />
                    </div>
                    <div className="mb-3 col-lg-3">
                      <label>Contact</label>
                      <input
                        type="number"
                        name="contact"
                        className="form-control"
                        placeholder="Enter Cantact"
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/[^0-9]/g, "")
                            .replace(/(\..*)\./g, "$1");
                          setUser({ ...user, contact: e.target.value });
                        }}
                      />
                    </div>
                    <div className="mb-3 col-lg-3">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        className="form-control"
                        placeholder="Enter Date of Birth"
                        onChange={async (e) =>
                          setUser({
                            ...user,
                            dob: new Date(e.target.value).getTime() / 1000,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3 col-lg-6">
                      <label>Address</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        placeholder="Enter Address"
                        onChange={changeHandler}
                      />
                    </div>
                    <div className="mb-3 col-lg-6">
                      <label>Country</label>
                      <CreatableSelect
                        placeholder="Select Country"
                        isSearchable
                        isClearable
                        value={
                          user.country
                            ? { label: user.country, value: user.country }
                            : null
                        }
                        onChange={(e) =>
                          setUser({ ...user, country: e?.value })
                        }
                        options={Country.getAllCountries().map(
                          (country, i) => ({
                            label: country.name,
                            value: country.name,
                          })
                        )}
                      />
                    </div>
                    <div className="mb-3 col-lg-4">
                      <label>State</label>
                      <CreatableSelect
                        placeholder="Select State"
                        isSearchable
                        isClearable
                        value={
                          user.state
                            ? { label: user.state, value: user.state }
                            : null
                        }
                        onChange={(e) => setUser({ ...user, state: e?.value })}
                        options={State.getStatesOfCountry(
                          getIsoCode(user.country, "country") || ""
                        ).map((state, i) => ({
                          label: state.name,
                          value: state.name,
                        }))}
                      />
                    </div>
                    <div className="mb-3 col-lg-4">
                      <label>City</label>
                      <CreatableSelect
                        placeholder="Select City"
                        isSearchable
                        isClearable
                        value={
                          user.city
                            ? { label: user.city, value: user.city }
                            : null
                        }
                        onChange={(e) => setUser({ ...user, city: e?.value })}
                        options={City.getCitiesOfState(
                          getIsoCode(user.country, "country") || "",
                          getIsoCode(user.state, "state", user.country)
                        ).map((city, i) => ({
                          label: city.name,
                          value: city.name,
                        }))}
                      />
                    </div>
                    <div className="mb-3 col-lg-4">
                      <label>Pin Code</label>
                      <input
                        type="number"
                        name="zipCode"
                        placeholder="Enter Pin Code"
                        className="form-control"
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/[^0-9]/g, "")
                            .replace(/(\..*)\./g, "$1");
                          setUser({ ...user, zipCode: e.target.value });
                        }}
                      />
                    </div>
                    <div className="mb-3 col-lg-4">
                      <label>National Proof</label>
                      <div className="select-option mb-10">
                        <select
                          name="nationalProof"
                          className="form-control"
                          tabIndex="0"
                          onChange={changeHandler}
                          value={user.nationalProof}
                        >
                          <option value="" className="option selected focus">
                            Choose National Proof
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
                    <div className="mb-3 col-lg-4">
                      <label>National Proof Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nationalProofNumber"
                        placeholder="Enter Pin Code"
                        onChange={changeHandler}
                      />
                    </div>
                    <div className="mb-3 col-lg-4">
                      {user.nationalProofImage ? (
                        <>
                          <label class="custum-file-upload mt-4" for="file">
                            <div className="position-relative">
                              <img
                                src={user.nationalProofImage}
                                className="img-fluid preview-box"
                              />  
                              <button
                                type="button"
                                className="preview-close"
                                onClick={() => {
                                  removeImgHandler(user.nationalProofImage);
                                  setUser({ ...user, nationalProofImage: "" });
                                }}
                              >
                                <i class="bi bi-x"></i>
                              </button>
                            </div>
                          </label>
                        </>
                      ) : (
                        <>
                          <label>National Proof Image</label>
                          <label
                            class="custum-file-upload  custum-file-upload-borderBack "
                            for="file"
                          >
                            <div class="custum-file-upload-placeholder ">
                              <i class="bi bi-card-image"></i>
                            </div>
                            <input
                              type="file"
                              id="file"
                              accept="image/png, image/jpeg, image/jpg"
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
                          </label>
                        </>
                      )}
                    </div>
                    <div className="mb-3 col-lg-4">
                      <label>Nominee Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nomineeName"
                        placeholder="Enter Nominee Name"
                        onChange={changeHandler}
                      />
                    </div>
                    <div className="mb-3 col-lg-4">
                      <label>Account</label>
                      <div className="select-option mb-10">
                        <select
                          name="accountType"
                          className="form-control"
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
                    <div className="mb-3 col-lg-4">
                      <div>
                        <label>Banks</label>
                        <div className="select-option mb-10">
                          <select
                            name="bank"
                            className="form-control"
                            tabIndex="0"
                            value={user.bank}
                            onChange={changeHandler}
                            disabled={bankSelect.length == 0}
                          >
                            <option value="" className="option selected focus">
                              {bankSelect.length > 0
                                ? "Choose Bank"
                                : user.city
                                ? "There is no bank service available"
                                : "Please enter city, state, country name"}
                            </option>
                            {bankSelect &&
                              bankSelect.map((item) => (
                                <option value={item.ifscCode}>
                                  {item.name} ({item.address.city})
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn d-flex justify-content-center align-items-center btn-primary p-3 border-0 fw-bold apply-btn mt-30"
                    onClick={submitHandler}
                    disabled={loader}
                  >
                    {loader && (
                      <div class="spinner-border me-2" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    )}
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
