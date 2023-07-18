import { LocalizationProvider } from "@mui/x-date-pickers";
import {
  DateRangePicker,
  SingleInputDateRangeField,
} from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

const transactionHistory = () => {
  const [userData, setUserData] = useState([]);
  const [pageCount, setPageCount] = useState("");
  const [sort, setSort] = useState({ createdAt: 1 });
  const [page, setPage] = useState(0);

  const date = moment(new Date()).subtract(1, "months");
  const [filter, setFilter] = useState({
    name: "",
    createdAt: [
      Math.floor(date["_d"].getTime() / 1000),
      Math.floor(date["_i"].getTime() / 1000),
    ],
  });
  const [applyFilter, setApplyFilter] = useState(false);

  const [loader, setLoader] = useState(false);

  const getTransData = async () => {
    if (!loader) {
      setLoader(true);
      const res = await fetch(
        `${process.env.apiUrl}/user/transaction/history`,
        {
          method: "POST",
          body: JSON.stringify({
            page,
            sort,
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
  }, [page, sort, applyFilter]);

  const sortDataHandler = (info) => {
    if (sort[info] == 0) {
      setSort({ [info]: 1 });
    } else {
      setSort({ [info]: 0 });
    }
  };

  return (
    <>
      <div className="hero-area2 slider-height2 hero-overly2 d-flex align-items-center ">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="hero-cap text-center pt-50">
                <h2>Transaction History</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="apply-area py-80 trans-history">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="apply-wrapper">
                <div className="table-responsive custom-table-responsive">
                  <div className="filter mb-4">
                    <div className="col-3 p-0 me-3">
                      <label className="ms-3">Name</label>
                      <input
                        type="text"
                        className="fil_form"
                        name="name"
                        onChange={(e) =>
                          setFilter({ ...filter, name: e.target.value })
                        }
                        placeholder="Name"
                      />
                    </div>
                    <div className="col-3 p-0 me-3">
                      <label className="ms-3">Date</label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateRangePicker
                          slots={{ field: SingleInputDateRangeField }}
                          className="w-100"
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
                    <div className="align-items-end d-flex">
                      <button
                        className="btn"
                        onClick={() => setApplyFilter(!applyFilter)}
                      >
                        <i class="bi bi-funnel-fill"></i> Search
                      </button>
                    </div>
                  </div>
                  <table className="table custom-table">
                    <thead>
                      <tr>
                        <th scope="col">
                          <button
                            className="btn p-0"
                            onClick={() => sortDataHandler("createdAt")}
                            disabled={loader}
                          >
                            Date{" "}
                            <i
                              className={
                                sort.createdAt == 0
                                  ? "bi bi-sort-numeric-down"
                                  : "bi bi-sort-numeric-up"
                              }
                            ></i>
                          </button>
                        </th>
                        <th scope="col">
                          <button
                            className="btn p-0"
                            onClick={() => sortDataHandler("name")}
                            disabled={loader}
                          >
                            Name{" "}
                            <i
                              className={
                                sort.name == 0
                                  ? "bi bi-sort-alpha-down"
                                  : "bi bi-sort-alpha-up"
                              }
                            ></i>
                          </button>{" "}
                        </th>
                        <th scope="col">
                          <button
                            className="btn p-0"
                            onClick={() => sortDataHandler("description")}
                            disabled={loader}
                          >
                            Description{" "}
                            <i
                              className={
                                sort.description == 0
                                  ? "bi bi-sort-alpha-down"
                                  : "bi bi-sort-alpha-up"
                              }
                            ></i>
                          </button>
                        </th>
                        <th scope="col">
                          <button
                            className="btn p-0"
                            onClick={() => sortDataHandler("amount")}
                            disabled={loader}
                          >
                            Transaction{" "}
                            <i
                              className={
                                sort.amount == 0
                                  ? "bi bi-sort-numeric-down"
                                  : "bi bi-sort-numeric-up"
                              }
                            ></i>
                          </button>
                        </th>
                        <th scope="col">
                          <button
                            className="btn p-0"
                            onClick={() => sortDataHandler("balance")}
                            disabled={loader}
                          >
                            Total Balance{" "}
                            <i
                              className={
                                sort.createdOn == 0
                                  ? "bi bi-sort-numeric-down"
                                  : "bi bi-sort-numeric-up"
                              }
                            ></i>
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData.length > 0 &&
                        userData.map((item) => (
                          <>
                            <tr scope="row">
                              {/* <th scope="row">
                          <label className="control control--checkbox">
                            <input type="checkbox" />
                            <div className="control__indicator"></div>
                          </label>
                        </th> */}
                              <td>
                                {moment(item.createdAt * 1000).format("lll")}
                              </td>
                              <td>{item.name}</td>
                              <td>
                                {item.description ? item.description : "-"}
                              </td>
                              <td
                                className={
                                  item.trans == 0
                                    ? "text-danger"
                                    : "text-success"
                                }
                              >
                                {item.amount}
                              </td>
                              <td>{item.balance}</td>
                            </tr>
                            <tr className="spacer">
                              <td colSpan="100"></td>
                            </tr>
                          </>
                        ))}
                    </tbody>
                  </table>

                  {userData.length == 0 && !loader && (
                    <div className="text-center my-5">
                      <h3 className="text-secondary">No Data Found</h3>
                    </div>
                  )}

                  {loader && (
                    <div className="w-100 d-flex justify-content-center">
                      <div
                        className="spinner-border text-secondary"
                        role="status"
                      >
                        <span className="visually-hidden"></span>
                      </div>
                    </div>
                  )}
                  <div className="d-flex justify-content-end">
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel="Next"
                      className="paginate"
                      onPageChange={(e) => setPage(e.selected)}
                      pageRangeDisplayed={3}
                      // forcePage={page}
                      pageCount={1}
                      previousLabel="Prev"
                      renderOnZeroPageCount={null}
                    />
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

export default transactionHistory;
