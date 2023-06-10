import dbConnect from "../../../../helper/connection";

export default async (req, res) => {
  const { page, sort, filter } = req.body;
  try {
    let querry = {};

    if (filter.name.trim() && filter.name !== "") {
      querry.$or = [
        { firstName: { $regex: `(?i)${filter.name}` } },
        { lastName: { $regex: `(?i)${filter.name}` } },
      ];
    }

    if (filter.accountType) {
      querry.accountType = filter.accountType;
    }

    if (filter.createdAt.length > 0) {
      querry.createdAt = {
        $gte: filter.createdAt[0],
        $lte: filter.createdAt[1],
      };
    }

    console.log(querry);

    const mango = {
      selector: {
        docType: "User",
        ...querry,
      },
      skip: page * 10,
      sort: [sort],
      limit: 10,
    };
    const userData = (await dbConnect().mango("bank-management", mango)).data
      .docs;

    const countData = (
      await dbConnect().mango("bank-management", {
        selector: {
          docType: "User",
        },
        fields: ["email"],
      })
    ).data.docs;

    res.status(200).json({
      status: true,
      message: "success",
      data: {
        userData,
        count: countData.length,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
