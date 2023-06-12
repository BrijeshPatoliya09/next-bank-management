import dbConnect from "../../../../helper/connection";
import { v4 as uuidv4 } from "uuid";
import { generate } from "generate-password";
import { enc, keyStore } from "../../../../helper/common";

export default async (req, res) => {
  const {
    body: { status, userId, revId },
  } = req;
  try {
    const data = (
      await dbConnect().mango("bank-management", {
        selector: {
          _id: userId,
        },
      })
    ).data.docs[0];

    let accNum = {};
    if (status == 1) {
      accNum.accountNumber = uuidv4().split("-").join("");
    }

    await dbConnect().update("bank-management", {
      _id: userId,
      _rev: revId,
      ...data,
      balance: 0,
      accountStatus: status,
      password: enc(
        generate({
          length: 12,
          uppercase: true,
          lowercase: true,
          numbers: true,
          symbols: true,
          strict: true,
        }) + "@",
        keyStore("userPsw")
      ),
      ...accNum,
    });

    res.status(200).json({ status: true, message: "success" });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
