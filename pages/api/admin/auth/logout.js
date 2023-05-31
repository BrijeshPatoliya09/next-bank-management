import { withSessionRoute } from "../../../../helper/session";

export default withSessionRoute((req, res) => {
  try {
    req.session.destroy();
    res.status(200).json({ status: true, message: "session destroyed" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
});
