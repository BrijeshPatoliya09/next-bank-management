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

    let field = {};
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

      await dbConnect().insert("bank-management", {
        userId: bankData._id,
        fromId: userdata._id,
        type: "Loan",
        amount: data.amount,
        createdAt: Math.floor(new Date().getTime() / 1000),
        status: 1,
        description: `                                
        ${data.type == 0 && "Personal Loan"}
        ${data.type == 1 && "Student Loan"}
        ${data.type == 2 && "Business Loan"}
        ${data.type == 3 && "House Loan"}
        ${data.type == 4 && "Mortgage Loan"}`,
        docType: "Transaction",
      });

      field.startDate = Math.floor(Date.now() / 1000);
      field.interestData = [];
    }

    await dbConnect().update("bank-management", {
      _id: loanId,
      _rev: revId,
      ...data,
      totalAmount: (data.amount * data.interest) / data.duration,
      status,
      ...field,
    });

    res.status(200).json({ status: true, message: "success" });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
