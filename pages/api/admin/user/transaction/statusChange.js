import dbConnect from "../../../../../helper/connection";

export default async (req, res) => {
  const {
    body: { status, transId, revId },
  } = req;
  try {
    const transactionData = (
      await dbConnect().mango("bank-management", {
        selector: {
          _id: transId,
        },
      })
    ).data.docs[0];

    if (transactionData.docType == "Credit") {
      const getUser = (
        await dbConnect().mango("bank-management", {
          selector: {
            docType: "User",
            _id: transactionData.userId,
          },
        })
      ).data.docs[0];

      const getfrom = (
        await dbConnect().mango("bank-management", {
          selector: {
            docType: "Bank",
            _id: transactionData.fromId,
          },
        })
      ).data.docs[0];

      console.log(getUser, getfrom);

      await dbConnect().update("bank-management", {
        ...getfrom,
        funds: getfrom.funds + Number(transactionData.amount),
      });
      await dbConnect().update("bank-management", {
        ...getUser,
        balance: getUser.balance + Number(transactionData.amount),
      });
    } else {
      const getUser = (
        await dbConnect().mango("bank-management", {
          selector: {
            docType: "User",
            _id: transactionData.userId,
          },
        })
      ).data.docs[0];

      const getfrom = (
        await dbConnect().mango("bank-management", {
          selector: {
            docType: "Bank",
            _id: transactionData.fromId,
          },
        })
      ).data.docs[0];

      await dbConnect().update("bank-management", {
        ...getfrom,
        funds: getfrom.funds - Number(transactionData.amount),
      });
      await dbConnect().update("bank-management", {
        ...getUser,
        balance: getUser.balance - Number(transactionData.amount),
      });
    }

    await dbConnect().update("bank-management", {
      _id: transId,
      _rev: revId,
      ...transactionData,
      status,
    });

    res.status(200).json({ status: true, message: "success" });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
