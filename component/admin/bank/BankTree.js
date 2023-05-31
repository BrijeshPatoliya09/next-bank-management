import React, { useState } from "react";
import Tree from "../tree/Tree";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

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
                  <FormControl className="w-100">
                    <InputLabel id="demo-simple-select-label">
                      Select Department
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      name="department"
                      label="Select Department"
                      onChange={(e) => setBankSelect(e.target.value)}
                    >
                      {select.map((item, i) => {
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
                        return (
                          <MenuItem key={i} value={item._id}>
                            {item.name} ({addName})
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
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
                  select={select.filter((item) => item._id == bankSelect)}
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
