import React, { useEffect, useState } from "react";
import { withSessionSsr } from "../../../helper/session";
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
import { toast } from "react-toastify";
import BankTree from "../../../component/admin/bank/BankTree";
import NoDataFound from "../../../component/admin/noDataFound";
import { useRouter } from "next/router";
import { enc, keyStore } from "../../../helper/common";

const transactionTable = ({ data, empData, treeSelectBox }) => {
  const router = useRouter();

  const [activeEmployee, setActiveEmployeeData] = useState({
    bankId: empData[0].bankInfo[0]._id,
    ifsc: empData[0].bankInfo[0].ifscCode,
  });

  const [toggleFilter, setToggleFilter] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);

  const date = moment(new Date()).subtract(1, "months");
  const [filter, setFilter] = useState({
    name: "",
    type: "",
    createdAt: [
      Math.floor(date["_d"].getTime() / 1000),
      Math.floor(date["_i"].getTime() / 1000),
    ],
  });

  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState("");
  const [sort, setSort] = useState({ createdAt: "asc" });

  const [loader, setLoader] = useState(false);

  const sortDataHandler = (info) => {
    if (sort[info] == "asc") {
      setSort({ [info]: "desc" });
    } else {
      setSort({ [info]: "asc" });
    }
  };

  const getTransData = async () => {
    if (!loader) {
      setLoader(true);
      const res = await fetch(`${process.env.apiUrl}/admin/loan/getLoanTable`, {
        method: "POST",
        body: JSON.stringify({
          page,
          sort,
          activeEmployee: activeEmployee.ifsc,
          filter,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setLoader(false);
      console.log(data);

      setPageCount(data.data.count);
      setUserData(data.data.userData);
    }
  };

  useEffect(() => {
    getTransData();
  }, [page, sort, activeEmployee, applyFilter]);

  const statusChangeHandler = async (statusData) => {
    const res = await fetch(`${process.env.apiUrl}/admin/loan/statusChange`, {
      method: "POST",
      body: JSON.stringify(statusData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (data.status) {
      toast.success("Status changed Successfully");
    } else {
      toast.error(data.message);
    }
  };

  const interestDeduct = async () => {
    const res = await fetch(`${process.env.apiUrl}/admin/loan/loanInterest`, {
      method: "POST",
      body: JSON.stringify(activeEmployee.ifsc),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
  };

  return (
    <>
      <div className="row bank-reg">
        <div className="col-12 d-flex">
          <BankTree
            data={data}
            setActiveEmployeeData={setActiveEmployeeData}
            activeEmployee={activeEmployee.bankId}
            select={treeSelectBox}
          />
        </div>
      </div>
      <div className="row bank-reg loan">
        <div className="align-items-center col-12 d-flex">
          <div className="col-12">
            <div className="card">
              <div className="pt-3 px-3 sub-head d-flex">
                <h3>Loan List</h3>
                <div className="ms-auto me-3 d-flex">
                  <button
                    type="button"
                    onClick={interestDeduct}
                    className="btn btn-bank text-danger btn btn-bank-sm mb-0 bg-white me-3"
                  >
                    Loan Interest
                  </button>
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
                        value={filter.name}
                        onChange={(e) =>
                          setFilter({ ...filter, name: e.target.value })
                        }
                        // value={filter.name}
                        variant="outlined"
                      />
                      <FormControl className="col-lg-3 col-sm-6 col-12 p-1 mt-2">
                        <InputLabel id="demo-simple-select-label">
                          Select Type of Loan
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          name="department"
                          label="Select Type of Loan"
                          onChange={(e) =>
                            setFilter({ ...filter, type: e.target.value })
                          }
                          value={filter.type}
                        >
                          <MenuItem value={0}>Personal Loan (12%)</MenuItem>
                          <MenuItem value={1}>Student Loan (9%)</MenuItem>
                          <MenuItem value={2}>Business Loan (12%)</MenuItem>
                          <MenuItem value={3}>House Loan (15%) </MenuItem>
                          <MenuItem value={4}>Mortgage Loan (15%)</MenuItem>
                        </Select>
                      </FormControl>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateRangePicker
                          slots={{ field: SingleInputDateRangeField }}
                          className="col-lg-3 col-sm-6 col-12 p-1 mt-2"
                          label="Created At"
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
                        className="btn btn-bank d-flex justify-content-center align-items-center my-4 mb-2"
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
                        className="btn btn-bank d-flex justify-content-center align-items-center ms-3 my-4 mb-2"
                        style={{ fontSize: "14px" }}
                        onClick={() => {
                          setFilter({
                            name: "",
                            type: "",
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
                  <hr className="my-1" />
                </>
              )}
              <div className="table-responsive p-0 loan-table">
                <table className="table align-items-center justify-content-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ">
                        <button
                          className="btn p-0 m-0"
                          onClick={() => sortDataHandler("firstName")}
                        >
                          User
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        <button
                          className="btn p-0 m-0"
                          onClick={() => sortDataHandler("duration")}
                        >
                          Duration
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        <button
                          className="btn p-0 m-0"
                          onClick={() => sortDataHandler("amount")}
                        >
                          Amount
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        <button
                          className="btn p-0 m-0"
                          onClick={() => sortDataHandler("type")}
                        >
                          Loan Type
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        <button
                          className="btn p-0 m-0"
                          onClick={() => sortDataHandler("collateralValue")}
                        >
                          Collateral Value
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
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
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        <button
                          className="btn p-0 m-0"
                          onClick={() => sortDataHandler("createdAt")}
                        >
                          Created At
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-uppercase text-center text-secondary text-xxs font-weight-bolder opacity-7">
                        <button className="btn p-0 m-0">Action</button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className={userData.length == 0 && "text-center"}>
                    {userData.length == 0 && <NoDataFound />}
                    {userData.length > 0 &&
                      [...userData].reverse().map((item) => {
                        const created = new Date(item.createdAt * 1000);
                        return (
                          <tr>
                            <td className="px-4">
                              <p className="text-md font-weight-bold mb-0">
                                {item.userName}
                              </p>
                              <p className="text-md text-secondary mb-0">
                                {item.userAccountNo}
                              </p>
                            </td>
                            <td className="px-4">
                              <p className="text-md font-weight-bold mb-0">
                                {item.duration.toString().length > 1
                                  ? item.duration / 12 + " Year"
                                  : item.duration + " Month"}
                              </p>
                            </td>
                            <td className="px-4">
                              <p className="text-md font-weight-bold mb-0">
                                {item.amount}
                              </p>
                            </td>
                            <td className="px-4">
                              <p className="text-md font-weight-bold mb-0">
                                {item.type == 0 && "Personal Loan"}
                                {item.type == 1 && "Student Loan"}
                                {item.type == 2 && "Business Loan"}
                                {item.type == 3 && "House Loan"}
                                {item.type == 4 && "Mortgage Loan"}
                              </p>
                            </td>
                            <td className="px-4 text-center">
                              <p className="text-md font-weight-bold mb-0">
                                {item.collateralValue}
                              </p>
                            </td>
                            <td className="px-4">
                              {item.status == 0 ? (
                                <span className="badge badge-md bg-gradient-secondary p-2">
                                  Pending
                                </span>
                              ) : item.status == 1 ? (
                                <span className="badge badge-md bg-gradient-success p-2">
                                  Verified
                                </span>
                              ) : item.status == 2 ? (
                                <span className="badge badge-md bg-gradient-danger p-2">
                                  Rejected
                                </span>
                              ) : (
                                <span className="badge badge-md bg-gradient-warning p-2">
                                  Closed
                                </span>
                              )}
                            </td>
                            <td className="px-4">
                              <p className="text-md font-weight-bold mb-0">
                                {moment(created).format("L")}
                              </p>
                            </td>
                            <td className="px-4">
                              <div className=" d-flex justify-content-center align-items-center">
                                <div className="me-3">
                                  <button
                                    className="btn btn-bank m-0"
                                    onClick={() => {
                                      const id = encodeURIComponent(
                                        enc(item._id, keyStore("idEnc"))
                                      );
                                      router.push(`/admin/loan/${id}`);
                                    }}
                                  >
                                    <i class="bi bi-eye-fill pe-1"></i>View
                                  </button>
                                </div>
                                {item.status == 0 ? (
                                  <FormControl className="mb-0">
                                    <Select
                                      labelId="demo-simple-select-label"
                                      name="action"
                                      value={item.status}
                                      onChange={async (e) => {
                                        if (e.target.value !== 0) {
                                          const alert = await Swal.fire({
                                            title: `Do you want to ${
                                              e.target.value == 1
                                                ? "Accept"
                                                : "Reject"
                                            } this Loan Request ?`,
                                            icon: "question",
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
                                              loanId: item._id,
                                              revId: item._rev,
                                            });
                                            await getTransData();
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
                                  <></>
                                )}
                              </div>
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
                      nextLabel="Next"
                      className="pageinate my-4 mb-2"
                      pageLinkClassName="page-link"
                      breakLinkClassName="page-link"
                      nextLinkClassName="page-link"
                      previousLinkClassName="page-link"
                      pageClassName="page-item"
                      breakClassName="page-item"
                      nextClassName="page-item"
                      previousClassName="page-item"
                      // className="pageinate my-4 mb-2"
                      activeClassName="active"
                      onPageChange={(e) => setPage(e.selected)}
                      pageRangeDisplayed={3}
                      forcePage={page}
                      pageCount={Math.ceil(pageCount / 10)}
                      previousLabel="Pev"
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

export default transactionTable;
