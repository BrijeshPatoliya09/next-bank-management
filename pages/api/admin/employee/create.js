// import { getLevelData } from "../../../helper/common";
import { generate } from "generate-password";
import dbConnect from "../../../../helper/connection";
import speakeasy from "speakeasy";
import {
  checkEmail,
  checkName,
  enc,
  keyStore,
} from "../../../../helper/connection";

export default async (req, res) => {
  const {
    body: { employee, bankId },
  } = req;
  try {
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

    if (validationEmployee.length > 0) {
      return res
        .status(422)
        .json({ status: false, message: validationEmployee[0] });
    } else if (employee.contact.length !== 10) {
      return res
        .status(422)
        .json({ status: false, message: "Please enter valid contact no." });
    } else if (!checkEmail(employee.email)) {
      return res
        .status(422)
        .json({ status: false, message: "Please enter valid email" });
    } else if (textCheck.length > 0) {
      return res.status(422).json({ status: false, message: textCheck[0] });
    }

    const tem_secret = speakeasy.generateSecret({
      name: "2faName",
    });

    const password = generate({
      length: 12,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    });

    await dbConnect().insert("bank-management", {
      ...employee,
      bankId,
      secretKey: tem_secret.base32,
      password: enc(password, keyStore("empPsw")),
      employeeType: 0,
      docType: "Employee",
    });

    res.status(200).json({ status: true, message: "success" });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
