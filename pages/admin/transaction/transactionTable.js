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

const transactionTable = ({ data, empData, treeSelectBox }) => {
  const [activeEmployee, setActiveEmployeeData] = useState({
    bankId: empData[0].bankInfo[0]._id,
    ifsc: empData[0].bankInfo[0].ifscCode,
  });
  const [toggleFilter, setToggleFilter] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);

  const date = moment(new Date()).subtract(1, "months");
  const [filter, setFilter] = useState({
    user: "",
    from: "",
    type: "",
    createdAt: [
      Math.floor(date["_d"].getTime() / 1000),
      Math.floor(date["_i"].getTime() / 1000),
    ],
  });

  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState("");
  const [sort, setSort] = useState({ createdAt: 0 });

  const [loader, setLoader] = useState(false);

  const sortDataHandler = (info) => {
    if (sort[info] == 0) {
      setSort({ [info]: 1 });
    } else {
      setSort({ [info]: 0 });
    }
  };

  const getTransData = async () => {
    if (!loader) {
      setLoader(true);
      const res = await fetch(
        `${process.env.apiUrl}/admin/user/transaction/getTransTable`,
        {
          method: "POST",
          body: JSON.stringify({
            page,
            sort,
            activeEmployee,
            filter,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      setLoader(false);

      setPageCount(data.data.count);
      setUserData(data.data.userData);
    }
  };

  useEffect(() => {
    getTransData();
  }, [page, sort, activeEmployee, applyFilter]);

  const statusChangeHandler = async (statusData) => {
    const res = await fetch(
      `${process.env.apiUrl}/admin/user/transaction/statusChange`,
      {
        method: "POST",
        body: JSON.stringify(statusData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (data.status) {
      toast.success("Status changed Successfully");
    } else {
      toast.error(data.message);
    }
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
      <div className="row bank-reg">
        <div className="align-items-center col-12 d-flex">
          <div className="col-12">
            <div className="card my-4">
              <div className="pt-3 px-3 sub-head d-flex">
                <h3>Transaction Table</h3>
                <div className="ms-auto me-3">
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
                        label="From"
                        onChange={(e) =>
                          setFilter({ ...filter, user: e.target.value })
                        }
                        value={filter.user}
                        variant="outlined"
                      />
                      <TextField
                        className="col-lg-3 col-sm-6 col-12 p-1 mt-2"
                        type="text"
                        label="To"
                        onChange={(e) =>
                          setFilter({ ...filter, from: e.target.value })
                        }
                        value={filter.from}
                        variant="outlined"
                      />
                      <FormControl className="col-lg-3 col-sm-6 col-12 p-1 mt-2">
                        <InputLabel id="demo-simple-select-label">
                          Select Type
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          label="Select Type"
                          onChange={(e) =>
                            setFilter({ ...filter, type: e.target.value })
                          }
                          value={filter.type}
                        >
                          <MenuItem value="b2b">Bank to Bank</MenuItem>
                          <MenuItem value="b2c">Bank to Customer</MenuItem>
                          <MenuItem value="c2b">Customer to Bank</MenuItem>
                          <MenuItem value="c2c">Customer to Customer</MenuItem>
                          <MenuItem value="Loan">Loan</MenuItem>
                          <MenuItem value="Penalty">Penalty</MenuItem>
                          <MenuItem value="Interest">Interest</MenuItem>
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
                            user: "",
                            from: "",
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
              <div className="table-responsive p-0">
                <table className="table align-items-center justify-content-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ">
                        <button
                          className="btn p-0 m-0"
                          onClick={() => sortDataHandler("user")}
                        >
                          From
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ">
                        <button
                          className="btn p-0 m-0"
                          onClick={() => sortDataHandler("from")}
                        >
                          To
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
                          Type
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
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        <button className="btn p-0 m-0">Action</button>
                      </th>
                      {/* <th className="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7 ps-2">
                          Completion
                        </th> */}
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
                                {item.user}
                              </p>
                              <p className="text-md text-secondary mb-0">
                                {item.userAc}
                              </p>
                            </td>
                            <td className="px-4">
                              <p className="text-md font-weight-bold mb-0">
                                {item.from}
                              </p>
                              <p className="text-md text-secondary mb-0">
                                {item.fromAc}
                              </p>
                            </td>
                            <td className="px-4">
                              <p className="text-md font-weight-bold mb-0">
                                {item.type == "c2b" && "Customer to Bank"}
                                {item.type == "b2c" && "Bank to Customer"}
                                {item.type == "b2b" && "Bank to Bank"}
                                {item.type == "c2c" && "Customer to Customer"}
                                {item.type !== "c2c" &&
                                  item.type !== "b2b" &&
                                  item.type !== "b2c" &&
                                  item.type !== "c2b" &&
                                  item.type}
                              </p>
                            </td>
                            <td className="px-4">
                              <p
                                className={`text-md font-weight-bold mb-0 
                                ${item.type == "b2c" && "text-danger"}
                                ${item.type == "c2b" && "text-success"}
                                ${
                                  item.userIfsc == activeEmployee.ifsc &&
                                  item.fromIfsc == activeEmployee.ifsc
                                    ? ""
                                    : item.userIfsc == activeEmployee.ifsc &&
                                      item.type !== "b2c" &&
                                      item.type !== "c2b"
                                    ? "text-danger"
                                    : item.fromIfsc == activeEmployee.ifsc &&
                                      item.type !== "b2c" &&
                                      item.type !== "c2b"
                                    ? "text-success"
                                    : ""
                                }
                                `}
                              >
                                {Number(item.amount).toFixed(0)}
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
                              ) : (
                                <span className="badge badge-md bg-gradient-danger p-2">
                                  Rejected
                                </span>
                              )}
                            </td>
                            <td className="px-4">
                              <p className="text-md font-weight-bold mb-0">
                                {moment(created).format("L")}
                              </p>
                            </td>
                            <td className="px-4">
                              {item.status == 0 ? (
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
                                          } this transaction ?`,
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
                                            transId: item._id,
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
