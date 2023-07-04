import {
  checkEmail,
  checkName,
  enc,
  generateIFSC,
  getLevelData,
  keyStore,
} from "../../../../helper/common";
import dbConnect from "../../../../helper/connection";
import { generate } from "generate-password";
import speakeasy from "speakeasy";

export default async (req, res) => {
  const {
    body: { bankDetail, address, time, employee },
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

    //!Employee
    let validationEmployee = [];
    Object.keys(employee).map((eachData) => {
      if (
        !employee[eachData] ||
        employee[eachData] == "" ||
        employee[eachData] == undefined
      ) {
        validationEmployee.push(`Please Enter ${eachData}`);
      }
    });

    let textCheck = [];
    ["name", "department", "education"].map((item) => {
      if (!checkName(employee[item])) {
        textCheck.push(`Please enter valid ${item}`);
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
    } else if (validationBankdetail.length > 0) {
      return res
        .status(422)
        .json({ status: false, message: validationBankdetail[0] });
    } else if (validationEmployee.length > 0) {
      return res
        .status(422)
        .json({ status: false, message: validationEmployee[0] });
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
    } else if (!checkName(bankDetail.name)) {
      return res.status(422).json({
        status: false,
        message: "Please enter valid bank name",
      });
    } else if (employee.contact.length !== 10) {
      return res.status(422).json({
        status: false,
        message: "Please enter valid contact no.",
      });
    } else if (!checkEmail(employee.email)) {
      return res.status(422).json({
        status: false,
        message: "Please enter valid email",
      });
    } else if (textCheck.length > 0) {
      return res.status(422).json({
        status: false,
        message: textCheck[0],
      });
    }

    const mangoParent = {
      selector: getLevelData(
        {
          address,
          level: bankDetail.level == 1 ? 1 : bankDetail.level - 1,
        },
        true
      ),
      fields: ["_id"],
    };

    const parentData = (await dbConnect().mango("bank-management", mangoParent))
      .data.docs;

    if (parentData.length == 0) {
      return res
        .status(422)
        .json({ status: false, message: "Please enter address fields" });
    }

    const bankCreat = await dbConnect().insert("bank-management", {
      ...bankDetail,
      address,
      time,
      ifscCode: generateIFSC(bankDetail.name),
      timeStamp: Math.floor(Date.now() / 1000),
      funds: 0,
      docType: "Bank",
      status: 0,
      parentalId: parentData[0]._id,
    });

    const password = generate({
      length: 12,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    });

    const tem_secret = speakeasy.generateSecret({
      name: "2faName",
    });

    await dbConnect().insert("bank-management", {
      ...employee,
      bankId: bankCreat.data.id,
      secretKey: tem_secret.base32,
      password: enc(password, keyStore("empPsw")),
      employeeType: 1,
      docType: "Employee",
    });

    res.status(200).json({ status: true, message: "success" });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
