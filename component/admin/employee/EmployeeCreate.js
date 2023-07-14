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
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

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
  const [showPassword, setShowPassword] = useState(false);

  const [pswChange, setPswChange] = useState(false);
  const [changePsw, setChangePsw] = useState({
    oldPsw: "",
    newPsw: "",
    confirmPsw: "",
  });
  const [newShowPsw, setNewShowPsw] = useState(false);
  const [confShowPsw, setconfShowPsw] = useState(false);

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

    if (empEdit && pswChange) {
      if (!changePsw.oldPsw || changePsw.oldPsw.trim() == "") {
        return toast.error("Please enter old password.");
      } else if (!changePsw.newPsw || changePsw.newPsw.trim() == "") {
        return toast.error("Please enter new password.");
      } else if (!changePsw.confirmPsw || changePsw.confirmPsw.trim() == "") {
        return toast.error("Please enter confirm password.");
      } else if (!checkPassword(changePsw.newPsw)) {
        return toast.error("Please enter valid New password");
      } else if (changePsw.newPsw != changePsw.confirmPsw) {
        return toast.error("New password and Confirm password must be same");
      }
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
              change: pswChange ? 1 : 0,
              oldPsw: enc(changePsw.oldPsw, keyStore("empPsw")),
              newPsw: enc(changePsw.newPsw, keyStore("empPsw")),
              confPsw: enc(changePsw.confirmPsw, keyStore("empPsw")),
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
            <div className="card">
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

                      setEmployee({ ...employee, contact: e.target.value });
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
                  {empEdit && pswChange && (
                    <>
                      <FormControl
                        variant="outlined"
                        className="col-lg-4 col-sm-6 col-12 p-1 mt-2"
                      >
                        <InputLabel htmlFor="outlined-adornment-password">
                          Old Password
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-password"
                          type={showPassword ? "text" : "password"}
                          value={changePsw.oldPsw}
                          onChange={({ target: { value } }) => {
                            setChangePsw({ ...changePsw, oldPsw: value });
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
                          label="Old Password"
                        />
                      </FormControl>
                      <div className="col-lg-4 col-sm-6 col-12 p-1 mt-2">
                        <FormControl variant="outlined" className="w-100">
                          <InputLabel htmlFor="outlined-adornment-password">
                            New Password
                          </InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-password"
                            type={newShowPsw ? "text" : "password"}
                            value={changePsw.newPsw}
                            onChange={({ target: { value } }) => {
                              if (!pwdTouch) {
                                setPwdTouch(true);
                              }
                              setChangePsw({ ...changePsw, newPsw: value });
                              addPswHandler(value, setPswValid);
                            }}
                            variant="outlined"
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() => setNewShowPsw(!newShowPsw)}
                                  onMouseDown={(e) => e.preventDefault()}
                                  edge="end"
                                >
                                  {newShowPsw ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            }
                            label="New Password"
                          />
                        </FormControl>
                        {pwdTouch && (
                          <div>
                            <span>
                              <span
                                className={`pass-valid ${
                                  pswValid.digit
                                    ? "text-success"
                                    : "text-danger"
                                }`}
                              >
                                1 Number
                              </span>{" "}
                              |
                              <span
                                className={`pass-valid ${
                                  pswValid.upper
                                    ? "text-success"
                                    : "text-danger"
                                }`}
                              >
                                {" "}
                                1 Uppercase
                              </span>{" "}
                              |
                              <span
                                className={`pass-valid ${
                                  pswValid.lower
                                    ? "text-success"
                                    : "text-danger"
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
                                  pswValid.length
                                    ? "text-success"
                                    : "text-danger"
                                }`}
                              >
                                {" "}
                                Min 8 - 30 Max Character
                              </span>{" "}
                            </span>
                          </div>
                        )}
                      </div>
                      <FormControl
                        variant="outlined"
                        className="col-lg-4 col-sm-6 col-12 p-1 mt-2"
                      >
                        <InputLabel htmlFor="outlined-adornment-password">
                          Confirm Password
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-password"
                          type={confShowPsw ? "text" : "password"}
                          value={changePsw.confirmPsw}
                          onChange={({ target: { value } }) => {
                            setChangePsw({ ...changePsw, confirmPsw: value });
                          }}
                          variant="outlined"
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setconfShowPsw(!confShowPsw)}
                                onMouseDown={(e) => e.preventDefault()}
                                edge="end"
                              >
                                {confShowPsw ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                          label="Confirm Password"
                        />
                      </FormControl>
                    </>
                  )}
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
                  {empEdit && (
                    <div className="ms-4">
                      <button
                        type="button"
                        className="btn btn-bank my-4 mb-2"
                        style={{ fontSize: "14px" }}
                        onClick={() => setPswChange(!pswChange)}
                      >
                        {pswChange ? <CloseIcon /> : <CheckIcon />}
                        Change Password
                      </button>
                    </div>
                  )}
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
