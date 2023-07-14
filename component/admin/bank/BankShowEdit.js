import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Autocomplete, TextField } from "@mui/material";
import {} from "@mui/material";
import { Country, State, City } from "country-state-city";
import { SingleInputTimeRangeField } from "@mui/x-date-pickers-pro";
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { checkName, getTreeData } from "../../../helper/common";
import { toast } from "react-toastify";

const BankShowEdit = ({ bankData, empType, empBankData, onSetTree }) => {
  const router = useRouter();
  const [address, setAddress] = useState({
    country: "",
    state: "",
    city: "",
    zone: "",
    zipCode: "",
  });
  const [bankDetail, setBankDetail] = useState({
    name: "",
  });
  const [bankTime, setBankTime] = useState({
    first: [],
    second: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [cancelEdit, setCancelEdit] = useState(false);

  const [loader, setLoader] = useState(false);

  const getHumanTime = (field) => {
    const temp = [
      Math.floor(bankTime[field][0]?.$d.getTime() / 1000),
      Math.floor(bankTime[field][1]?.$d.getTime() / 1000),
    ];

    return temp;
  };

  useEffect(() => {
    setAddress({
      country: bankData.address.country,
      state: bankData.address.state,
      city: bankData.address.city,
      zone: bankData.address.zone,
      zipCode: bankData.address.zipCode,
    });

    setBankDetail({
      name: bankData.name,
    });

    setBankTime({
      first: [
        dayjs(new Date(bankData.time.first[0] * 1000)),
        dayjs(new Date(bankData.time.first[1] * 1000)),
      ],
      second: [
        dayjs(new Date(bankData.time.second[0] * 1000)),
        dayjs(new Date(bankData.time.second[1] * 1000)),
      ],
    });
  }, [bankData, cancelEdit]);

  const handleAdressChange = (e) => {
    if (editMode) {
      const { name, value } = e.target;
      setAddress({ ...address, [name]: value });
    }
  };

  const editDataHandler = async () => {
    const time = {
      first: getHumanTime("first"),
      second: getHumanTime("second"),
    };

    //!Address
    let validationAddress = [];
    Object.keys(address).map((eachData) => {
      if (
        !address[eachData] ||
        address[eachData] == "" ||
        address[eachData] == undefined
      ) {
        validationAddress.push(`Please Enter ${eachData}`);
      }
    });

    //!Bankdetail
    let validationBankdetail = [];
    Object.keys(bankDetail).map((eachData) => {
      if (
        !bankDetail[eachData] ||
        bankDetail[eachData] == "" ||
        bankDetail[eachData] == undefined
      ) {
        if (eachData == "name") {
          validationBankdetail.push(`Please Enter bank ${eachData}`);
        }
        validationBankdetail.push(`Please Enter ${eachData}`);
      }
    });

    if (validationAddress.length > 0) {
      return toast.error(validationAddress[0]);
    } else if (!time.first[0] || !time.first[1]) {
      return toast.error("Please enter first shift");
    } else if (!time.second[0] || !time.second[1]) {
      return toast.error("Please enter second shift");
    } else if (
      time.first[1] == time.first[0] ||
      time.first[1] < time.first[0]
    ) {
      return toast.error("Please enter valid time in first shift");
    } else if (
      time.second[1] == time.second[0] ||
      time.second[1] < time.second[0]
    ) {
      return toast.error("Please enter valid time in second shift");
    } else if (
      time.first[1] == time.second[0] ||
      time.first[1] > time.second[0]
    ) {
      return toast.error("Please enter valid time");
    } else if (validationBankdetail.length > 0) {
      return toast.error(validationBankdetail[0]);
    } else if (!checkName(bankDetail.name)) {
      return toast.error("Please enter valid bank name");
    }

    if (!loader) {
      setLoader(true);
      const res = await fetch(`${process.env.apiUrl}/admin/bank/editData`, {
        method: "PUT",
        body: JSON.stringify({
          bankId: bankData._id,
          bankRev: bankData._rev,
          bankDetail,
          address,
          time,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setLoader(false);

      if (data.status) {
        toast.success(data.message);
        const tree = await getTreeData(empBankData.address, empBankData.level);
        onSetTree(tree.data.newData);
      } else {
        toast.error(data.message);
      }
    }
  };

  const handleBankdetailChange = (e) => {
    if (editMode) {
      const { name, value } = e.target;
      setBankDetail({ ...bankDetail, [name]: value });
    }
  };

  const getIsoCode = (name, type, country) => {
    if (type == "country") {
      const countryIso = Country.getAllCountries().filter(
        (val) => val.name === name
      );
      return countryIso[0]?.isoCode;
    } else {
      const code = getIsoCode(country, "country");
      const stateIso = State?.getStatesOfCountry(code).filter(
        (val) => val.name === name
      );
      return stateIso[0]?.isoCode;
    }
  };

  return (
    <>
      <div className="col-12" style={{ height: "95%" }}>
        <div className={`card ${!empType && "my-4"}`} style={{ height: "95%" }}>
          <div className="pb-2 mb-3">
            <div className="pt-3 px-3  sub-head">
              <h3>Bank Details</h3>
            </div>
            <hr />
            <div className="d-flex flex-wrap px-3">
              <Autocomplete
                className={`${
                  empType ? "col-lg-4 col-md-6" : "col-lg-6"
                } col-12 p-1 mt-2`}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setAddress({ ...address, country: newValue.value });
                  } else {
                    setAddress({ ...address, country: "" });
                  }
                }}
                value={
                  address.country
                    ? { value: address.country, label: address.country }
                    : null
                }
                options={Country.getAllCountries().map((country, i) => ({
                  label: country.name,
                  value: country.name,
                }))}
                disabled={!editMode}
                renderInput={(params) => (
                  <TextField {...params} label="Select Country" />
                )}
              />
              <Autocomplete
                className={`${
                  empType ? "col-lg-4 col-md-6" : "col-lg-6"
                } col-12 p-1 mt-2`}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setAddress({ ...address, state: newValue.value });
                  } else {
                    setAddress({ ...address, state: "" });
                  }
                }}
                value={
                  address.state
                    ? { value: address.state, label: address.state }
                    : null
                }
                options={State.getStatesOfCountry(
                  getIsoCode(address.country, "country") || ""
                ).map((state, i) => ({
                  label: state.name,
                  value: state.name,
                }))}
                disabled={!address.country || !editMode}
                renderInput={(params) => (
                  <TextField {...params} label="Select State" />
                )}
              />
              <Autocomplete
                className={`${
                  empType ? "col-lg-4 col-md-6" : "col-lg-6"
                } col-12 p-1 mt-2`}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setAddress({ ...address, city: newValue.value });
                  } else {
                    setAddress({ ...address, city: "" });
                  }
                }}
                value={
                  address.city
                    ? { value: address.city, label: address.city }
                    : null
                }
                options={City.getCitiesOfState(
                  getIsoCode(address.country, "country") || "",
                  getIsoCode(address.state, "state", address.country)
                ).map((city, i) => ({
                  label: city.name,
                  value: city.name,
                }))}
                disabled={!address.country || !address.state || !editMode}
                renderInput={(params) => (
                  <TextField {...params} label="Select City" />
                )}
              />
              {/* <FormControl className={`${empType ? "col-lg-4 col-md-6" : "col-lg-6"} col-lg-6 col-12 p-1 mt-2`}>
                <InputLabel id="demo-simple-select-label">
                  Select City
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  name="city"
                  value={address.city}
                  label="Select City"
                  onChange={handleAdressChange}
                  disabled={!address.country || !address.state || !editMode}
                >
                  {City.getCitiesOfState(
                    getIsoCode(address.country, "country") || "",
                    getIsoCode(address.state, "state", address.country)
                  ).map((city, i) => (
                    <MenuItem value={city.name} key={i}>
                      {city.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}
              <TextField
                className={`${
                  empType ? "col-lg-4 col-md-6" : "col-lg-6"
                } col-12 p-1 mt-2`}
                name="zone"
                value={address.zone}
                label="Zone"
                variant="outlined"
                onChange={handleAdressChange}
                disabled={!editMode}
              />
              <TextField
                className={`${
                  empType ? "col-lg-4 col-md-6" : "col-lg-6"
                } col-12 p-1 mt-2`}
                type="number"
                name="zipCode"
                value={address.zipCode}
                label="Zip Code"
                variant="outlined"
                onChange={handleAdressChange}
                disabled={!editMode}
              />
              <TextField
                className={`${
                  empType ? "col-lg-4 col-md-6" : "col-lg-6"
                } col-12 p-1 mt-2`}
                name="name"
                value={bankDetail.name}
                label="Bank Name"
                variant="outlined"
                onChange={handleBankdetailChange}
                disabled={!editMode}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <SingleInputTimeRangeField
                  className={`${
                    empType ? "col-lg-4 col-md-6" : "col-lg-6"
                  } col-12 p-1 mt-2`}
                  label="First Shift"
                  value={bankTime.first}
                  onChange={(e) => {
                    if (editMode) {
                      setBankTime({
                        ...bankTime,
                        first: [e[0], e[1]],
                      });
                    }
                  }}
                  disabled={!editMode}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <SingleInputTimeRangeField
                  className={`${
                    empType ? "col-lg-4 col-md-6" : "col-lg-6"
                  } col-12 p-1 mt-2`}
                  label="Second Shift"
                  value={bankTime.second}
                  onChange={(e) => {
                    if (editMode) {
                      setBankTime({
                        ...bankTime,
                        second: [e[0], e[1]],
                      });
                    }
                  }}
                  disabled={!editMode}
                />
              </LocalizationProvider>
            </div>
            <div className="w-100 mt-3 mb-2 d-flex justify-content-center">
              {!editMode && empType && (
                <>
                  <div className="ms-4">
                    <button
                      type="button"
                      className="btn btn-bank"
                      style={{ fontSize: "14px" }}
                      onClick={() => setEditMode(true)}
                    >
                      Edit Bank Details
                    </button>
                  </div>
                </>
              )}
              {editMode && (
                <>
                  <div>
                    <button
                      type="button"
                      className="btn btn-bank d-flex justify-content-center align-items-center"
                      style={{ fontSize: "14px" }}
                      onClick={editDataHandler}
                      disabled={loader}
                    >
                      {loader && (
                        <div class="spinner-border me-2" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                      )}
                      Edit
                    </button>
                  </div>
                  <div className="ms-4">
                    <button
                      type="button"
                      className="btn btn-bank"
                      style={{ fontSize: "14px" }}
                      onClick={() => {
                        setEditMode(false);
                        setCancelEdit(!cancelEdit);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BankShowEdit;
