import { withSessionRoute } from "../../../../helper/session";

export default withSessionRoute(async (req, res) => {
  try {
    const session = req.session;
    delete session.user;
    await session.save();

    res.status(200).json({ status: true, message: "User session destroyed" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
});
