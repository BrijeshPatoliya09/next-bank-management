import React, { useEffect, useState } from "react";
import moment from "moment";
import ReactPaginate from "react-paginate";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  DateRangePicker,
  SingleInputDateRangeField,
} from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { withSessionSsr } from "../../../helper/session";
import BankTree from "../../../component/admin/bank/BankTree";

const userTable = ({ data, empData, treeSelectBox }) => {
  const [activeEmployee, setActiveEmployeeData] = useState({
    bankId: empData[0].bankInfo[0]._id,
    ifsc: empData[0].bankInfo[0].ifscCode,
  });

  const date = moment(new Date()).subtract(1, "months");
  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState("");
  const [sort, setSort] = useState({ createdAt: "asc" });
  const [applyFilter, setApplyFilter] = useState(false);
  const [filter, setFilter] = useState({
    name: "",
    accountType: "",
    createdAt: [
      Math.floor(date["_d"].getTime() / 1000),
      Math.floor(date["_i"].getTime() / 1000),
    ],
  });

  const [toggleFilter, setToggleFilter] = useState(false);
  const [loader, setLoader] = useState(false);

  const sortDataHandler = (info) => {
    if (sort[info] == "asc") {
      setSort({ [info]: "desc" });
    } else {
      setSort({ [info]: "asc" });
    }
  };

  const statusChangeHandler = async (statusData) => {
    const res = await fetch(`${process.env.apiUrl}/admin/user/statusChange`, {
      method: "POST",
      body: JSON.stringify(statusData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
  };

  const getUserData = async () => {
    if (!loader) {
      setLoader(true);
      const res = await fetch(`${process.env.apiUrl}/admin/user/getTableData`, {
        method: "POST",
        body: JSON.stringify({
          page,
          sort,
          filter,
          activeEmployee: activeEmployee.bankId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setLoader(false);

      setPageCount(data.data.count);
      setUserData(data.data.userData);
    }
  };

  useEffect(() => {
    if (
      (filter.createdAt[0] && filter.createdAt[1]) ||
      filter.createdAt.length == 0
    ) {
      getUserData();
    }
  }, [page, sort, applyFilter, activeEmployee]);

  return (
    <>
      <BankTree
        data={data}
        setActiveEmployeeData={setActiveEmployeeData}
        activeEmployee={activeEmployee.bankId}
        select={treeSelectBox}
      />
      <div className="row">
        <div className="col-12">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex">
                <h6 className="text-white text-capitalize ps-3">User table</h6>
                <div className="ms-auto me-3">
                  <button
                    type="button"
                    onClick={() => setToggleFilter(!toggleFilter)}
                    className="btn text-danger btn-sm mb-0 bg-white"
                  >
                    Filter
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body px-0 pb-2 ">
              {toggleFilter && (
                <div className="filter px-4 mb-3">
                  <div className="d-flex justify-content-center">
                    <TextField
                      className="col-lg-3 col-sm-6 col-12 p-1 mt-2"
                      type="text"
                      name="name"
                      label="Name"
                      onChange={(e) => {
                        const timer = setTimeout(
                          () => setFilter({ ...filter, name: e.target.value }),
                          1000
                        );
                        return () => clearTimeout(timer);
                      }}
                      variant="outlined"
                    />
                    <FormControl className="col-lg-3 col-sm-6 col-12 p-1 mt-2">
                      <InputLabel id="demo-simple-select-label">
                        Select Account Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        name="department"
                        label="Select Account Type"
                        onChange={(e) =>
                          setFilter({ ...filter, accountType: e.target.value })
                        }
                      >
                        <MenuItem value={""}>All Account</MenuItem>
                        <MenuItem value={0}>Savings Account</MenuItem>
                        <MenuItem value={1}>Current Account</MenuItem>
                      </Select>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateRangePicker
                        slots={{ field: SingleInputDateRangeField }}
                        className="col-lg-3 col-sm-6 col-12 p-1 mt-2"
                        label="Registered Date"
                        value={[
                          dayjs(new Date(filter.createdAt[0] * 1000)),
                          dayjs(new Date(filter.createdAt[1] * 1000)),
                        ]}
                        onChange={(e) =>
                          setFilter({
                            ...filter,
                            createdAt: [
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
                      className="btn d-flex justify-content-center align-items-center bg-gradient-primary my-4 mb-2"
                      style={{ fontSize: "14px" }}
                      onClick={() => {
                        setApplyFilter(!applyFilter);
                      }}
                      disabled={loader}
                    >
                      Filter
                    </button>
                    <button
                      type="button"
                      className="btn d-flex justify-content-center align-items-center bg-gradient-primary ms-3 my-4 mb-2"
                      style={{ fontSize: "14px" }}
                      onClick={() => {
                        setFilter({
                          name: "",
                          accountType: "",
                          createdAt: [
                            Math.floor(date["_d"].getTime() / 1000),
                            Math.floor(date["_i"].getTime() / 1000),
                          ],
                        });
                        setApplyFilter(!applyFilter);
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
              <div className="table-responsive p-0">
                <table className="table align-items-center justify-content-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        <button className="btn p-0">Request Code</button>
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ">
                        <button
                          className="btn p-0"
                          onClick={() => sortDataHandler("firstName")}
                        >
                          Name
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        <button
                          className="btn p-0"
                          onClick={() => sortDataHandler("email")}
                        >
                          Email
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        <button
                          className="btn p-0"
                          onClick={() => sortDataHandler("contact")}
                        >
                          Contact
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        <button
                          className="btn p-0"
                          onClick={() => sortDataHandler("dob")}
                        >
                          Date of Birth
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        <button
                          className="btn p-0"
                          onClick={() => sortDataHandler("address")}
                        >
                          Address
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        <button className="btn p-0">National Proof</button>
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        <button
                          className="btn p-0"
                          onClick={() => sortDataHandler("nomineeName")}
                        >
                          Nominee Name
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        <button
                          className="btn p-0"
                          onClick={() => sortDataHandler("accountType")}
                        >
                          Account Type
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        <button
                          className="btn p-0"
                          onClick={() => sortDataHandler("accountStatus")}
                        >
                          Status
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        <button
                          className="btn p-0"
                          onClick={() => sortDataHandler("createdAt")}
                        >
                          Registered At
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        <button className="btn p-0">Action</button>
                      </th>
                      {/* <th className="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7 ps-2">
                          Completion
                        </th> */}
                    </tr>
                  </thead>
                  <tbody className={userData.length == 0 && "text-center"}>
                    {userData.length == 0 && (
                      <td colSpan="12" className="fs-4 py-4">
                        No data Found
                      </td>
                    )}
                    {userData.length > 0 &&
                      [...userData].reverse().map((item) => {
                        const DOB = new Date(item.dob * 1000);
                        const created = new Date(item.createdAt * 1000);
                        return (
                          <tr>
                            <td className="text-center">
                              <p className="text-sm font-weight-bold mb-0">
                                {item.accountReqCode}
                              </p>
                            </td>
                            <td>
                              <div className="d-flex px-2">
                                <div>
                                  <img
                                    src={item.nationalProofImage}
                                    className="avatar avatar-sm rounded-circle me-2"
                                    alt="spotify"
                                  />
                                </div>
                                <div className="my-auto">
                                  <h6 className="mb-0 text-sm">
                                    {item.firstName} {item.lastName}
                                  </h6>
                                </div>
                              </div>
                            </td>
                            <td>
                              <p className="text-sm font-weight-bold mb-0">
                                {item.email}
                              </p>
                            </td>
                            <td className="text-center">
                              <p className="text-sm font-weight-bold mb-0">
                                {item.contact}
                              </p>
                            </td>
                            <td className="text-center">
                              <p className="text-sm font-weight-bold mb-0">
                                {moment(DOB).format("L")}
                              </p>
                            </td>
                            <td>
                              <p className="text-sm font-weight-bold mb-0 w-25">
                                {item.address}, {item.city},<br />
                                {item.state}, {item.country},<br />
                                pinCode-{item.zipCode}
                              </p>
                            </td>
                            <td className="text-center">
                              <p className="text-sm font-weight-bold mb-0">
                                {item.nationalProof}
                              </p>
                              <p className="text-sm text-secondary mb-0">
                                {item.nationalProofNumber}
                              </p>
                            </td>
                            <td className="text-center">
                              <p className="text-sm font-weight-bold mb-0">
                                {item.nomineeName}
                              </p>
                            </td>
                            <td className="text-center">
                              <p className="text-sm font-weight-bold mb-0">
                                {item.accountType == 0
                                  ? "Savings Account"
                                  : "Current Account"}
                              </p>
                            </td>
                            <td className="text-center">
                              {item.accountStatus == 0 ? (
                                <span className="badge badge-sm bg-gradient-secondary p-2">
                                  Pending
                                </span>
                              ) : item.accountStatus == 1 ? (
                                <span className="badge badge-sm bg-gradient-success p-2">
                                  Verified
                                </span>
                              ) : (
                                <span className="badge badge-sm bg-gradient-danger p-2">
                                  Rejected
                                </span>
                              )}
                            </td>
                            <td className="text-center">
                              <p className="text-sm font-weight-bold mb-0">
                                {moment(created).format("L")}
                              </p>
                            </td>
                            <td className="text-center">
                              {item.accountStatus == 0 ? (
                                <FormControl className="mb-0">
                                  <Select
                                    labelId="demo-simple-select-label"
                                    name="action"
                                    value={0}
                                    onChange={async (e) => {
                                      if (e.target.value !== 0) {
                                        const alert = await Swal.fire({
                                          title: `Do you want to ${
                                            e.target.value == 1
                                              ? "Accept"
                                              : "Reject"
                                          } this user ?`,
                                          icon: "warning",
                                          showCancelButton: true,
                                          cancelButtonText: "Cancel",
                                          confirmButtonColor: "#5773FF",
                                          cancelButtonColor: "#9e9e9e",
                                          confirmButtonText: "Yes",
                                          allowEscapeKey: true,
                                        });
                                        if (alert.isConfirmed) {
                                          await statusChangeHandler({
                                            status: e.target.value,
                                            userId: item._id,
                                            revId: item._rev,
                                          });
                                          await getUserData();
                                        }
                                      }
                                    }}
                                  >
                                    <MenuItem value={0}>Pending</MenuItem>
                                    <MenuItem value={1}>Verified</MenuItem>
                                    <MenuItem value={2}>Rejected</MenuItem>
                                  </Select>
                                </FormControl>
                              ) : (
                                <>-</>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-end px-3 pb-2">
                {!loader && (
                  <div className="d-flex justify-content-center align-items-center">
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel="next >"
                      className="pageinate my-4 mb-2"
                      onPageChange={(e) => setPage(e.selected)}
                      pageRangeDisplayed={3}
                      forcePage={page}
                      pageCount={Math.ceil(pageCount / 10)}
                      previousLabel="< previous"
                      renderOnZeroPageCount={null}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
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

    const res = await fetch(`${process.env.apiUrl}/admin/bank/getTreeData`, {
      method: "PUT",
      body: JSON.stringify({
        bankData: {
          address: empData.data[0].bankInfo[0].address,
          level: empData.data[0].bankInfo[0].level,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    return {
      props: {
        data: data.data.newData,
        treeSelectBox: data.data.selectBox,
        empData: empData.data,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/admin/auth/login",
        permanent: false,
      },
    };
  }
});

export default userTable;
