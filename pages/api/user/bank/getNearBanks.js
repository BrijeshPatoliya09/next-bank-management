import dbConnect from "../../../../helper/connection";

export default async (req, res) => {
  const {
    body: { country, state, city },
  } = req;
  try {
    const mango = {
      selector: {
        docType: "Bank",
        address: { city, country, state },
        level: 5,
      },
      fields: ["ifscCode", "name", "address"],
    };

    const data = (await dbConnect().mango("bank-management", mango)).data.docs;

    res.status(200).json({ status: true, message: "success", data });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
