import dbConnect from "../../../../helper/connection";
import { dec, keyStore } from "../../../../helper/common";

export default async (req, res) => {
  const {
    body: { status, empId, empRev },
  } = req;
  try {
    const data = (
      await dbConnect().mango("bank-management", {
        selector: {
          _id: dec(empId, keyStore("idEnc")),
        },
      })
    ).data.docs[0];

    await dbConnect().update("bank-management", {
      _id: dec(empId, keyStore("idEnc")),
      _rev: dec(empRev, keyStore("idEnc")),
      ...data,
      status,
    });

    res.status(404).json({ status: true, message: `Employee ${status == 0 ? "Activated" : "Deactivated"} Successfully` });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
