import { TextField } from "@mui/material";
import React, { useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { checkEmail, checkName } from "../../../helper/common";

const EmployeeCreate = ({ onSetEmpModel, bankId, onGetEmpData, empEdit }) => {
  const [employee, setEmployee] = useState({
    name: empEdit ? empEdit.name : "",
    email: empEdit ? empEdit.email : "",
    contact: empEdit ? empEdit.contact : "",
    department: empEdit ? empEdit.department : "",
    education: empEdit ? empEdit.education : "",
    DOB: empEdit ? dayjs(empEdit.DOB) : "",
    joinningDate: empEdit ? dayjs(empEdit.joinningDate) : "",
  });

  const [loader, setLoader] = useState(false);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const createHandler = async () => {
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
    } else if (employee.contact.length !== 10) {
      return toast.error("Please enter valid contact no.");
    } else if (!checkEmail(employee.email)) {
      return toast.error("Please enter valid email");
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
      <div className="row">
        <div className="col-12">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                <h6 className="text-white text-capitalize ps-3">
                  Employee {!empEdit ? "Create" : "Edit"}
                </h6>
              </div>
            </div>
            <div className="card-body px-3 pb-2">
              <div className="d-flex flex-wrap">
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
                <TextField
                  className="col-lg-4 col-sm-6 col-12 p-1 mt-2"
                  type="number"
                  name="contact"
                  label="Contact"
                  value={employee.contact}
                  onChange={changeHandler}
                  variant="outlined"
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    className="col-lg-4 col-sm-6 col-12 p-1 mt-2"
                    value={employee.DOB}
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
                    value={employee.joinningDate}
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
                    className="btn d-flex justify-content-center align-items-center bg-gradient-primary my-4 mb-2"
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
                    className="btn bg-gradient-primary bg-gradient-primary my-4 mb-2"
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
    </>
  );
};

export default EmployeeCreate;
