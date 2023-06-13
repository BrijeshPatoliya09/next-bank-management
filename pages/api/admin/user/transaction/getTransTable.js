import dbConnect from "../../../../../helper/connection";

export default async (req, res) => {
  const { page, sort } = req.body;
  try {
    const mango = {
      selector: {
        docType: { $or: ["Credit", "Debit"] },
        // type: { $or: ["c2b", "b2c"] },
      },
      skip: page * 10,
      sort: [sort],
      limit: 10,
    };
    const transactionData = (await dbConnect().mango("bank-management", mango))
      .data.docs;

    const user = transactionData.reduce(
      (item, data) => [...item, data.fromId, data.userId],
      []
    );

    const userData = (
      await dbConnect().mango("bank-management", {
        selector: {
          docType: "User",
          _id: { $or: user },
        },
        fields: ["_id", "firstName", "lastName", "accountNumber"],
      })
    ).data.docs;

    const fetchCountData = async (bookmark = null, docs = []) => {
      const { data } = await dbConnect().mango("bank-management", {
        selector: {
          docType: { $or: ["Credit", "Debit"] },
          // type: { $or: ["c2b", "b2c"] },
        },
        fields: ["createdAt"],
        bookmark,
      });

      docs = docs.concat(data.docs);

      if (data.bookmark && data.docs.length > 0) {
        return fetchCountData(data.bookmark, docs);
      } else {
        return docs;
      }
    };

    res.status(200).json({
      status: true,
      message: "success",
      data: {
        userData: transactionData.map((item, i) => ({
          ...item,
          user:
            userData.filter((filData) => filData._id === item.userId)[0] ||
            "Bank",
          from:
            userData.filter((filData) => filData._id === item.fromId)[0] ||
            "Bank",
        })),
        count: (await fetchCountData()).length,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
