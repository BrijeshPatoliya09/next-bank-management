import dbConnect from "../../../../helper/connection";

export default async (req, res) => {
  const { page, sort, activeEmployee } = req.body;
  try {
    const fetchLoanData = async (bookmark = null, docs = []) => {
      const { data } = await dbConnect().mango("bank-management", {
        selector: {
          docType: "Loan",
          ifscCode: activeEmployee,
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
        },
        bookmark,
        sort: [sort],
        fields: ["firstName", "lastName", "accountNumber"],
      });

      docs = docs.concat(data.docs);

      if (data.bookmark && data.docs.length > 0) {
        return fetchUserData(data.bookmark, docs);
      } else {
        return docs;
      }
    };

    const userData = await fetchUserData();

    const sortedLoan = [];
    for (let i = 0; i < userData.length; i++) {
      if (sortedLoan.length <= 10) {
        const loanData = (
          await dbConnect().mango("bank-management", {
            selector: {
              docType: "Loan",
              ifscCode: activeEmployee,
              userAccountNo: userData[i].accountNumber,
            },
            skip: page * 10,
            // sort: [sort],
            limit: 10,
          })
        ).data.docs;

        sortedLoan.push(...loanData);
      } else {
        break;
      }
    }

    // const getUsersData = (
    //   await dbConnect().mango("bank-management", {
    //     selector: {
    //       docType: "User",
    //       bank: activeEmployee,
    //       accountNumber: { $in: getUserAccountNo },
    //     },
    //     fields: ["firstName", "lastName", "accountNumber"],
    //   })
    // ).data.docs;

    // const aggregatedData = getLoansData.map((item) => {
    //   const userData = getUsersData.filter(
    //     (data) => item.userAccountNo == data.accountNumber
    //   );
    //   return {
    //     ...item,
    //     userName: userData[0].firstName + " " + userData[0].lastName,
    //   };
    // });

    // async function dataSorting(obj, aggregatedData) {
    //   const fld = Object.keys(obj)[0];
    //   let finaldata = [];
    //   if (aggregatedData.length > 0) {
    //     if (obj[fld] == 0) {
    //       finaldata = aggregatedData.sort((a, b) =>
    //         a[fld] > b[fld] ? -1 : b[fld] > a[fld] ? 1 : 0
    //       );
    //       .slice(page * 10, page * 10 + 10);
    //     } else {
    //       finaldata = aggregatedData.sort((a, b) =>
    //         a[fld] > b[fld] ? 1 : b[fld] > a[fld] ? -1 : 0
    //       );
    //       .slice(page * 10, page * 10 + 10);
    //     }
    //   }
    //   return finaldata;
    // }

    // const sortedUser = (await dataSorting(sort, userData)).map(
    //   (item) => item.accountNumber
    // );

    // const loanData = (
    //   await dbConnect().mango("bank-management", {
    //     selector: {
    //       docType: "Loan",
    //       ifscCode: activeEmployee,
    //       userAccountNo: { $in: sortedUser },
    //     },
    //     skip: page * 10,
    //     // sort: [sort],
    //     limit: 10,
    //   })
    // ).data.docs;

    res.status(200).json({
      status: true,
      message: "success",
      data: {
        userData: userData,
        count: sortedLoan,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
