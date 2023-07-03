import React, { useState } from "react";
import Tree from "../tree/Tree";
import { Autocomplete, TextField } from "@mui/material";

const BankTree = ({ data, setActiveEmployeeData, activeEmployee, select }) => {
  const [bankSelect, setBankSelect] = useState(null);
  return (
    <>
      <div className="col-12" style={{ height: "95%" }}>
        <div className="card my-4" style={{ height: "95%" }}>
          <div className="pb-2 mb-3">
            <div className="pt-3 px-3 sub-head d-flex align-items-center">
              <h3>Bank Tree</h3>
              <div className="col-lg-3 rounded-3 bg-white ms-auto me-3">
                <Autocomplete
                  className="w-100"
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setBankSelect(newValue);
                    } else {
                      setBankSelect(null);
                    }
                  }}
                  value={bankSelect}
                  options={select.map((item) => {
                    let addName = "";
                    if (item.level == 1 || item.level == 2) {
                      addName = item.address.country;
                    } else if (item.level == 3) {
                      addName = item.address.state;
                    } else if (item.level == 4) {
                      addName = item.address.city;
                    } else {
                      addName = item.address.zone;
                    }

                    return {
                      label: `${item.name} - ${addName}`,
                      value: item._id,
                    };
                  })}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Bank" />
                  )}
                />
              </div>
            </div>
            <hr />
            <div
              className="d-flex flex-wrap px-3 w-100"
              style={{ height: "330px", overflowY: "scroll" }}
            >
              {data.map((item) => (
                <Tree
                  key={item._id}
                  treeData={item}
                  onSetActiveEmp={setActiveEmployeeData}
                  empId={activeEmployee}
                  select={
                    bankSelect
                      ? select.filter((item) => item._id == bankSelect.value)
                      : []
                  }
                  selectCheck={bankSelect ? true : false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* <div className="row mb-3">
        <div className="col-12">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3">Bank Tree</h6>
              </div>
            </div>
            <div className="card-body px-3 pb-2">
              {data.map((item) => (
                <Tree
                  key={item._id}
                  treeData={item}
                  onSetActiveEmp={setActiveEmployeeData}
                  empId={activeEmployee}
                  select={
                    bankSelect
                      ? select.filter((item) => item._id == bankSelect.value)
                      : []
                  }
                  selectCheck={bankSelect ? true : false}
                />
              ))}
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default BankTree;
