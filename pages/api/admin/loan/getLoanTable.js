import dbConnect from "../../../../helper/connection";

export default async (req, res) => {
  const { page, sort, activeEmployee } = req.body;
  try {
    let querry1 = {};
    let querry2 = {};
    if (sort.firstName) {
      querry2.sort = [sort];
    } else {
      querry1.sort = [sort];
    }

    console.log(querry1, querry2);
    const fetchLoanData = async (bookmark = null, docs = []) => {
      const { data } = await dbConnect().mango("bank-management", {
        selector: {
          docType: "Loan",
          ifscCode: activeEmployee,
        },
        bookmark,
        ...querry1,
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
        },
        bookmark,
        ...querry2,
        skip: page * 10,
        limit: 10,
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

    // const getLoanAsUser = (
    //   await dbConnect().mango("bank-management", {
    //     selector: {
    //       docType: "Loan",
    //       ifscCode: activeEmployee,
    //       userAccountNo: {
    //         $in: getUsersData.map((item) => item.accountNumber),
    //       },
    //     },
    //     skip: page * 10,
    //     limit: 10,
    //   })
    // ).data.docs;

    const getLoanAsUser = [];
    for (let i = 0; i < getUsersData.length; i++) {
      const loanData = (
        await dbConnect().mango("bank-management", {
          selector: {
            docType: "Loan",
            ifscCode: activeEmployee,
            userAccountNo: getUsersData[i].accountNumber,
          },
          // skip: page * 10,
          // sort: [sort],
          // limit: 10,
        })
      ).data.docs;

      getLoanAsUser.push(...loanData);
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
    // async function dataSorting(obj) {
    //   const fld = Object.keys(obj)[0];
    //   let finaldata = [];
    //   if (aggregatedData.length > 0) {
    //     if (obj[fld] == 0) {
    //       finaldata = aggregatedData
    //         .sort((a, b) => (a[fld] > b[fld] ? -1 : b[fld] > a[fld] ? 1 : 0))
    //         .slice(page * 10, page * 10 + 10);
    //     } else {
    //       finaldata = aggregatedData
    //         .sort((a, b) => (a[fld] > b[fld] ? 1 : b[fld] > a[fld] ? -1 : 0))
    //         .slice(page * 10, page * 10 + 10);
    //     }
    //   }
    //   return finaldata;
    // }

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
