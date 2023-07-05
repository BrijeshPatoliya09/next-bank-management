import dbConnect from "../../../../helper/connection";

export default async (req, res) => {
  const { userId } = req.body;
  try {
    const mango = {
      selector: {
        docType: "Employee",
        _id: userId,
      },
      fields: ["bankId"],
    };
    const empData = (await dbConnect().mango("bank-management", mango)).data
      .docs[0];

    if (empData) {
      const bankInfo = (
        await dbConnect().mango("bank-management", {
          selector: {
            docType: "Bank",
            _id: empData.bankId,
          },
          fields: ["ifscCode", "_id", "level", "address", "funds"],
        })
      ).data.docs[0];

      const loanData = (
        await dbConnect().mango("bank-management", {
          selector: {
            docType: "Loan",
            ifscCode: bankInfo.ifscCode,
          },
          fields: ["_id", "status", "amount"],
        })
      ).data.docs;

      let totalLoanAmount = 0;
      if (loanData.length > 0) {
        totalLoanAmount = loanData
          .filter((item) => item.status == 1 || item.status == 3)
          .reduce((total, data) => total + Number(data.amount), 0);
      }

      const usersData = (
        await dbConnect().mango("bank-management", {
          selector: {
            docType: "User",
            accountStatus: 1,
            bank: bankInfo.ifscCode,
          },
          fields: ["_id", "accountStatus"],
        })
      ).data.docs;

      const allUserId = usersData.map((item) => item._id);

      const transactionData = (
        await dbConnect().mango("bank-management", {
          selector: {
            docType: "Transaction",
            $or: [
              { userId: { $or: [...allUserId, bankInfo._id] } },
              { fromId: { $or: [...allUserId, bankInfo._id] } },
            ],
          },
          fields: ["_id", "status", "amount"],
        })
      ).data.docs;

      let totalTransactionAmount = 0;
      if (transactionData.length > 0) {
        totalTransactionAmount = transactionData
          .filter((item) => item.status == 1)
          .reduce((total, data) => {
            return total + Number(data.amount);
          }, 0);
      }

      const totalEmployees = (
        await dbConnect().mango("bank-management", {
          selector: {
            docType: "Employee",
            bankId: bankInfo._id,
          },
          fields: ["_id", "status"],
        })
      ).data.docs;

      let totalBanks = {};
      if (bankInfo.level == 5) {
        totalBanks.type = 1;
        totalBanks.totalUsers = usersData.length;
        totalBanks.pendingUsers = usersData.filter(
          (item) => item.accountStatus == 0
        ).length;
        totalBanks.confirmedUsers = usersData.filter(
          (item) => item.accountStatus == 1
        ).length;
        totalBanks.rejectedUsers = usersData.filter(
          (item) => item.accountStatus == 2
        ).length;
        totalBanks.closedUsers = usersData.filter(
          (item) => item.accountStatus == 3
        ).length;
      } else {
        let query = {};
        if (bankInfo.level == 2) {
          query = { "address.country": bankInfo.address.country };
        } else if (bankInfo.level == 3) {
          query = { "address.state": bankInfo.address.state };
        } else if (bankInfo.level == 4) {
          query = { "address.city": bankInfo.address.city };
        } else if (bankInfo.level == 5) {
          query = { "address.zone": bankInfo.address.zone };
        }

        const subBanks = (
          await dbConnect().mango("bank-management", {
            selector: {
              docType: "Bank",
              level: Number(bankInfo.level) + 1,
              ...query,
            },
            fields: ["_id", "status"],
          })
        ).data.docs;

        totalBanks.type = 0;
        totalBanks.totalSubBanks = subBanks.length;
      }

      res.status(200).json({
        status: true,
        message: "success",
        data: {
          loan: {
            pendingLoans: loanData.filter((item) => item.status == 0).length,
            confirmLoans: loanData.filter((item) => item.status == 1).length,
            rejectedLoans: loanData.filter((item) => item.status == 2).length,
            closedLoans: loanData.filter((item) => item.status == 3).length,
            totalLoan: loanData.length,
            totalLoanAmount,
          },
          transaction: {
            pendingTrans: transactionData.filter((item) => item.status == 0)
              .length,
            confirmedTrans: transactionData.filter((item) => item.status == 1)
              .length,
            rjectedTrans: transactionData.filter((item) => item.status == 2)
              .length,
            totalTrans: transactionData.length,
            totalTransactionAmount,
          },
          employees: {
            activeEmp: totalEmployees.filter((item) => item.status == 0).length,
            inactiveEmp: totalEmployees.filter((item) => item.status == 1)
              .length,
            totalEmp: totalEmployees.length,
          },
          totalBanks,
          totalFunds: Number(bankInfo.funds),
        },
      });
    } else {
      res.status(404).json({ status: false, message: "Unauthorised" });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
