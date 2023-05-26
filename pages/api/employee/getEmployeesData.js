import dbConnect from "../../../helper/connection";

export default async (req, res) => {
  const { body } = req;
  try {
    const mango = {
      selector: {
        $and: [{ bankId: body }, { docType: "Employee" }],
      },
    };
    const empData = (await dbConnect().mango("bank-management", mango)).data
      .docs;

    const bankData = (
      await dbConnect().mango("bank-management", {
        selector: {
          $and: [{ _id: body }, { docType: "Bank" }],
        },
      })
    ).data.docs;

    res
      .status(200)
      .json({ status: true, message: "success", data: { empData, bankData } });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
