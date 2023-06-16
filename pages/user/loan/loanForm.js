import React, { useState } from "react";
import { imgUploadHandler, removeImgHandler } from "../../../helper/common";

const loanForm = () => {
  const [loader, setLoader] = useState(false);
  const [loan, setLoan] = useState({
    type: "",
    amount: "",
    duration: "",
  });

  const [collteral, setCollateral] = useState({
    name: "",
    value: "",
    image: "",
  });

  const submitHandler = async () => {
    //!loan
    let validationLoan = [];
    Object.keys(loan).map((eachData) => {
      if (
        !loan[eachData] ||
        loan[eachData] == "" ||
        loan[eachData] == undefined
      ) {
        validationUser.push(`Please enter loan ${eachData}`);
      }
    });
  };

  return (
    <>
      <div className="hero-area2  slider-height2 hero-overly2 d-flex align-items-center ">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="hero-cap text-center pt-50">
                <h2>Bank Payment</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="apply-area pt-150 pb-150">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="apply-wrapper">
                <div className="text-center mb-3">
                  <h1>Loan</h1>
                </div>
                <form action="#">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="single-form">
                        <label>Loan Type</label>
                        <div className="select-option mb-10">
                          <select
                            className="nice-select"
                            tabIndex="0"
                            onChange={(e) =>
                              setLoan({ ...loan, type: e.target.value })
                            }
                          >
                            <option value="" className="option selected focus">
                              Choose Loan Type
                            </option>
                            <option value={0}>Personal Loan</option>
                            <option value={1}>Student Loan</option>
                            <option value={2}>Business Loan</option>
                            <option value={3}>House Loan</option>
                            <option value={4}>Mortgage Loan</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="single-form">
                        <label>Loan Amount</label>
                        <input
                          type="text"
                          name="accountNo"
                          placeholder="Enter Loan Amount"
                          onInput={(e) => {
                            e.target.value = e.target.value
                              .replace(/[^0-9]/g, "")
                              .replace(/(\..*)\./g, "$1");
                            setLoan({ ...loan, amount: e.target.value });
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="single-form">
                        <label>Loan Duration</label>
                        <div className="select-option mb-10">
                          <select
                            className="nice-select"
                            tabIndex="0"
                            disabled={!loan.type}
                          >
                            <option value="" className="option selected focus">
                              {!loan.type
                                ? "Please select loan type"
                                : "Choose Loan Duration"}
                            </option>
                            {(loan.type == 0 || loan.type == 2) && (
                              <>
                                <option value={3}>3 Months</option>
                                <option value={6}>6 Months</option>
                                <option value={12}>1 Years</option>
                                <option value={24}>2 Years</option>
                                <option value={36}>3 Years</option>
                              </>
                            )}
                            {(loan.type == 3 ||
                              loan.type == 4 ||
                              loan.type == 1) && (
                              <>
                                <option value={36}>3 Years</option>
                                <option value={72}>6 Years</option>
                                <option value={108}>9 Years</option>
                                <option value={144}>12 Years</option>
                                <option value={180}>15 Years</option>
                              </>
                            )}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="apply-wrapper">
                <div className="text-center mb-3">
                  <h1>Collateral</h1>
                </div>
                <form action="#">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="single-form">
                        <label>Collateral</label>
                        <input
                          type="text"
                          name="accountNo"
                          placeholder="Enter Collateral"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="single-form">
                        <label>Collateral Value</label>
                        <input
                          type="text"
                          name="accountNo"
                          placeholder="Enter Collateral Value"
                          onInput={(e) => {
                            e.target.value = e.target.value
                              .replace(/[^0-9]/g, "")
                              .replace(/(\..*)\./g, "$1");
                            setCollateral({
                              ...collteral,
                              value: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      {collteral.image ? (
                        <div>
                          <img
                            src={collteral.image}
                            style={{
                              width: "60px",
                              position: "relative",
                            }}
                          />
                          <span
                            onClick={() => {
                              removeImgHandler(collteral.image);
                              setCollateral({ ...collteral, image: "" });
                            }}
                            className="pl-2 position-absolute top-0 start-0 translate-middle"
                            style={{ cursor: "pointer" }}
                          >
                            <i className="bi bi-x-circle"></i>
                          </span>
                        </div>
                      ) : (
                        <div className="single-form">
                          <label>Collateral Image</label>
                          <input
                            type="file"
                            name="collateralImage"
                            accept="image/*"
                            onChange={async (e) => {
                              const url = await imgUploadHandler(
                                e.target.files[0]
                              );
                              setCollateral({
                                ...collteral,
                                image: `/assets/image/user/${url}`,
                              });
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
              <div className="d-flex justify-content-center">
                <button
                  type="button"
                  className="btn d-flex justify-content-center align-items-center btn-primary p-3 border-0 fw-bold apply-btn mt-30"
                  onClick={submitHandler}
                  disabled={loader}
                >
                  {loader && (
                    <div class="spinner-border me-2" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  )}
                  APPLY NOW{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default loanForm;
