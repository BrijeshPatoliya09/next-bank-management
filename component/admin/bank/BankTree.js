import React, { useState } from "react";
import Tree from "../tree/Tree";
import { Autocomplete, TextField } from "@mui/material";

const BankTree = ({ data, setActiveEmployeeData, activeEmployee, select }) => {
  const [bankSelect, setBankSelect] = useState("");
  return (
    <>
      <div className="row mb-3">
        <div className="col-12">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3">Bank Tree</h6>
                <div className="p-3 col-lg-3 rounded-3 bg-white me-3">
                  <Autocomplete
                    value={bankSelect}
                    className="w-100"
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setBankSelect(newValue);
                      } else {
                        setBankSelect("");
                      }
                    }}
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
            </div>
            <div className="card-body px-3 pb-2">
              {data.map((item) => (
                <Tree
                  key={item._id}
                  treeData={item}
                  onSetActiveEmp={setActiveEmployeeData}
                  empId={activeEmployee}
                  select={select.filter((item) => item._id == bankSelect.value)}
                  selectCheck={bankSelect ? true : false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BankTree;
