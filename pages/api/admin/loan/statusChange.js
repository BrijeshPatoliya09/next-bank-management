import dbConnect from "../../../../helper/connection";

export default async (req, res) => {
  const {
    body: { status, loanId, revId },
  } = req;
  try {
    const data = (
      await dbConnect().mango("bank-management", {
        selector: {
          docType: "Loan",
          _id: loanId,
        },
      })
    ).data.docs[0];

    if (status == 1) {
      const bankData = (
        await dbConnect().mango("bank-management", {
          selector: {
            docType: "Bank",
            ifscCode: data.ifscCode,
          },
        })
      ).data.docs[0];

      const userdata = (
        await dbConnect().mango("bank-management", {
          selector: {
            docType: "User",
            bank: data.ifscCode,
            accountNumber: data.userAccountNo,
          },
        })
      ).data.docs[0];

      await dbConnect().update("bank-management", {
        ...userdata,
        balance: Number(userdata.balance) + Number(data.amount),
      });

      await dbConnect().update("bank-management", {
        ...bankData,
        funds: Number(bankData.funds) - Number(data.amount),
      });
    }

    await dbConnect().update("bank-management", {
      _id: loanId,
      _rev: revId,
      ...data,
      status,
    });

    res.status(200).json({ status: true, message: "success" });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
