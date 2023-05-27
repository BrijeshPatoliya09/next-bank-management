import moment from "moment";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";

const EmployeeTable = ({ employeeData, onSetEmpModel, onSetEmpEdit }) => {
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
                        Name
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Email
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Contact
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Date of Birth
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Education
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Joinning Date
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Department
                      </th>
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
                          <tr key={item._id}>
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
              <div className="d-flex justify-content-center px-3 pb-2">
                <div>
                  <button
                    type="button"
                    className="btn d-flex justify-content-center align-items-center bg-gradient-primary w-100 my-4 mb-2"
                    style={{ fontSize: "14px" }}
                    onClick={() => {
                      onSetEmpEdit("")
                      onSetEmpModel(1);
                    }}
                  >
                    Add Employee
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

export default EmployeeTable;
