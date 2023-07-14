import moment from "moment";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Document, Page } from "react-pdf";

const loanDetail = ({ loanData, error }) => {
  console.log(error);
  const router = useRouter();
  if (error) {
    return (
      <>
        <div className="d-flex justify-content-center mb-5">
          <div className="text-center">
            <p>This Loan Doesn't Exist Please Go Back and Try again</p>
            <button
              className="btn"
              onClick={() => router.back()}
              style={{ color: "rgb(33, 98, 115)" }}
            >
              <i class="bi bi-arrow-left me-2"></i>Go Back
            </button>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="row bank-reg loan-view">
          <div className="col-12 ps-0 d-flex flex-md-nowrap flex-wrap">
            <div className="col-12 col-lg-7 col-md-6 me-2 px-0 px-md-2">
              <div className="card mb-4" style={{ height: "95%" }}>
                <div className="pb-2 mb-3">
                  <div className="pt-3 px-3 sub-head d-flex align-items-center">
                    <h3 className="m-0">
                      Loan Details{" "}
                      {loanData.status == 0 ? (
                        <span className="text-secondary">(Pending Loan)</span>
                      ) : loanData.status == 1 ? (
                        <span className="text-success">(Confirmed Loan)</span>
                      ) : loanData.status == 2 ? (
                        <span className="text-danger">(Rejected Loan)</span>
                      ) : (
                        <span className="text-warning">(Closed Loan)</span>
                      )}
                    </h3>
                  </div>
                  <hr />
                  <div className="px-3 w-100">
                    <table className="w-100">
                      <tbody>
                        <tr>
                          <td>
                            <h3>Loan Type</h3>
                          </td>
                          <td>
                            <p>
                              {loanData.type == 0 && "Personal Loan"}
                              {loanData.type == 1 && "Student Loan"}
                              {loanData.type == 2 && "Business Loan"}
                              {loanData.type == 3 && "House Loan"}
                              {loanData.type == 4 && "Mortgage Loan"}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h3>Loan Amount</h3>
                          </td>
                          <td>
                            <p>Rs.{loanData.amount}</p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h3>Loan Duration</h3>
                          </td>
                          <td>
                            <p>
                              {loanData.duration.toString().length > 1
                                ? loanData.duration / 12 + " Year"
                                : loanData.duration + " Month"}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h3>Loan Interest</h3>
                          </td>
                          <td>
                            <p>{loanData.interest}%</p>
                          </td>
                        </tr>
                        {(loanData.status == 1 || loanData.status == 3) && (
                          <>
                            <tr>
                              <td>
                                <h3>Loan Start Date</h3>
                              </td>
                              <td>
                                <p>
                                  {moment(loanData.startDate * 1000).format(
                                    "MMM Do YYYY"
                                  )}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <h3>Loan Amount Left</h3>
                              </td>
                              <td>
                                <p>
                                  Rs.{Number(loanData.totalAmount).toFixed(0)}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <h3>Loan Installments Left</h3>
                              </td>
                              <td>
                                <p>{loanData.totalInt}</p>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <h3>Loan Penalties</h3>
                              </td>
                              <td>
                                <p>
                                  {loanData.penalty.length > 0
                                    ? loanData.penalty.map((item) => (
                                        <>
                                          <span className="me-2">
                                            {moment(
                                              item.timeStamp * 1000
                                            ).format("MMM Do YYYY")}
                                          </span>
                                          <span>
                                            {item.status == 0
                                              ? "Unpaid"
                                              : "Paid"}
                                          </span>
                                          <br />
                                        </>
                                      ))
                                    : "None"}
                                </p>
                              </td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-5 col-md-6 px-0 px-md-2">
              <div className="card mb-4" style={{ height: "95%" }}>
                <div className="pb-2 mb-3">
                  <div className="pt-3 px-3 sub-head d-flex align-items-center">
                    <h3 className="m-0">Loan Doccument</h3>
                  </div>
                  <hr />
                  <div
                    className="px-3 w-100"
                    style={{
                      height:
                        loanData.status == 1 || loanData.status == 3
                          ? "400px"
                          : "300px",
                    }}
                  >
                    <iframe
                      src={loanData.doccument}
                      width="100%"
                      height="100%"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row bank-reg loan-view">
          <div className="col-12 ps-0 d-flex flex-md-nowrap flex-wrap">
            <div className="col-12 col-lg-5 col-md-6 px-0 px-md-2 me-2">
              <div className="card mb-4" style={{ height: "95%" }}>
                <div className="pb-2 mb-3">
                  <div className="pt-3 px-3 sub-head d-flex align-items-center">
                    <h3 className="m-0">Collateral Doccument</h3>
                  </div>
                  <hr />
                  <div
                    className="px-3 pb-3 w-100"
                    style={{
                      height:
                        loanData.status == 1 || loanData.status == 3
                          ? "400px"
                          : "300px",
                    }}
                  >
                    {loanData.collateralDoc.includes("jpeg") ||
                    loanData.collateralDoc.includes("jpg") ? (
                      <img src={loanData.collateralDoc} />
                    ) : (
                      <iframe
                        src={loanData.collateralDoc}
                        width="100%"
                        height="100%"
                      ></iframe>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-7 col-md-6 px-0 px-md-2">
              <div className="card mb-4" style={{ height: "95%" }}>
                <div className="pb-2 mb-3">
                  <div className="pt-3 px-3 sub-head d-flex align-items-center">
                    <h3 className="m-0">Collateral Details</h3>
                  </div>
                  <hr />
                  <div className="px-3 w-100">
                    <table className="w-100">
                      <tbody>
                        <tr>
                          <td>
                            <h3>Collateral</h3>
                          </td>
                          <td>
                            <p>{loanData.collateralName}</p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h3>Collateral Value</h3>
                          </td>
                          <td>
                            <p>Rs.{loanData.collateralValue}</p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h3>Collateral Owner</h3>
                          </td>
                          <td>
                            <p>
                              {loanData.collateralOwner == 0 ? "User" : "Bank"}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export const getServerSideProps = async ({ req, query }) => {
  const res = await fetch(`${process.env.apiUrl}/admin/loan/getLoanData`, {
    method: "POST",
    body: JSON.stringify(query.loanDetail),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  if (data.status) {
    return {
      props: {
        loanData: data.data,
      },
    };
  } else {
    return {
      props: {
        error: true,
      },
    };
  }
};

export default loanDetail;
