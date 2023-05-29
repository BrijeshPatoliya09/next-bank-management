import moment from "moment";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import ReactPaginate from "react-paginate";
import FilterListIcon from "@mui/icons-material/FilterList";
import { dec, keyStore } from "../../helper/common";

let initial = false;

const EmployeeTable = ({
  employeeData,
  onSetEmpModel,
  onSetEmpEdit,
  onGetEmpData,
  empCount,
  empType,
}) => {
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState({ name: "asc" });

  const sortDataHandler = (info) => {
    if (sort[info] == "asc") {
      setSort({ [info]: "desc" });
    } else {
      setSort({ [info]: "asc" });
    }
  };

  useEffect(() => {
    if (initial) {
      onGetEmpData(page, sort);
    }
    initial = true;
  }, [page, sort]);

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                <h6 className="text-white text-capitalize ps-3">
                  Employee table
                </h6>
              </div>
            </div>
            <div className="card-body px-0 pb-2">
              <div className="table-responsive p-0">
                <table className="table align-items-center justify-content-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        <button
                          className="btn p-0"
                          onClick={() => sortDataHandler("name")}
                        >
                          Name
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
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
                      {empType && (
                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 mb- ">
                          <button className="btn p-0">Password</button>
                        </th>
                      )}
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
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
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        <button
                          className="btn p-0"
                          onClick={() => sortDataHandler("DOB")}
                        >
                          Date of Birth
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        <button
                          className="btn p-0"
                          onClick={() => sortDataHandler("education")}
                        >
                          Education
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        <button
                          className="btn p-0"
                          onClick={() => sortDataHandler("joinningDate")}
                        >
                          Joinning Date
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        <button
                          className="btn p-0"
                          onClick={() => sortDataHandler("department")}
                        >
                          Department
                          <FilterListIcon
                            className="ms-1"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </th>
                      {/* <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
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
                      </th> */}
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Action
                      </th>
                      {/* <th className="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7 ps-2">
                          Completion
                        </th> */}
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeData.length == 0 && <p>No data Found</p>}
                    {employeeData.length > 0 &&
                      employeeData.map((item) => {
                        const join = item.joinningDate
                          ? new Date(item.joinningDate * 1000)
                          : "";

                        const DOB = new Date(item.DOB);
                        return (
                          <tr>
                            <td>
                              <div className="d-flex px-2">
                                <div>
                                  <img
                                    src="/assets/image/small-logos/logo-asana.svg"
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
                            {empType && (
                              <td>
                                <p className="text-sm font-weight-bold mb-0">
                                  {dec(item.password, keyStore("empPsw"))}
                                </p>
                              </td>
                            )}
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
                                {join ? moment(join).format("L") : "17/11/2020"}
                              </p>
                            </td>
                            <td>
                              <p className="text-sm font-weight-bold mb-0">
                                {item.department}
                              </p>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-outline-primary btn-sm mb-0"
                                style={{ fontSize: "14px" }}
                                onClick={() => {
                                  onSetEmpEdit(item);
                                  onSetEmpModel(1);
                                }}
                              >
                                <EditIcon />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    {/* <tr>
                        <td>
                          <div className="d-flex px-2">
                            <div>
                              <img
                                src="/assets/image/small-logos/logo-asana.svg"
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
                          <button className="btn btn-link text-secondary mb-0">
                            <i className="fa fa-ellipsis-v text-xs"></i>
                          </button>
                        </td>
                      </tr> */}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between px-3 pb-2">
                <div>
                  <button
                    type="button"
                    className="btn d-flex justify-content-center align-items-center bg-gradient-primary w-100 my-4 mb-2"
                    style={{ fontSize: "14px" }}
                    onClick={() => {
                      onSetEmpEdit("");
                      onSetEmpModel(1);
                    }}
                  >
                    Add Employee
                  </button>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel="next >"
                    className="pageinate my-4 mb-2"
                    onPageChange={(e) => setPage(e.selected)}
                    pageRangeDisplayed={3}
                    // forcePage={page}
                    pageCount={Math.ceil(empCount / 8)}
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeTable;
