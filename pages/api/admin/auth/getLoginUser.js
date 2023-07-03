import dbConnect from "../../../../helper/connection";
import { withSessionRoute } from "../../../../helper/session";

export default withSessionRoute(async (req, res) => {
  try { 
    const user = req.session.admin;

    const userData = (
      await dbConnect().mango("bank-management", {
        selector: {
          docType: "Employee",
          _id: user.userId,
        },
        fields: ["name", "email"],
      })
    ).data.docs[0];
    res.status(404).json({ status: true, message: "Success", data: userData });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
});
