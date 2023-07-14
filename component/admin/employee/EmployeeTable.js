import moment from "moment";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import ReactPaginate from "react-paginate";
import FilterListIcon from "@mui/icons-material/FilterList";
import { dec, enc, keyStore } from "../../../helper/common";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  DateRangePicker,
  SingleInputDateRangeField,
} from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { toast } from "react-toastify";
import NoDataFound from "../noDataFound";

let initial = false;

const EmployeeTable = ({
  employeeData,
  onSetEmpModel,
  onSetEmpEdit,
  onGetEmpData,
  empCount,
  empType,
  departmentSelect,
  bankEmpLoader,
}) => {
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState({ name: "asc" });
  const [filter, setFilter] = useState({
    name: "",
    department: "",
    joinningDate: [],
  });

  const [applyFilter, setApplyFilter] = useState(false);
  const [toggleFilter, setToggleFilter] = useState(false);

  const sortDataHandler = (info) => {
    if (sort[info] == "asc") {
      setSort({ [info]: "desc" });
    } else {
      setSort({ [info]: "asc" });
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  useEffect(() => {
    if (initial) {
      onGetEmpData(page, sort, filter);
    }
    initial = true;
  }, [page, sort, applyFilter]);

  const statusChange = async (status) => {
    const res = await fetch(
      `${process.env.apiUrl}/admin/employee/statusChange`,
      {
        method: "PUT",
        body: JSON.stringify(status),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (data.status) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <>
      <div className="row bank-reg">
        <div className="align-items-center col-12 d-flex">
          <div className="col-12">
            <div className="card">
              <div className="pt-3 px-3 sub-head d-flex">
                <h3>Employee List</h3>
                <div className="ms-auto me-3 d-flex">
                  {empType && (
                    <button
                      type="button"
                      className="d-flex justify-content-center align-items-center btn btn-bank text-danger btn btn-bank-sm mb-0 me-3 bg-white"
                      style={{ fontSize: "14px" }}
                      onClick={() => {
                        onSetEmpEdit("");
                        onSetEmpModel(1);
                      }}
                    >
                      Add Employee
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setToggleFilter(!toggleFilter)}
                    className="btn btn-bank text-danger btn btn-bank-sm mb-0 bg-white"
                  >
                    Filter
                  </button>
                </div>
              </div>
              <hr className="my-2" />
              {toggleFilter && (
                <>
                  <div className="filter px-4">
                    <div className="d-flex justify-content-center">
                      <TextField
                        className="col-lg-3 col-sm-6 col-12 p-1 mt-2"
                        type="text"
                        name="name"
                        label="Name"
                        onChange={changeHandler}
                        value={filter.name}
                        variant="outlined"
                      />
                      <FormControl className="col-lg-3 col-sm-6 col-12 p-1 mt-2">
                        <InputLabel id="demo-simple-select-label">
                          Select Department
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          name="department"
                          label="Select Department"
                          onChange={changeHandler}
                          value={filter.department}
                        >
                          {departmentSelect
                            .filter(
                              (item, i) => departmentSelect.indexOf(item) == i
                            )
                            .map((item, i) => (
                              <MenuItem key={i} value={item}>
                                {item}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateRangePicker
                          slots={{ field: SingleInputDateRangeField }}
                          className="col-lg-3 col-sm-6 col-12 p-1 mt-2"
                          label="Date of joinning"
                          value={
                            filter.joinningDate.length == 0
                              ? [dayjs([]), dayjs([])]
                              : [
                                  dayjs(
                                    new Date(filter.joinningDate[0] * 1000)
                                  ),
                                  dayjs(
                                    new Date(filter.joinningDate[1] * 1000)
                                  ),
                                ]
                          }
                          onChange={(e) =>
                            setFilter({
                              ...filter,
                              joinningDate: [
                                Math.floor(e[0]?.$d.getTime() / 1000),
                                Math.floor(e[1]?.$d.getTime() / 1000),
                              ],
                            })
                          }
                        />
                      </LocalizationProvider>
                    </div>
                    <div className="d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-bank d-flex justify-content-center align-items-center my-4 mb-2"
                        style={{ fontSize: "14px" }}
                        onClick={() => {
                          setApplyFilter(!applyFilter);
                        }}
                        disabled={bankEmpLoader}
                      >
                        Filter
                      </button>
                      <button
                        type="button"
                        className="btn btn-bank d-flex justify-content-center align-items-center ms-3 my-4 mb-2"
                        style={{ fontSize: "14px" }}
                        onClick={() => {
                          onGetEmpData();
                          setFilter({
                            name: "",
                            department: "",
                            joinningDate: [],
                          });
                        }}
                        disabled={bankEmpLoader}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                  <hr className="my-1" />
                </>
              )}
              <div className="table-responsive p-0 w-100">
                <table className="table align-items-center justify-content-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-secondary text-xxs font-weight-bolder opacity-7">
                        <button
                          className="btn p-0 m-0"
                          onClick={() => sortDataHandler("name")}
                        >
                          Name
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        <button
                          className="btn p-0 m-0"
                          onClick={() => sortDataHandler("email")}
                        >
                          Email
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        <button
                          className="btn p-0 m-0"
                          onClick={() => sortDataHandler("contact")}
                        >
                          Contact
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        <button
                          className="btn p-0 m-0"
                          onClick={() => sortDataHandler("DOB")}
                        >
                          Date of Birth
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        <button
                          className="btn p-0 m-0"
                          onClick={() => sortDataHandler("education")}
                        >
                          Education
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        <button
                          className="btn p-0 m-0"
                          onClick={() => sortDataHandler("status")}
                        >
                          Status
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        <button
                          className="btn p-0 m-0"
                          onClick={() => sortDataHandler("joinningDate")}
                        >
                          Joinning Date
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        <button
                          className="btn p-0 m-0"
                          onClick={() => sortDataHandler("department")}
                        >
                          Department
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      {/* <th className="text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        <button
                          className="btn p-0 m-0"
                          onClick={() => sortDataHandler("status")}
                        >
                          Status
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th> */}
                      {empType && (
                        <th className="text-center text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                          <button className="btn p-0 m-0">Action</button> 
                        </th>
                      )}
                      {/* <th className="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7 ps-2">
                          Completion
                        </th> */}
                    </tr>
                  </thead>
                  <tbody className={employeeData.length == 0 && "text-center"}>
                    {employeeData.length == 0 && <NoDataFound />}
                    {employeeData.length > 0 &&
                      employeeData.map((item) => {
                        const join = new Date(item.joinningDate * 1000);

                        const DOB = new Date(item.DOB * 1000);
                        return (
                          <tr>
                            <td>
                              <div className="d-flex px-2">
                                <div>
                                  <img
                                    src="/assets/image/admin/small-logos/logo-asana.svg"
                                    className="avatar avatar-sm rounded-circle me-2"
                                    alt="spotify"
                                  />
                                </div>
                                <div className="my-auto">
                                  <h6 className="mb-0 text-sm">{item.name}</h6>
                                </div>
                              </div>
                            </td>
                            <td>
                              <p className="text-sm font-weight-bold mb-0">
                                {item.email}
                              </p>
                            </td>
                            <td>
                              <p className="text-sm font-weight-bold mb-0">
                                {item.contact}
                              </p>
                            </td>
                            <td>
                              <p className="text-sm font-weight-bold mb-0">
                                {moment(DOB).format("L")}
                              </p>
                            </td>
                            <td>
                              <p className="text-sm font-weight-bold mb-0">
                                {item.education}
                              </p>
                            </td>
                            <td>
                              <p className="text-sm font-weight-bold mb-0">
                                {item.status == 0 ? (
                                  <span className="badge badge-sm bg-gradient-success p-2">
                                    Active
                                  </span>
                                ) : (
                                  <span className="badge badge-sm bg-gradient-danger p-2">
                                    Deactive
                                  </span>
                                )}
                              </p>
                            </td>
                            <td>
                              <p className="text-sm font-weight-bold mb-0">
                                {moment(join).format("L")}
                              </p>
                            </td>
                            <td>
                              <p className="text-sm font-weight-bold mb-0">
                                {item.department}
                              </p>
                            </td>

                            {empType && (
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-bank btn btn-bank-outline-primary btn btn-bank-sm mb-0"
                                  style={{ fontSize: "14px" }}
                                  onClick={async () => {
                                    const alert = await Swal.fire({
                                      title: `Do you want to ${
                                        item.status == 0
                                          ? "Deactivate"
                                          : "Activate"
                                      }  this Employee ?`,
                                      icon: "warning",
                                      showCancelButton: true,
                                      cancelButtonText: "Cancel",
                                      confirmButtonColor: "#5773FF",
                                      cancelButtonColor: "#9e9e9e",
                                      confirmButtonText: "Yes",
                                      allowEscapeKey: true,
                                    });
                                    if (alert.isConfirmed) {
                                      if (item.status == 0) {
                                        await statusChange({
                                          status: 1,
                                          empId: enc(
                                            item._id,
                                            keyStore("idEnc")
                                          ),
                                          empRev: enc(
                                            item._rev,
                                            keyStore("idEnc")
                                          ),
                                        });
                                      } else {
                                        await statusChange({
                                          status: 0,
                                          empId: enc(
                                            item._id,
                                            keyStore("idEnc")
                                          ),
                                          empRev: enc(
                                            item._rev,
                                            keyStore("idEnc")
                                          ),
                                        });
                                      }
                                      await onGetEmpData();
                                    }
                                  }}
                                >
                                  {item.status == 0 ? (
                                    <CloseIcon />
                                  ) : (
                                    <CheckIcon />
                                  )}
                                  {item.status == 0 ? "Deactive" : "Active"}
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-bank btn btn-bank-outline-primary btn btn-bank-sm mb-0 ms-2"
                                  style={{ fontSize: "14px" }}
                                  onClick={() => {
                                    onSetEmpEdit(item);
                                    onSetEmpModel(1);
                                  }}
                                >
                                  <EditIcon />
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    {/* <tr>
                        <td>
                          <div className="d-flex px-2">
                            <div>
                              <img
                                src="/assets/image/admin/small-logos/logo-asana.svg"
                                className="avatar avatar-sm rounded-circle me-2"
                                alt="spotify"
                              />
                            </div>
                            <div className="my-auto">
                              <h6 className="mb-0 text-sm">Asana</h6>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className="text-sm font-weight-bold mb-0">
                            $2,500
                          </p>
                        </td>
                        <td>
                          <span className="text-xs font-weight-bold">
                            working
                          </span>
                        </td>
                        <td className="align-middle text-center">
                          <div className="d-flex align-items-center justify-content-center">
                            <span className="me-2 text-xs font-weight-bold">
                              60%
                            </span>
                            <div>
                              <div className="progress">
                                <div
                                  className="progress-bar bg-gradient-info"
                                  role="progressbar"
                                  aria-valuenow="60"
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                  style={{ width: "60%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="align-middle">
                          <button className="btn btn-bank btn btn-bank-link text-secondary mb-0">
                            <i className="fa fa-ellipsis-v text-xs"></i>
                          </button>
                        </td>
                      </tr> */}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-end px-3 pb-2 w-100">
                {!bankEmpLoader && (
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel="Next"
                    onPageChange={(e) => setPage(e.selected)}
                    pageRangeDisplayed={3}
                    // forcePage={page}
                    pageLinkClassName="page-link"
                    breakLinkClassName="page-link"
                    nextLinkClassName="page-link"
                    previousLinkClassName="page-link"
                    pageClassName="page-item"
                    breakClassName="page-item"
                    nextClassName="page-item"
                    previousClassName="page-item"
                    className="pageinate my-4 mb-2"
                    activeClassName="active"
                    pageCount={Math.ceil(empCount / 8)}
                    previousLabel="Pev"
                    renderOnZeroPageCount={null}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeTable;
