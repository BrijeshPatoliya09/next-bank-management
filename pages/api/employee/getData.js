import dbConnect from "../../../helper/connection";

export default async (req, res) => {
  const { userId } = req.body;
  try {
    const mango = {
      selector: {
        _id: userId,
      },
    };
    const data = await dbConnect().mango("bank-management", mango);

    const bankInfo = (
      await dbConnect().mango("bank-management", {
        selector: {
          _id: data.data.docs[0].bankId,
        },
      })
    ).data.docs;

    const newData = [...data.data.docs].map((item) => {
      delete item.bankId;
      return {
        ...item,
        bankInfo,
      };
    });

    console.log(newData);

    res.status(200).json({ status: true, message: "success", data: newData });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
