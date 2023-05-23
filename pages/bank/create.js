import React, { useState } from "react";
import Layout from "../../component/Layout";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Country, State, City } from "country-state-city";

const create = () => {
  const [address, setAddress] = useState({
    country: "",
    state: "",
    city: "",
    zone: "",
    zipCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
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
    <Layout>
      <div className="row">
        <div className="col-12">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                <h6 className="text-white text-capitalize ps-3">
                  Bank Address
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
                      onChange={handleChange}
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
                      onChange={handleChange}
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
                      onChange={handleChange}
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
                    id="outlined-basic"
                    label="Zone"
                    variant="outlined"
                  />
                  <TextField
                    className="col-4 p-1"
                    type="number"
                    id="outlined-basic"
                    label="Zip Code"
                    variant="outlined"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
                  <TextField
                    className="col-4 p-1"
                    id="outlined-basic"
                    label="Bank Name"
                    variant="outlined"
                  />
                  <TextField
                    className="col-4 p-1"
                    type="number"
                    id="outlined-basic"
                    label="Level"
                    variant="outlined"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default create;
