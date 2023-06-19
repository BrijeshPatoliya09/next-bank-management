import dbConnect from "../../../../helper/connection";

export default async (req, res) => {
  const { page, sort, activeEmployee } = req.body;
  try {
    const fetchCountData = async (bookmark = null, docs = []) => {
      const { data } = await dbConnect().mango("bank-management", {
        selector: {
          docType: "Loan",
          ifscCode: activeEmployee,
        },
        bookmark,
      });

      docs = docs.concat(data.docs);

      if (data.bookmark && data.docs.length > 0) {
        return fetchCountData(data.bookmark, docs);
      } else {
        return docs;
      }
    };

    const getLoansData = await fetchCountData();

    const getUserAccountNo = getLoansData.map((item) => item.userAccountNo);

    const getUsersData = (
      await dbConnect().mango("bank-management", {
        selector: {
          docType: "User",
          bank: activeEmployee,
          accountNumber: { $in: getUserAccountNo },
        },
        fields: ["firstName", "lastName", "accountNumber"],
      })
    ).data.docs;

    const aggregatedData = getLoansData.map((item) => {
      const userData = getUsersData.filter(
        (data) => item.userAccountNo == data.accountNumber
      );
      return {
        ...item,
        userName: userData[0].firstName + " " + userData[0].lastName,
      };
    });

    async function dataSorting(obj) {
      const fld = Object.keys(obj)[0];
      let finaldata = [];
      if (aggregatedData.length > 0) {
        if (obj[fld] == 0) {
          finaldata = aggregatedData
            .sort((a, b) => (a[fld] > b[fld] ? -1 : b[fld] > a[fld] ? 1 : 0))
            .slice(page * 10, page * 10 + 10);
        } else {
          finaldata = aggregatedData
            .sort((a, b) => (a[fld] > b[fld] ? 1 : b[fld] > a[fld] ? -1 : 0))
            .slice(page * 10, page * 10 + 10);
        }
      }
      return finaldata;
    }

    res.status(200).json({
      status: true,
      message: "success",
      data: {
        userData: await dataSorting(sort),
        count: getLoansData.length,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
