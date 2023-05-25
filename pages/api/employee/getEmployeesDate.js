import dbConnect from "../../../helper/connection";

export default async (req, res) => {
  const { body } = req;
  try {
    const mango = {
      selector: {
        $and: [{ bankId: body }, { docType: "Employee" }],
      },
    };
    const data = (await dbConnect().mango("bank-management", mango)).data.docs;

    res.status(200).json({ status: true, message: "success", data: data });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
