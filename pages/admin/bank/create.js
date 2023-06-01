import React, { useEffect, useState } from "react";
import AdminLayout from "../../../component/admin/AdminLayout";
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
import { ToastContainer, toast } from "react-toastify";
import { withSessionSsr } from "../../../helper/session";

const create = ({ empLevel }) => {
  const [address, setAddress] = useState({
    country: "",
    state: "",
    city: "",
    zone: "",
    zipCode: "",
  });

  const [bankDetail, setBankDetail] = useState({
    name: "",
    level: "",
  });
  const [bankTime, setBankTime] = useState({
    first: [],
    second: [],
  });
  const [loader, setLoader] = useState(false);

  const handleAdressChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const handleBankdetailChange = (e) => {
    const { name, value } = e.target;
    setBankDetail({ ...bankDetail, [name]: value });
  };

  const createHandler = async () => {
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
    } else if (!bankTime.first[0] || !bankTime.first[1]) {
      return toast.error("Please enter first shift");
    } else if (!bankTime.second[0] || !bankTime.second[1]) {
      return toast.error("Please enter second shift");
    } else if (
      bankTime.first[1] == bankTime.first[0] ||
      bankTime.first[1] < bankTime.first[0]
    ) {
      return toast.error("Please enter valid time in first shift");
    } else if (
      bankTime.second[1] == bankTime.second[0] ||
      bankTime.second[1] < bankTime.second[0]
    ) {
      return toast.error("Please enter valid time in second shift");
    } else if (
      bankTime.first[1] == bankTime.second[0] ||
      bankTime.first[1] > bankTime.second[0]
    ) {
      return toast.error("Please enter valid time");
    } else if (validationBankdetail.length > 0) {
      return toast.error(validationBankdetail[0]);
    }

    if (!loader) {
      setLoader(true);
      const res = await fetch(`${process.env.apiUrl}/admin/bank/create`, {
        method: "POST",
        body: JSON.stringify({
          bankDetail,
          address,
          time: { ...bankTime },
          timeStamp: Math.floor(Date.now() / 1000),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setLoader(false);

      if (data.status) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
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
                <FormControl className="col-lg-4 col-sm-6 col-12 p-1 mt-2">
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
                <FormControl className="col-lg-4 col-sm-6 col-12 p-1 mt-2">
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
                <FormControl className="col-lg-4 col-sm-6 col-12 p-1 mt-2">
                  <InputLabel id="demo-simple-select-label">
                    Select City
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
                <TextField
                  className="col-lg-4 col-sm-6 col-12 p-1 mt-2"
                  name="zone"
                  label="Zone"
                  variant="outlined"
                  onChange={handleAdressChange}
                />
                <TextField
                  className="col-lg-4 col-sm-6 col-12 p-1 mt-2"
                  type="number"
                  name="zipCode"
                  label="Zip Code"
                  variant="outlined"
                  onChange={handleAdressChange}
                />
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
                <h6 className="text-white text-capitalize ps-3">Bank Timing</h6>
              </div>
            </div>
            <div className="card-body px-3 pb-2">
              <div className="d-flex flex-wrap">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <SingleInputTimeRangeField
                    className="col-sm-6 col-12 p-1"
                    label="First Shift"
                    onChange={(e) => {
                      const firstDate = Math.floor(e[0]?.$d.getTime() / 1000);
                      const secondDate = Math.floor(e[1]?.$d.getTime() / 1000);
                      setBankTime({
                        ...bankTime,
                        first: [firstDate, secondDate],
                      });
                    }}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <SingleInputTimeRangeField
                    className="col-sm-6 col-12 p-1"
                    label="Second Shift"
                    onChange={(e) => {
                      const firstDate = Math.floor(e[0]?.$d.getTime() / 1000);
                      const secondDate = Math.floor(e[1]?.$d.getTime() / 1000);
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
                <TextField
                  className="col-lg-4 col-sm-6 col-12 p-1 mt-2"
                  name="name"
                  value={bankDetail.name}
                  label="Bank Name"
                  variant="outlined"
                  onChange={handleBankdetailChange}
                />
                <FormControl className="col-lg-4 col-sm-6 col-12 p-1 mt-2">
                  <InputLabel id="demo-simple-select-label">
                    Select Level
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    name="level"
                    value={bankDetail.level}
                    label="Select Level"
                    onChange={handleBankdetailChange}
                  >
                    {empLevel == 1 && <MenuItem value={1}>World Bank</MenuItem>}
                    {empLevel < 2 && (
                      <MenuItem value={2}>National Bank</MenuItem>
                    )}
                    {empLevel < 3 && address.country && (
                      <MenuItem value={3}>State Bank</MenuItem>
                    )}
                    {empLevel < 4 && address.state && (
                      <MenuItem value={4}>City Bank</MenuItem>
                    )}
                    {empLevel < 5 && address.city && (
                      <MenuItem value={5}>Zone Bank</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body d-flex justify-content-center px-3 pb-2">
        <div className="col-4">
          <button
            type="button"
            className="btn d-flex justify-content-center align-items-center bg-gradient-primary w-100 my-4 mb-2 fs-5"
            onClick={createHandler}
            disabled={loader}
          >
            {loader && (
              <div class="spinner-border me-2" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            )}
            Create
          </button>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const user = req.session.user;

  if (user) {
    const empRes = await fetch(`${process.env.apiUrl}/admin/employee/getData`, {
      method: "PUT",
      body: JSON.stringify({ userId: user.userId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const empData = await empRes.json();

    if (empData.data[0].bankInfo[0].level == 5) {
      return {
        redirect: {
          destination: "/admin",
          permanent: false,
        },
      };
    }

    return {
      props: {
        empLevel: empData.data[0].bankInfo[0].level,
      },
    };
  } else {
    return {
      redirect: {
        destination: "admin/auth/login",
        permanent: false,
      },
    };
  }
});

export default create;
