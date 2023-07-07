import dbConnect from "../../../../helper/connection";

export default async (req, res) => {
  const { activeEmployee, page, sort, filter } = req.body;
  try {
    const skipData = page * 8;

    let querry = {};

    if (filter.name && filter.name !== "") {
      querry.name = {
        $regex: `(?i)${filter.name}`,
      };
    }

    if (filter.department) {
      querry.department = filter.department;
    }

    if (filter.joinningDate.length > 0) {
      querry.joinningDate = {
        $gte: filter.joinningDate[0],
        $lte: filter.joinningDate[1],
      };
    }

    const mango = {
      selector: {
        bankId: activeEmployee,
        docType: "Employee",
        ...querry,
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
          _id: activeEmployee,
          docType: "Bank",
        },
      })
    ).data.docs;

    const countData = (
      await dbConnect().mango("bank-management", {
        selector: {
          bankId: activeEmployee,
          docType: "Employee",
        },
        fields: ["department"],
      })
    ).data.docs;

    res.status(200).json({
      status: true,
      message: "success",
      data: {
        empData,
        bankData,
        count: countData.length,
        departmentSelect: countData,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
