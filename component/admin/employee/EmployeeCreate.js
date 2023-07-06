import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import {
  addPswHandler,
  checkEmail,
  checkName,
  checkPassword,
  enc,
  keyStore,
} from "../../../helper/common";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const EmployeeCreate = ({ onSetEmpModel, bankId, onGetEmpData, empEdit }) => {
  const [employee, setEmployee] = useState({
    name: empEdit ? empEdit.name : "",
    email: empEdit ? empEdit.email : "",
    contact: empEdit ? empEdit.contact : "",
    department: empEdit ? empEdit.department : "",
    education: empEdit ? empEdit.education : "",
    DOB: empEdit ? dayjs(new Date(empEdit.DOB * 1000)) : "",
    joinningDate: empEdit ? dayjs(new Date(empEdit.joinningDate * 1000)) : "",
    password: "",
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

  const [loader, setLoader] = useState(false);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const createHandler = async () => {
    if (empEdit) {
      delete employee.password;
    }

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

    if (validationEmployee.length > 0) {
      return toast.error(validationEmployee[0]);
    } else if (!checkEmail(employee.email)) {
      return toast.error("Please enter valid email");
    } else if (employee.password && !checkPassword(employee.password)) {
      return toast.error("Please enter valid password");
    } else if (employee.contact.length !== 10) {
      return toast.error("Please enter valid contact no.");
    } else if (textCheck.length > 0) {
      return toast.error(textCheck[0]);
    }

    if (!loader) {
      setLoader(true);

      if (!empEdit) {
        const res = await fetch(`${process.env.apiUrl}/admin/employee/create`, {
          method: "PUT",
          body: JSON.stringify({
            employee: {
              ...employee,
              password: enc(employee.password, keyStore("empPsw")),
              DOB: Math.floor(employee.DOB?.$d.getTime() / 1000),
              joinningDate: Math.floor(
                employee.joinningDate?.$d.getTime() / 1000
              ),
            },
            bankId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        setLoader(false);

        if (data.status) {
          toast.success(data.message);
          onGetEmpData();
        } else {
          toast.error(data.message);
        }
      } else {
        const res = await fetch(
          `${process.env.apiUrl}/admin/employee/editData`,
          {
            method: "PUT",
            body: JSON.stringify({
              employee: {
                ...employee,
                DOB: Math.floor(employee.DOB?.$d.getTime() / 1000),
                joinningDate: Math.floor(
                  employee.joinningDate?.$d.getTime() / 1000
                ),
              },
              employeeId: empEdit._id,
              employeeRev: empEdit._rev,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        setLoader(false);
        if (data.status) {
          toast.success(data.message);
          onGetEmpData();
        } else {
          toast.error(data.message);
        }
      }
    }
  };
  return (
    <>
      <div className="row bank-reg">
        <div className="align-items-center col-12 d-flex">
          <div className="col-12">
            <div className="card my-4">
              <div className="pb-2 mb-3">
                <div className="pt-3 px-3 sub-head">
                  <h3>Employee {!empEdit ? "Create" : "Edit"}</h3>
                </div>
                <hr />
                <div className="d-flex flex-wrap px-3">
                  <TextField
                    className="col-lg-4 col-sm-6 col-12 p-1 mt-2"
                    type="text"
                    name="name"
                    label="Name"
                    value={employee.name}
                    onChange={changeHandler}
                    variant="outlined"
                  />
                  <TextField
                    className="col-lg-4 col-sm-6 col-12 p-1 mt-2"
                    type="email"
                    name="email"
                    label="Email"
                    value={employee.email}
                    onChange={changeHandler}
                    variant="outlined"
                  />
                  {!empEdit.name && (
                    <div className="col-lg-4 col-sm-6 col-12 p-1 mt-2">
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
                  )}
                  <TextField
                    className="col-lg-4 col-sm-6 col-12 p-1 mt-2"
                    type="text"
                    name="contact"
                    label="Contact"
                    value={employee.contact}
                    onInput={(e) => {
                      e.target.value = e.target.value
                        .replace(/[^0-9]/g, "")
                        .replace(/(\..*)\./g, "$1");

                        setEmployee({...employee, contact: e.target.value})
                    }}
                    variant="outlined"
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      className="col-lg-4 col-sm-6 col-12 p-1 mt-2"
                      value={employee.DOB ? employee.DOB : null}
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
                    className="col-lg-4 col-sm-6 col-12 p-1 mt-2"
                    type="text"
                    value={employee.department}
                    name="department"
                    label="Department"
                    onChange={changeHandler}
                    variant="outlined"
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      className="col-lg-4 col-sm-6 col-12 p-1 mt-2"
                      value={
                        employee.joinningDate ? employee.joinningDate : null
                      }
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
                    className="col-lg-4 col-sm-6 col-12 p-1 mt-2"
                    type="text"
                    name="education"
                    label="Education"
                    value={employee.education}
                    onChange={changeHandler}
                    variant="outlined"
                  />
                </div>
                <div className=" d-flex justify-content-center px-3 pb-2">
                  <div>
                    <button
                      type="button"
                      className="btn btn-bank d-flex justify-content-center align-items-center my-4 mb-2"
                      style={{ fontSize: "14px" }}
                      onClick={createHandler}
                      disabled={loader}
                    >
                      {loader && (
                        <div class="spinner-border me-2" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                      )}
                      {!empEdit ? "Create" : "Edit"}
                    </button>
                  </div>
                  <div className="ms-4">
                    <button
                      type="button"
                      className="btn btn-bank my-4 mb-2"
                      style={{ fontSize: "14px" }}
                      onClick={() => onSetEmpModel(0)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeCreate;
