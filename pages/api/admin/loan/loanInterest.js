import dbConnect from "../../../../helper/connection";

export default async (req, res) => {
  const { body } = req;
  try {
    const fetchLoanData = async (bookmark = null, docs = []) => {
      const { data } = await dbConnect().mango("bank-management", {
        selector: {
          docType: "Loan",
          ifscCode: body,
          status: 1,
        },
        bookmark,
      });

      docs = docs.concat(data.docs);

      if (data.bookmark && data.docs.length > 0) {
        return fetchLoanData(data.bookmark, docs);
      } else {
        return docs;
      }
    };
    const loanData = await fetchLoanData();

    const getDates = (dataTime) => {
      const nowDate = Math.floor(Date.now() / 1000);

      const currentDate = new Date(dataTime * 1000);

      currentDate.setMonth(currentDate.getMonth() + 1);
      const updatedEpochTime = Math.floor(currentDate.getTime() / 1000);
      return {
        nowDate,
        updatedEpochTime,
      };
    };

    const interestDeduct = async (data, penalty) => {
      const interestAmount =
        ((Number(data.amount) * data.interest) / 100 + Number(data.amount)) /
        data.duration;

      const userData = (
        await dbConnect().mango("bank-management", {
          selector: {
            docType: "User",
            bank: data.ifscCode,
            accountNumber: data.userAccountNo,
          },
        })
      ).data.docs[0];
      if (!penalty) {
        if (interestAmount.toFixed(2) <= userData.balance) {
          const bankData = (
            await dbConnect().mango("bank-management", {
              selector: {
                docType: "Bank",
                ifscCode: data.ifscCode,
              },
            })
          ).data.docs[0];

          await dbConnect().update("bank-management", {
            ...userData,
            balance:
              Number(userData.balance) - Number(interestAmount).toFixed(2),
          });

          await dbConnect().update("bank-management", {
            ...bankData,
            funds: Number(bankData.funds) + Number(interestAmount).toFixed(2),
          });

          await dbConnect().insert("bank-management", {
            userId: userData._id,
            fromId: bankData._id,
            type: "Interest",
            amount: interestAmount.toFixed(2),
            createdAt: Math.floor(new Date().getTime() / 1000),
            status: 1,
            description: `Interest for ${
              data.type == 0 ? "Personal Loan" : ""
            }${data.type == 1 ? "Student Loan" : ""}${
              data.type == 2 ? "Business Loan" : ""
            }${data.type == 3 ? "House Loan" : ""}${
              data.type == 4 ? "Mortgage Loan" : ""
            }`,
            docType: "Transaction",
          });

          await dbConnect().update("bank-management", {
            ...data,
            totalAmount: Number(data.totalAmount) - interestAmount,
            interestDate: Math.floor(new Date().getTime() / 1000),
            totalInt: data.totalInt - 1,
          });

          console.log("Interest Paid");
        } else {
          await dbConnect().update("bank-management", {
            ...data,
            interestDate: Math.floor(new Date().getTime() / 1000),
            penalty: [
              ...data.penalty,
              {
                status: 0,
                timeStamp: Math.floor(new Date().getTime() / 1000),
                amount: 5000,
              },
            ],
          });
          console.log("Interest Breached");
        }
      } else {
        console.log(penalty);
        if (interestAmount.toFixed(2) + penalty.amount <= userData.balance) {
          const bankData = (
            await dbConnect().mango("bank-management", {
              selector: {
                docType: "Bank",
                ifscCode: data.ifscCode,
              },
            })
          ).data.docs[0];

          await dbConnect().update("bank-management", {
            ...userData,
            balance:
              Number(userData.balance) -
              (Number(interestAmount) + Number(penalty.amount)).toFixed(2),
          });

          await dbConnect().update("bank-management", {
            ...bankData,
            funds:
              Number(bankData.funds) +
              (Number(interestAmount) + Number(penalty.amount)).toFixed(2),
          });

          await dbConnect().insert("bank-management", {
            userId: userData._id,
            fromId: bankData._id,
            type: "Interest",
            amount: interestAmount.toFixed(2),
            createdAt: Math.floor(new Date().getTime() / 1000),
            status: 1,
            description: `Interest for ${
              data.type == 0 ? "Personal Loan" : ""
            }${data.type == 1 ? "Student Loan" : ""}${
              data.type == 2 ? "Business Loan" : ""
            }${data.type == 3 ? "House Loan" : ""}${
              data.type == 4 ? "Mortgage Loan" : ""
            }`,
            docType: "Transaction",
          });

          await dbConnect().insert("bank-management", {
            userId: userData._id,
            fromId: bankData._id,
            type: "Penalty",
            amount: penalty.amount,
            createdAt: Math.floor(new Date().getTime() / 1000),
            status: 1,
            description: `penalty for ${data.type == 0 ? "Personal Loan" : ""}${
              data.type == 1 ? "Student Loan" : ""
            }${data.type == 2 ? "Business Loan" : ""}${
              data.type == 3 ? "House Loan" : ""
            }${data.type == 4 ? "Mortgage Loan" : ""}`,
            docType: "Transaction",
          });

          await dbConnect().update("bank-management", {
            ...data,
            totalAmount: Number(data.totalAmount) - interestAmount.toFixed(2),
            penalty: data.penalty.map((item) => {
              if (penalty.timeStamp == item.timeStamp && item.status == 0) {
                return { ...item, status: 1 };
              } else {
                return item;
              }
            }),
            totalInt: data.totalInt - 1,
          });

          console.log("Interest Paid with Panalty");
        } else {
          await dbConnect().update("bank-management", {
            ...data,
            status: 3,
            collateralOwner: 1,
          });
          console.log("Loan closed collateral taken");
        }
      }
    };

    for (let i = 0; i < loanData.length; i++) {
      const data = loanData[i];
      console.log("hello");
      if (!data.interestDate) {
        const dates = getDates(data.startDate);
        if (dates.nowDate >= dates.updatedEpochTime) {
          await interestDeduct(data);
        }
      } else {
        if (data.totalInt > 0) {
          const checkPenalty = data.penalty.filter((item) => item.status == 0);
          console.log(checkPenalty);
          if (checkPenalty.length > 0) {
            const nowDate = Math.floor(Date.now() / 1000);
            const updatedEpochTime = checkPenalty[0].timeStamp + 864000;

            if (nowDate >= updatedEpochTime) {
              await interestDeduct(data, checkPenalty[0]);
            }
          } else {
            const dates = getDates(data.interestDate);
            if (dates.nowDate >= dates.updatedEpochTime) {
              await interestDeduct(data);
            }
          }
        } else {
          await dbConnect().update("bank-management", {
            ...data,
            status: 3,
          });
          console.log("loan is over");
        }
      }
    }

    res.status(200).json({ status: true, message: "success", data: loanData });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
