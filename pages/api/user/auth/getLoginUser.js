import { withSessionRoute } from "../../../../helper/session";

export default withSessionRoute(async (req, res) => {
  try {
    const user = req.session.user;
    res.status(404).json({ status: true, message: "Success", data: user });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
});
