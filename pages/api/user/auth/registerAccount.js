import {
  checkEmail,
  checkName,
} from "../../../../helper/common";
import dbConnect from "../../../../helper/connection";

export default async (req, res) => {
  const { body } = req;
  try {
    //!User
    let validationUser = [];
    Object.keys(body).map((eachData) => {
      if (
        !body[eachData] ||
        body[eachData] == "" ||
        body[eachData] == undefined
      ) {
        validationUser.push(`Please enter ${eachData}`);
      }
    });

    let textValid = [];
    ["firstName", "middleName", "lastName", "nomineeName"].map((eachData) => {
      if (!checkName(body[eachData])) {
        textValid.push(`Please enter valid ${eachData}`);
      }
    });

    if (validationUser.length > 0) {
      return res
        .status(422)
        .json({ status: false, message: validationUser[0] });
    } else if (textValid.length > 0) {
      return res.status(422).json({ status: false, message: textValid[0] });
    } else if (!checkEmail(body.email)) {
      return res
        .status(422)
        .json({ status: false, message: "Please enter valid email" });
    } else if (body.contact.length != 10) {
      return res
        .status(422)
        .json({ status: false, message: "Please enter valid contact no." });
    } else if (body.zipCode.length != 6) {
      return res
        .status(422)
        .json({ status: false, message: "Please enter valid pin code" });
    }

    const data = (
      await dbConnect().mango("bank-management", {
        selector: {
          email: body.email,
        },
        fields: ["email"],
      })
    ).data.docs;

    if (data.length == 0) {
      await dbConnect().insert("bank-management", {
        ...body,
        accountReqCode: (Math.random() * 99999999).toFixed(),
        accountStatus: 0,
        createdAt: Math.floor(new Date().getTime() / 1000),
        docType: "User",
      });

      res.status(200).json({ status: true, message: "success" });
    } else {
      res
        .status(404)
        .json({ status: false, message: "User already exist with that email" });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
