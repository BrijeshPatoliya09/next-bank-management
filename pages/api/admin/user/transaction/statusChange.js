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

    const getUset = (
      await dbConnect().mango("bank-management", {
        selector: {
          docType: "User",
          _id: transactionData.fromId,
        },
      })
    ).data.docs[0];

    const getBank = (
      await dbConnect().mango("bank-management", {
        selector: {
          docType: "Bank",
          _id: transactionData.userId,
        },
      })
    ).data.docs[0];

    if (transactionData.docType == "Credit") {
      await dbConnect().update("bank-management", {
        ...getBank,
        funds: getBank.funds + Number(transactionData.amount),
      });
      await dbConnect().update("bank-management", {
        ...getUset,
        balance: getUset.balance + Number(transactionData.amount),
      });
    } else {
      await dbConnect().update("bank-management", {
        ...getBank,
        funds: getBank.funds - Number(transactionData.amount),
      });
      await dbConnect().update("bank-management", {
        ...getUset,
        balance: getUset.balance - Number(transactionData.amount),
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
