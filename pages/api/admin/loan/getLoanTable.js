import dbConnect from "../../../../helper/connection";

export default async (req, res) => {
  const { page, sort, activeEmployee, filter } = req.body;
  try {
    let userQuerry = {};
    if (sort.firstName) {
      userQuerry.skip = page * 10;
      userQuerry.limit = 10;
      userQuerry.sort = [sort];
    }

    let userFilter = {};
    let loanFilter = {};
    if (filter.name) {
      userFilter["$or"] = [
        { firstName: { $regex: `(?i)${filter.name}` } },
        { lastName: { $regex: `(?i)${filter.name}` } },
      ];
    }
    if (filter.type >= 0 && filter.type < 5 && filter.type !== "") {
      loanFilter.type = filter.type;
    }
    if (filter.createdAt.length > 0) {
      loanFilter.createdAt = {
        $gte: filter.createdAt[0],
        $lte: filter.createdAt[1],
      };
    }

    const fetchLoanData = async (bookmark = null, docs = []) => {
      const { data } = await dbConnect().mango("bank-management", {
        selector: {
          docType: "Loan",
          ifscCode: activeEmployee,
          ...loanFilter,
        },
        bookmark,
        fields: ["userAccountNo"],
      });

      docs = docs.concat(data.docs);

      if (data.bookmark && data.docs.length > 0) {
        return fetchLoanData(data.bookmark, docs);
      } else {
        return docs;
      }
    };

    const getLoansData = await fetchLoanData();
    const getUserAccountNo = getLoansData.map((item) => item.userAccountNo);

    const fetchUserData = async (bookmark = null, docs = []) => {
      const { data } = await dbConnect().mango("bank-management", {
        selector: {
          docType: "User",
          bank: activeEmployee,
          accountNumber: { $in: getUserAccountNo },
          ...userFilter,
        },
        bookmark,
        ...userQuerry,
        fields: ["firstName", "lastName", "accountNumber"],
      });

      docs = docs.concat(data.docs);

      if (data.bookmark && data.docs.length > 0) {
        return fetchUserData(data.bookmark, docs);
      } else {
        return docs;
      }
    };

    const getUsersData = await fetchUserData();

    const getLoanAsUser = [];

    if (sort.firstName) {
      for (let i = 0; i < getUsersData.length; i++) {
        const loanData = (
          await dbConnect().mango("bank-management", {
            selector: {
              docType: "Loan",
              ifscCode: activeEmployee,
              userAccountNo: getUsersData[i].accountNumber,
              ...loanFilter,
            },
            fields: [
              "amount",
              "duration",
              "userAccountNo",
              "ifscCode",
              "type",
              "collateralValue",
              "status",
              "createdAt",
              "_id",
              "_rev",
            ],
          })
        ).data.docs;

        getLoanAsUser.push(...loanData);
      }
    } else {
      const data = (
        await dbConnect().mango("bank-management", {
          selector: {
            docType: "Loan",
            ifscCode: activeEmployee,
            userAccountNo: {
              $in: getUsersData.map((item) => item.accountNumber),
            },
            ...loanFilter,
          },
          skip: page * 10,
          limit: 10,
          sort: [sort],
          fields: [
            "amount",
            "duration",
            "userAccountNo",
            "ifscCode",
            "type",
            "collateralValue",
            "status",
            "createdAt",
            "_id",
            "_rev",
          ],
        })
      ).data.docs;
      getLoanAsUser.push(...data);
    }

    const aggregatedData = getLoanAsUser.map((item) => {
      const userData = getUsersData.filter(
        (data) => item.userAccountNo == data.accountNumber
      );
      if (userData.length == 0) {
        return;
      } else {
        return {
          ...item,
          userName: userData[0].firstName + " " + userData[0].lastName,
        };
      }
    });

    res.status(200).json({
      status: true,
      message: "success",
      data: {
        userData: aggregatedData,
        count: getLoansData.length,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
