import { TextField } from "@mui/material";
import React, { useState } from "react";
import Layout from "../../component/Layout";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const create = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    contact: "",
    department: "",
    joinningDate: "",
  });
  const [DOB, setDOB] = useState("");
  const [joinningDate, setJoinningDate] = useState("");

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const createHandler = (e) => {};

  return (
    <>
      <Layout>
        <div className="row">
          <div className="col-12">
            <div className="card my-4">
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                  <h6 className="text-white text-capitalize ps-3">
                    Employee Create
                  </h6>
                </div>
              </div>
              <div className="card-body px-3 pb-2">
                <div className="d-flex flex-wrap">
                  <div className="w-100 mt-3">
                    <TextField
                      className="col-4 p-1"
                      type="text"
                      name="name"
                      label="Name"
                      onChange={changeHandler}
                      variant="outlined"
                    />
                    <TextField
                      className="col-4 p-1"
                      type="email"
                      name="email"
                      label="Email"
                      onChange={changeHandler}
                      variant="outlined"
                    />
                    <TextField
                      className="col-4 p-1"
                      type="number"
                      name="contact"
                      label="Contact"
                      onChange={changeHandler}
                      variant="outlined"
                    />
                  </div>
                  <div className="w-100 mt-3">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        className="col-4 p-1"
                        onChange={(e) =>
                          setDOB(Math.floor(e?.$d.getTime() / 1000))
                        }
                        label="Date of Birth"
                      />
                    </LocalizationProvider>
                    <TextField
                      className="col-4 p-1"
                      type="text"
                      name="department"
                      label="Department"
                      onChange={changeHandler}
                      variant="outlined"
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        className="col-4 p-1"
                        onChange={(e) =>
                          setJoinningDate(Math.floor(e?.$d.getTime() / 1000))
                        }
                        label="Joinning Date"
                      />
                    </LocalizationProvider>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body d-flex justify-content-center px-3 pb-2">
          <div className="col-4">
            <button
              type="button"
              className="btn d-flex justify-content-center align-items-center bg-gradient-primary w-100 my-4 mb-2 fs-5"
              onClick={createHandler}
              //   disabled={loader}
            >
              {/* {loader && (
                <div class="spinner-border me-2" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              )} */}
              Create
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default create;
