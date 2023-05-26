import React, { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Country, State, City } from "country-state-city";
import { SingleInputTimeRangeField } from "@mui/x-date-pickers-pro";
import { LocalizationProvider } from "@mui/x-date-pickers";
// import { ToastContainer, toast } from "react-toastify";
import dayjs from "dayjs";

const BankShowEdit = ({ bankData }) => {
  const [address, setAddress] = useState({
    country: bankData.address.country,
    state: bankData.address.state,
    city: bankData.address.city,
    zone: bankData.address.zone,
    zipCode: bankData.address.zipCode,
  });

  const [bankDetail, setBankDetail] = useState({
    name: bankData.name,
  });
  const [bankTime, setBankTime] = useState({
    first: [
      dayjs(new Date(bankData.time.first[0] * 1000)),
      dayjs(new Date(bankData.time.first[1] * 1000)),
    ],
    second: [
      dayjs(new Date(bankData.time.second[0] * 1000)),
      dayjs(new Date(bankData.time.second[1] * 1000)),
    ],
  });

  const handleAdressChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const handleBankdetailChange = (e) => {
    const { name, value } = e.target;
    setBankDetail({ ...bankDetail, [name]: value });
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
      <div className="row">
        <div className="col-12">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                <h6 className="text-white text-capitalize ps-3">
                  Bank Details
                </h6>
              </div>
            </div>
            <div className="card-body px-3 pb-2">
              <div className="d-flex flex-wrap">
                <div className="w-100">
                  <FormControl className="col-4 p-1">
                    <InputLabel id="demo-simple-select-label">
                      Select Country
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      name="country"
                      value={address.country}
                      label="Select Country"
                      onChange={handleAdressChange}
                    >
                      {Country.getAllCountries().map((country, i) => (
                        <MenuItem value={country.name} key={i}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl className="col-4 p-1">
                    <InputLabel id="demo-simple-select-label">
                      Select State
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      name="state"
                      value={address.state}
                      label="Select State"
                      onChange={handleAdressChange}
                      disabled={!address.country}
                    >
                      {State.getStatesOfCountry(
                        getIsoCode(address.country, "country") || ""
                      ).map((state, i) => (
                        <MenuItem value={state.name} key={i}>
                          {state.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl className="col-4 p-1">
                    <InputLabel id="demo-simple-select-label">
                      Select State
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      name="city"
                      value={address.city}
                      label="Select City"
                      onChange={handleAdressChange}
                      disabled={!address.country || !address.state}
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
                  </FormControl>
                </div>
                <div className="w-100 mt-3">
                  <TextField
                    className="col-4 p-1"
                    name="zone"
                    value={address.zone}
                    label="Zone"
                    variant="outlined"
                    onChange={handleAdressChange}
                  />
                  <TextField
                    className="col-4 p-1"
                    type="number"
                    name="zipCode"
                    value={address.zipCode}
                    label="Zip Code"
                    variant="outlined"
                    onChange={handleAdressChange}
                  />
                  <TextField
                    className="col-4 p-1"
                    name="name"
                    value={bankDetail.name}
                    label="Bank Name"
                    variant="outlined"
                    onChange={handleBankdetailChange}
                  />
                </div>
                <div className="w-100 mt-3">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <SingleInputTimeRangeField
                      className="col-4 p-1"
                      label="First Shift"
                      value={bankTime.first}
                      onChange={(e) => {
                        const firstDate = Math.floor(e[0]?.$d.getTime() / 1000);
                        const secondDate = Math.floor(
                          e[1]?.$d.getTime() / 1000
                        );
                        setBankTime({
                          ...bankTime,
                          first: [firstDate, secondDate],
                        });
                      }}
                    />
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <SingleInputTimeRangeField
                      className="col-4 p-1"
                      label="Second Shift"
                      value={bankTime.second}
                      onChange={(e) => {
                        const firstDate = Math.floor(e[0]?.$d.getTime() / 1000);
                        const secondDate = Math.floor(
                          e[1]?.$d.getTime() / 1000
                        );
                        setBankTime({
                          ...bankTime,
                          second: [firstDate, secondDate],
                        });
                      }}
                    />
                  </LocalizationProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BankShowEdit;
