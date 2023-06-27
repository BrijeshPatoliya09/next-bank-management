import dbConnect from "../../../../../helper/connection";

export default async (req, res) => {
  const { page, sort, activeEmployee } = req.body;
  try {
    const fetchAllUserData = async (bookmark = null, docs = []) => {
      const { data } = await dbConnect().mango("bank-management", {
        selector: {
          docType: "User",
          bank: activeEmployee.ifsc,
        },
        fields: ["_id"],
        bookmark,
      });

      docs = docs.concat(data.docs);

      if (data.bookmark && data.docs.length > 0) {
        return fetchAllUserData(data.bookmark, docs);
      } else {
        return docs;
      }
    };
    const getAllUsers = await fetchAllUserData();

    const allUserId = getAllUsers.map((item) => item._id);

    const fetchTransData = async (bookmark = null, docs = []) => {
      const { data } = await dbConnect().mango("bank-management", {
        selector: {
          docType: "Transaction",
          $or: [
            { userId: { $or: [...allUserId, activeEmployee.bankId] } },
            { fromId: { $or: [...allUserId, activeEmployee.bankId] } },
          ],
        },
        bookmark,
      });

      docs = docs.concat(data.docs);

      if (data.bookmark && data.docs.length > 0) {
        return fetchTransData(data.bookmark, docs);
      } else {
        return docs;
      }
    };

    const transactionData = await fetchTransData();

    const user = transactionData.reduce(
      (item, data) => [...item, data.fromId, data.userId],
      []
    );

    const fetchTranUserData = async (bookmark = null, docs = []) => {
      const { data } = await dbConnect().mango("bank-management", {
        selector: {
          docType: "User",
          _id: { $or: user },
        },
        fields: ["_id", "firstName", "lastName", "accountNumber", "bank"],
        bookmark,
      });

      docs = docs.concat(data.docs);

      if (data.bookmark && data.docs.length > 0) {
        return fetchTranUserData(data.bookmark, docs);
      } else {
        return docs;
      }
    };

    const userData = await fetchTranUserData();

    const aggregatedData = transactionData.map((item, i) => {
      const user = userData.filter((filData) => filData._id === item.userId)[0];
      const from = userData.filter((filData) => filData._id === item.fromId)[0];
      return {
        ...item,
        user: user ? user.firstName + " " + user.lastName : "Bank",
        from: from ? from.firstName + " " + from.lastName : "Bank",
        userAc: user ? user.accountNumber : "(Bank Itself)",
        fromAc: from ? from.accountNumber : "(Bank Itself)",
        userIfsc: user ? user.bank : "",
        fromIfsc: from ? from.bank : "",
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
        count: transactionData.length,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
