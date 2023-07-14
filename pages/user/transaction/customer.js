import React, { useState } from "react";
import { toast } from "react-toastify";

const customer = () => {
  const [payment, setPayment] = useState({
    accountNo: "",
    description: "",
    amount: "",
  });

  const [loader, setloader] = useState(false);

  const submitHandler = async () => {
    if (!payment.accountNo || !payment.accountNo.trim()) {
      return toast.error("Please enter bank account no.");
    } else if (!payment.amount || !payment.amount.trim()) {
      return toast.error("Please enter amount");
    } else if (payment.amount > 50000) {
      return toast.error("Amount should be less than 50000");
    }

    if (!loader) {
      setloader(true);
      const res = await fetch(
        `${process.env.apiUrl}/user/payment/customerAndCustomer`,
        {
          method: "POST",
          body: JSON.stringify(payment),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      setloader(false);

      if (data.status) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    }
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
      <div className="apply-area py-80">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-9">
              <div className="apply-wrapper">
                <form action="#">
                  <div className="row">
                    <div className="col-lg-12 mb-3">
                      <label>Bank Account No</label>
                      <input
                        type="text"
                        name="accountNo"
                        className="form-control"
                        placeholder="Enter Bank Account No."
                        onChange={(e) =>
                          setPayment({
                            ...payment,
                            accountNo: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-lg-12 mb-3">
                      <label>Amount</label>
                      <input
                        type="number"
                        name="amount"
                        className="form-control"
                        placeholder="Enter Amount"
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/[^0-9]/g, "")
                            .replace(/(\..*)\./g, "$1");
                          setPayment({ ...payment, amount: e.target.value });
                        }}
                      />
                    </div>
                    <div className="col-lg-12 mb-3">
                      <label>Description</label>
                      <textarea
                        className="form-control"
                        cols="15"
                        rows="4"
                        name="description"
                        placeholder="Enter Decription"
                        onChange={(e) =>
                          setPayment({
                            ...payment,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </form>
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
      </div>
    </>
  );
};

export default customer;
