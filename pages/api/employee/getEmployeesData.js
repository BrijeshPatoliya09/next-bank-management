import dbConnect from "../../../helper/connection";

export default async (req, res) => {
  const { activeEmployee, page, sort } = req.body;
  try {
    const skipData = page * 8;

    const mango = {
      selector: {
        $and: [{ bankId: activeEmployee }, { docType: "Employee" }],
      },
      skip: skipData,
      sort: [sort],
      limit: 8,
    };
    const empData = (await dbConnect().mango("bank-management", mango)).data
      .docs;

    const bankData = (
      await dbConnect().mango("bank-management", {
        selector: {
          $and: [{ _id: activeEmployee }, { docType: "Bank" }],
        },
      })
    ).data.docs;

    const countData = (
      await dbConnect().mango("bank-management", {
        selector: {
          $and: [{ bankId: activeEmployee }, { docType: "Employee" }],
        },
      })
    ).data.docs;

    res.status(200).json({
      status: true,
      message: "success",
      data: { empData, bankData, count: countData.length },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
