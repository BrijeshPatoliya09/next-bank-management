import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Autocomplete,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Country, State, City } from "country-state-city";
import { SingleInputTimeRangeField } from "@mui/x-date-pickers-pro";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";
import { withSessionSsr } from "../../../helper/session";
import {
  addPswHandler,
  checkEmail,
  checkName,
  checkPassword,
  enc,
  keyStore,
} from "../../../helper/common";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const create = ({ empLevel }) => {
  const [address, setAddress] = useState({
    country: "",
    state: "",
    city: "",
    zone: "",
    zipCode: "",
  });

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    department: "",
    education: "",
    DOB: "",
    joinningDate: "",
  });
  const [pswValid, setPswValid] = useState({
    upper: false,
    lower: false,
    spacial: false,
    digit: false,
    length: false,
  });
  const [pwdTouch, setPwdTouch] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const [bankDetail, setBankDetail] = useState({
    name: "",
    level: "",
  });
  const [bankTime, setBankTime] = useState({
    first: [],
    second: [],
  });
  const [loader, setLoader] = useState(false);

  const empChangeHandler = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleAdressChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const handleBankdetailChange = (e) => {
    const { name, value } = e.target;
    setBankDetail({ ...bankDetail, [name]: value });
  };

  const createHandler = async () => {
    //!Address
    let validationAddress = [];
    Object.keys(address).map((eachData) => {
      if (
        !address[eachData] ||
        address[eachData] == "" ||
        address[eachData] == undefined
      ) {
        validationAddress.push(`Please Enter ${eachData}`);
      }
    });

    //!Bankdetail
    let validationBankdetail = [];
    Object.keys(bankDetail).map((eachData) => {
      if (
        !bankDetail[eachData] ||
        bankDetail[eachData] == "" ||
        bankDetail[eachData] == undefined
      ) {
        if (eachData == "name") {
          validationBankdetail.push(`Please Enter bank ${eachData}`);
        }
        validationBankdetail.push(`Please Enter ${eachData}`);
      }
    });

    //!Employee
    let validationEmployee = [];
    Object.keys(employee).map((eachData) => {
      if (
        !employee[eachData] ||
        employee[eachData] == "" ||
        employee[eachData] == undefined
      ) {
        validationEmployee.push(`Please Enter ${eachData}`);
      }
    });

    let textCheck = [];
    ["name", "department", "education"].map((item) => {
      if (!checkName(employee[item])) {
        textCheck.push(`Please enter valid ${item}`);
      }
    });

    if (validationAddress.length > 0) {
      return toast.error(validationAddress[0]);
    } else if (!bankTime.first[0] || !bankTime.first[1]) {
      return toast.error("Please enter first shift");
    } else if (!bankTime.second[0] || !bankTime.second[1]) {
      return toast.error("Please enter second shift");
    } else if (validationBankdetail.length > 0) {
      return toast.error(validationBankdetail[0]);
    } else if (validationEmployee.length > 0) {
      return toast.error(validationEmployee[0]);
    } else if (
      bankTime.first[1] == bankTime.first[0] ||
      bankTime.first[1] < bankTime.first[0]
    ) {
      return toast.error("Please enter valid time in first shift");
    } else if (
      bankTime.second[1] == bankTime.second[0] ||
      bankTime.second[1] < bankTime.second[0]
    ) {
      return toast.error("Please enter valid time in second shift");
    } else if (
      bankTime.first[1] == bankTime.second[0] ||
      bankTime.first[1] > bankTime.second[0]
    ) {
      return toast.error("Please enter valid time");
    } else if (!checkName(bankDetail.name)) {
      return toast.error("Please enter valid bank name");
    } else if (!checkEmail(employee.email)) {
      return toast.error("Please enter valid email");
    } else if (!checkPassword(employee.password)) {
      return toast.error("Please enter valid password");
    } else if (employee.contact.length !== 10) {
      return toast.error("Please enter valid contact no.");
    } else if (textCheck.length > 0) {
      return toast.error(textCheck[0]);
    }

    if (!loader) {
      setLoader(true);
      const res = await fetch(`${process.env.apiUrl}/admin/bank/create`, {
        method: "POST",
        body: JSON.stringify({
          bankDetail,
          address,
          time: { ...bankTime },
          timeStamp: Math.floor(Date.now() / 1000),
          employee: {
            ...employee,
            password: enc(employee.password, keyStore("empPsw")),
          },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setLoader(false);

      if (data.status) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    }
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

  return (
    <>
      <div className="row bank-reg">
        <div className="col-12 d-flex">
          <div className="col-6 px-2 me-2">
            <div className="col-12">
              <div className="card my-4">
                <div className="pb-2 mb-3">
                  <div className="pt-3 px-3 sub-head">
                    <h3>Bank Address</h3>
                  </div>
                  <hr />
                  <div className="d-flex flex-wrap px-3">
                    <Autocomplete
                      className="col-sm-6 col-12 p-1 mt-2"
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setAddress({ ...address, country: newValue.value });
                        } else {
                          setAddress({ ...address, country: "" });
                        }
                      }}
                      value={
                        address.country
                          ? { value: address.country, label: address.country }
                          : null
                      }
                      options={Country.getAllCountries().map((country, i) => ({
                        label: country.name,
                        value: country.name,
                      }))}
                      renderInput={(params) => (
                        <TextField {...params} label="Select Country" />
                      )}
                    />
                    <Autocomplete
                      className="col-sm-6 col-12 p-1 mt-2"
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setAddress({ ...address, state: newValue.value });
                        } else {
                          setAddress({ ...address, state: "" });
                        }
                      }}
                      value={
                        address.state
                          ? { value: address.state, label: address.state }
                          : null
                      }
                      options={State.getStatesOfCountry(
                        getIsoCode(address.country, "country") || ""
                      ).map((state, i) => ({
                        label: state.name,
                        value: state.name,
                      }))}
                      disabled={!address.country}
                      renderInput={(params) => (
                        <TextField {...params} label="Select State" />
                      )}
                    />
                    <Autocomplete
                      className="col-sm-6 col-12 p-1 mt-2"
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setAddress({ ...address, city: newValue.value });
                        } else {
                          setAddress({ ...address, city: "" });
                        }
                      }}
                      value={
                        address.city
                          ? { value: address.city, label: address.city }
                          : null
                      }
                      options={City.getCitiesOfState(
                        getIsoCode(address.country, "country") || "",
                        getIsoCode(address.state, "state", address.country)
                      ).map((city, i) => ({
                        label: city.name,
                        value: city.name,
                      }))}
                      disabled={!address.country || !address.state}
                      renderInput={(params) => (
                        <TextField {...params} label="Select City" />
                      )}
                    />
                    <TextField
                      className="col-sm-6 col-12 p-1 mt-2"
                      name="zone"
                      label="Zone"
                      variant="outlined"
                      onChange={handleAdressChange}
                    />
                    <TextField
                      className="col-sm-6 col-12 p-1 mt-2"
                      type="number"
                      name="zipCode"
                      label="Zip Code"
                      variant="outlined"
                      onChange={handleAdressChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="card my-4">
                <div className="pb-2 mb-3">
                  <div className="pt-3 px-3 sub-head">
                    <h3>Bank Timing</h3>
                  </div>
                  <hr />
                  <div className="d-flex flex-wrap px-3">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <SingleInputTimeRangeField
                        className="col-sm-6 col-12 p-1 mt-2"
                        label="First Shift"
                        onChange={(e) => {
                          const firstDate = Math.floor(
                            e[0]?.$d.getTime() / 1000
                          );
                          const secondDate = Math.floor(
                            e[1]?.$d.getTime() / 1000
                          );
                          setBankTime({
                            ...bankTime,
                            first: [firstDate, secondDate],
                          });
                        }}
                      />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <SingleInputTimeRangeField
                        className="col-sm-6 col-12 p-1 mt-2"
                        label="Second Shift"
                        onChange={(e) => {
                          const firstDate = Math.floor(
                            e[0]?.$d.getTime() / 1000
                          );
                          const secondDate = Math.floor(
                            e[1]?.$d.getTime() / 1000
                          );
                          setBankTime({
                            ...bankTime,
                            second: [firstDate, secondDate],
                          });
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 px-2">
            <div className="col-12">
              <div className="card my-4">
                <div className="pb-2 mb-3">
                  <div className="pt-3 px-3 sub-head">
                    <h3>Bank Details</h3>
                  </div>
                  <hr />
                  <div className="d-flex flex-wrap px-3">
                    <TextField
                      className="col-sm-6 col-12 p-1 mt-2"
                      name="name"
                      value={bankDetail.name}
                      label="Bank Name"
                      variant="outlined"
                      onChange={handleBankdetailChange}
                    />
                    <FormControl className="col-sm-6 col-12 p-1 mt-2">
                      <InputLabel id="demo-simple-select-label">
                        Select Level
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        name="level"
                        value={bankDetail.level}
                        label="Select Level"
                        onChange={handleBankdetailChange}
                      >
                        {empLevel == 1 && (
                          <MenuItem value={1}>World Bank</MenuItem>
                        )}
                        {empLevel < 2 && (
                          <MenuItem value={2}>National Bank</MenuItem>
                        )}
                        {empLevel < 3 && address.country && (
                          <MenuItem value={3}>State Bank</MenuItem>
                        )}
                        {empLevel < 4 && address.state && (
                          <MenuItem value={4}>City Bank</MenuItem>
                        )}
                        {empLevel < 5 && address.city && (
                          <MenuItem value={5}>Zone Bank</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="card my-4">
                <div className="pb-2 mb-3">
                  <div className="pt-3 px-3 sub-head">
                    <h3>Employee Create</h3>
                  </div>
                  <hr />
                  <div className="d-flex flex-wrap px-3">
                    <TextField
                      className="col-sm-6 col-12 p-1 mt-2"
                      type="text"
                      name="name"
                      label="Name"
                      value={employee.name}
                      onChange={empChangeHandler}
                      variant="outlined"
                    />
                    <TextField
                      className="col-sm-6 col-12 p-1 mt-2"
                      type="email"
                      name="email"
                      label="Email"
                      value={employee.email}
                      onChange={empChangeHandler}
                      variant="outlined"
                    />
                    <div className="col-sm-6 col-12 p-1 mt-2">
                      <FormControl variant="outlined" className="w-100">
                        <InputLabel htmlFor="outlined-adornment-password">
                          Password
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-password"
                          type={showPassword ? "text" : "password"}
                          value={employee.password}
                          onChange={({ target: { value } }) => {
                            if (!pwdTouch) {
                              setPwdTouch(true);
                            }
                            setEmployee({ ...employee, password: value });
                            addPswHandler(value, setPswValid);
                          }}
                          variant="outlined"
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                onMouseDown={(e) => e.preventDefault()}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                          label="Password"
                        />
                      </FormControl>

                      {pwdTouch && (
                        <div>
                          <span>
                            <span
                              className={`pass-valid ${
                                pswValid.digit ? "text-success" : "text-danger"
                              }`}
                            >
                              1 Number
                            </span>{" "}
                            |
                            <span
                              className={`pass-valid ${
                                pswValid.upper ? "text-success" : "text-danger"
                              }`}
                            >
                              {" "}
                              1 Uppercase
                            </span>{" "}
                            |
                            <span
                              className={`pass-valid ${
                                pswValid.lower ? "text-success" : "text-danger"
                              }`}
                            >
                              {" "}
                              1 Lowercase
                            </span>{" "}
                            |
                            <span
                              className={`pass-valid ${
                                pswValid.spacial
                                  ? "text-success"
                                  : "text-danger"
                              }`}
                            >
                              {" "}
                              1 Special Character
                            </span>{" "}
                            |
                            <span
                              className={`pass-valid ${
                                pswValid.length ? "text-success" : "text-danger"
                              }`}
                            >
                              {" "}
                              Min 8 - 30 Max Character
                            </span>{" "}
                          </span>
                        </div>
                      )}
                    </div>
                    <TextField
                      className="col-sm-6 col-12 p-1 mt-2"
                      type="text"
                      name="contact"
                      label="Contact"
                      value={employee.contact}
                      onInput={(e) => {
                        e.target.value = e.target.value
                          .replace(/[^0-9]/g, "")
                          .replace(/(\..*)\./g, "$1");

                        setEmployee({ ...employee, contact: e.target.value });
                      }}
                      variant="outlined"
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        className="col-sm-6 col-12 p-1 mt-2"
                        // value={employee.DOB}
                        onChange={(e) => {
                          console.log(e);
                          setEmployee({
                            ...employee,
                            DOB: e,
                          });
                        }}
                        label="Date of Birth"
                      />
                    </LocalizationProvider>
                    <TextField
                      className="col-sm-6 col-12 p-1 mt-2"
                      type="text"
                      value={employee.department}
                      name="department"
                      label="Department"
                      onChange={empChangeHandler}
                      variant="outlined"
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        className="col-sm-6 col-12 p-1 mt-2"
                        // value={employee.joinningDate}
                        onChange={(e) =>
                          setEmployee({
                            ...employee,
                            joinningDate: e,
                          })
                        }
                        label="Joinning Date"
                      />
                    </LocalizationProvider>
                    <TextField
                      className="col-sm-6 col-12 p-1 mt-2"
                      type="text"
                      name="education"
                      label="Education"
                      value={employee.education}
                      onChange={empChangeHandler}
                      variant="outlined"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row bank-reg">
        <div className="col-12 d-flex justify-content-center">
          <button
            type="button"
            className="align-items-center btn btn-bank d-flex fs-5 justify-content-center px-4 py-2"
            onClick={createHandler}
            disabled={loader}
          >
            {loader && (
              <div class="spinner-border me-2" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            )}
            Create
          </button>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const user = req.session.admin;

  if (user) {
    const empRes = await fetch(`${process.env.apiUrl}/admin/employee/getData`, {
      method: "PUT",
      body: JSON.stringify({ userId: user.userId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const empData = await empRes.json();

    if (empData.data[0].bankInfo[0].level == 5) {
      return {
        redirect: {
          destination: "/admin",
          permanent: false,
        },
      };
    }

    return {
      props: {
        empLevel: empData.data[0].bankInfo[0].level,
      },
    };
  } else {
    return {
      redirect: {
        destination: "admin/auth/login",
        permanent: false,
      },
    };
  }
});

export default create;
