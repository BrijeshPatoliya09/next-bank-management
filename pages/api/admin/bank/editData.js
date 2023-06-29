import { checkName } from "../../../../helper/common";
import dbConnect from "../../../../helper/connection";

export default async (req, res) => {
  const {
    body: { bankDetail, address, time, bankId, bankRev },
  } = req;
  try {
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
      return res
        .status(422)
        .json({ status: false, message: validationAddress[0] });
    } else if (!time.first[0] || !time.first[1]) {
      return res
        .status(422)
        .json({ status: false, message: "Please enter first shift" });
    } else if (!time.second[0] || !time.second[1]) {
      return res
        .status(422)
        .json({ status: false, message: "Please enter second shift" });
    } else if (
      time.first[1] == time.first[0] ||
      time.first[1] < time.first[0]
    ) {
      return res.status(422).json({
        status: false,
        message: "Please enter valid time in first shift",
      });
    } else if (
      time.second[1] == time.second[0] ||
      time.second[1] < time.second[0]
    ) {
      return res.status(422).json({
        status: false,
        message: "Please enter valid time in second shift",
      });
    } else if (
      time.first[1] == time.second[0] ||
      time.first[1] > time.second[0]
    ) {
      return res.status(422).json({
        status: false,
        message: "Please enter valid time",
      });
    } else if (validationBankdetail.length > 0) {
      return res
        .status(422)
        .json({ status: false, message: validationBankdetail[0] });
    } else if (!checkName(bankDetail.name)) {
      return res.status(422).json({
        status: false,
        message: "Please enter valid bank name",
      });
    }

    const data = (
      await dbConnect().mango("bank-management", {
        selector: {
          $and: [{ docType: "Bank" }, { _id: bankId }],
        },
      })
    ).data.docs[0];

    await dbConnect().update("bank-management", {
      _id: bankId,
      _rev: bankRev,
      ...data,
      ...bankDetail,
      address,
      time,
    });

    res.status(200).json({ status: true, message: "success" });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
