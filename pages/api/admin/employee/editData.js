import { checkEmail, checkName, getLevelData } from "../../../../helper/common";
import dbConnect from "../../../../helper/connection";

export default async (req, res) => {
  const {
    body: { employee, employeeRev, employeeId },
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

    const data = (
      await dbConnect().mango("bank-management", {
        selector: {
          $and: [{ docType: "Employee" }, { _id: employeeId }],
        },
      })
    ).data.docs[0];

    await dbConnect().update("bank-management", {
      _id: employeeId,
      _rev: employeeRev,
      ...data,
      ...employee,
    });

    res.status(200).json({ status: true, message: "success" });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
