import { dec, keyStore } from "../../../../helper/common";
import dbConnect from "../../../../helper/connection";

export default async (req, res) => {
  const { body } = req;
  try {
    const id = decodeURIComponent(body);
    const _id = dec(id, keyStore("idEnc"));

    const data = (
      await dbConnect().mango("bank-management", {
        selector: {
          docType: "Loan",
          _id,
        },
      })
    ).data.docs[0];

    if (!data || data.length == 0) {
      res.status(404).json({
        status: false,
        message: "This loan doesn't exist",
      });
    } else {
      res.status(200).json({ status: true, message: "success", data: data });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
