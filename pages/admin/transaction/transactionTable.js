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

const transactionTable = ({ data, empData, treeSelectBox }) => {
  const [activeEmployee, setActiveEmployeeData] = useState(
    empData[0].bankInfo[0]._id
  );

  const date = moment(new Date()).subtract(1, "months");
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
      const res = await fetch(
        `${process.env.apiUrl}/admin/user/transaction/getTransTable`,
        {
          method: "POST",
          body: JSON.stringify({ page, sort, activeEmployee }),
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
  }, [page, sort, activeEmployee]);

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
      <BankTree
        data={data}
        setActiveEmployeeData={setActiveEmployeeData}
        activeEmployee={activeEmployee}
        select={treeSelectBox}
      />
      <div className="row">
        <div className="col-12">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex">
                <h6 className="text-white text-capitalize ps-3">
                  Transaction Table
                </h6>
                <div className="ms-auto me-3">
                  <button
                    type="button"
                    // onClick={() => setToggleFilter(!toggleFilter)}
                    className="btn btn-outline-primary btn-sm mb-0 bg-white"
                  >
                    Filter
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body px-0 pb-2 ">
              <div className="table-responsive p-0">
                <table className="table align-items-center justify-content-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ">
                        <button
                          className="btn p-0"
                          //   onClick={() => sortDataHandler("")}
                        >
                          From
                          {/* <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          /> */}
                        </button>
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ">
                        <button
                          className="btn p-0"
                          //   onClick={() => sortDataHandler("")}
                        >
                          To
                          {/* <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          /> */}
                        </button>
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        <button
                          className="btn p-0"
                          onClick={() => sortDataHandler("type")}
                        >
                          Transaction
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        <button
                          className="btn p-0"
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
                          className="btn p-0"
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
                          className="btn p-0"
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
                        <button className="btn p-0">Action</button>
                      </th>
                      {/* <th className="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7 ps-2">
                          Completion
                        </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {userData.length == 0 && <p>No data Found</p>}
                    {userData.length > 0 &&
                      [...userData].reverse().map((item) => {
                        const created = new Date(item.createdAt * 1000);
                        return (
                          <tr>
                            <td className="px-4">
                              <p className="text-md font-weight-bold mb-0">
                                {item.user == "Bank"
                                  ? item.user
                                  : `${item.user.firstName} ${item.user.lastName}`}
                              </p>
                              <p className="text-md text-secondary mb-0">
                                {item.user != "Bank"
                                  ? item.user.accountNumber
                                  : "(Bank Itself)"}
                              </p>
                            </td>
                            <td className="px-4">
                              <p className="text-md font-weight-bold mb-0">
                                {item.from == "Bank"
                                  ? item.from
                                  : `${item.from.firstName} ${item.from.lastName}`}
                              </p>
                              <p className="text-md text-secondary mb-0">
                                {item.from != "Bank"
                                  ? item.from.accountNumber
                                  : "(Bank Itself)"}
                              </p>
                            </td>
                            <td className="px-4">
                              <p className="text-md font-weight-bold mb-0">
                                {item.type == "c2b" && "Deposit"}
                                {item.type == "b2c" && "Withdraw"}
                                {item.type == "b2b" && "Other bank"}
                                {item.type == "c2c" && "Other Accountholder"}
                              </p>
                            </td>
                            <td className="px-4">
                              {console.log(
                                item.user.bank ==
                                  empData[0].bankInfo[0].ifscCode
                              )}
                              <p
                                className={`text-md font-weight-bold mb-0 ${
                                  item.user.bank ==
                                    empData[0].bankInfo[0].ifscCode ||
                                  (item.type == "b2c" && "text-danger")
                                }`}
                              >
                                {item.amount}
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
                                  <InputLabel id="demo-simple-select-label">
                                    Select Department
                                  </InputLabel>
                                  <Select
                                    labelId="demo-simple-select-label"
                                    name="action"
                                    label="Select Status"
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

export default transactionTable;
