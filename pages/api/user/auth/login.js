import {
  checkEmail,
  checkPassword,
  dec,
  keyStore,
} from "../../../../helper/common";
import dbConnect from "../../../../helper/connection";
import { withSessionRoute } from "../../../../helper/session";

export default withSessionRoute(async (req, res) => {
  const { email, password } = req.body;
  try {
    const mango = {
      selector: {
        docType: "User",
        email,
      },
      fields: ["_id", "password"],
    };

    if (email) {
      if (password) {
        if (checkEmail(email)) {
          if (checkPassword(password)) {
            const userData = (await dbConnect().mango("bank-management", mango))
              .data.docs;
            if (userData && userData.length > 0) {
              if (password == dec(userData[0].password, keyStore("userPsw"))) {
                req.session.user = { userId: userData[0]._id };
                await req.session.save();

                res.status(200).json({ status: true, message: "success" });
              } else {
                res.status(401).json({
                  status: false,
                  message: "email or password doesn't match",
                });
              }
            } else {
              res.status(401).json({
                status: false,
                message: "email or password doesn't match",
              });
            }
          } else {
            res.status(401).json({
              status: false,
              message: "email or password doesn't match",
            });
          }
        } else {
          res.status(401).json({
            status: false,
            message: "Please enter valid email or password",
          });
        }
      } else {
        res
          .status(422)
          .json({ status: false, message: "Please enter password" });
      }
    } else {
      res.status(422).json({ status: false, message: "Please enter email" });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
});
