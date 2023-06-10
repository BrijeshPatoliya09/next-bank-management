import { withSessionRoute } from "../../../../helper/session";
import dbConnect from "../../../../helper/connection";
import speakeasy from "speakeasy";

export default withSessionRoute(async (req, res) => {
  const { email, otp } = req.body;
  try {
    const mango = {
      selector: {
        $and: [{ docType: "Employee" }, { email }],
      },
      fields: ["_id", "secretKey"],
    };

    if (otp) {
      const userData = (await dbConnect().mango("bank-management", mango)).data
        .docs;
      const verify = await speakeasy.totp.verify({
        secret: userData[0].secretKey,
        encoding: "base32",
        token: otp,
      });

      if (verify) {
        req.session.admin = { userId: userData[0]._id };
        await req.session.save();

        res
          .status(200)
          .json({ status: true, message: "Verified otp successfully" });
      } else {
        res.status(422).json({ status: false, message: "Invalid OTP" });
      }
    } else {
      res.status(422).json({ status: false, message: "Please enter OTP" });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
});
