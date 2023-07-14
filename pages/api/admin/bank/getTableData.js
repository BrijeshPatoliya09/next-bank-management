import dbConnect from "../../../../helper/connection";

export default async (req, res) => {
  const { activeEmployee } = req.body;
  try {
    const bankData = (
      await dbConnect().mango("bank-management", {
        selector: {
          _id: activeEmployee,
          docType: "Bank",
        },
      })
    ).data.docs;

    res.status(200).json({
      status: true,
      message: "success",
      data: bankData,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
