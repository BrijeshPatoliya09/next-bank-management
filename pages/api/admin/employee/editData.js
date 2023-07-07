import {
  checkEmail,
  checkName,
  checkPassword,
  dec,
  getLevelData,
  keyStore,
} from "../../../../helper/common";
import dbConnect from "../../../../helper/connection";

export default async (req, res) => {
  const {
    body: {
      employee,
      employeeRev,
      employeeId,
      oldPsw,
      newPsw,
      confPsw,
      change,
    },
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

    if (change == 1) {
      if (!oldPsw || oldPsw.trim() == "") {
        return res
          .status(422)
          .json({ status: false, message: "Please enter old password" });
      } else if (!newPsw || newPsw.trim() == "") {
        return res
          .status(422)
          .json({ status: false, message: "Please enter new password" });
      } else if (!confPsw || confPsw.trim() == "") {
        return res
          .status(422)
          .json({ status: false, message: "Please enter confirm password" });
      } else if (!checkPassword(dec(newPsw, keyStore("empPsw")))) {
        return res
          .status(422)
          .json({ status: false, message: "Please enter valid new password" });
      } else if (newPsw != confPsw) {
        return res.status(422).json({
          status: false,
          message: "New password and Confirm password must be same",
        });
      }
    }

    const data = (
      await dbConnect().mango("bank-management", {
        selector: {
          $and: [{ docType: "Employee" }, { _id: employeeId }],
        },
      })
    ).data.docs[0];

    let query = {};
    if (change == 1) {
      if (data.password != oldPsw) {
        return res.status(422).json({
          status: false,
          message: "Please enter correct old password",
        });
      }
      query.password = newPsw;
    }

    await dbConnect().update("bank-management", {
      _id: employeeId,
      _rev: employeeRev,
      ...data,
      ...query,
      ...employee,
    });

    res.status(200).json({ status: true, message: "success" });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
