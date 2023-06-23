import dbConnect from "../../../../helper/connection";

export default async (req, res) => {
  try {
    const loanData = (
      await dbConnect().mango("bank-management", {
        selector: {
          docType: "Loan",
          status: 1,
        },
      })
    ).data.docs;

    const getDates = (dataTime) => {
      const nowDate = Math.floor(Date.now() / 1000);

      const currentDate = new Date(dataTime * 1000);

      currentDate.setMonth(currentDate.getMonth() + monthsToAdd);

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

      if (interestAmount + penalty <= userData.balance) {
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
          balance: Number(userData.balance) - Number(interestAmount),
        });

        await dbConnect().update("bank-management", {
          ...bankData,
          funds: Number(bankData.funds) + Number(interestAmount),
        });

        await dbConnect().insert("bank-management", {
          userId: userData._id,
          fromId: bankData._id,
          type: "Interest",
          amount: interestAmount,
          createdAt: Math.floor(new Date().getTime() / 1000),
          status: 1,
          description: `Interest for                               
        ${data.type == 0 && "Personal Loan"}
        ${data.type == 1 && "Student Loan"}
        ${data.type == 2 && "Business Loan"}
        ${data.type == 3 && "House Loan"}
        ${data.type == 4 && "Mortgage Loan"}`,
          docType: "Transaction",
        });

        await dbConnect().update("bank-management", {
          ...data,
          totalAmount: Number(data.totalAmount) - interestAmount,
          interestData: data.interestData.push({
            status: 0,
            timeStamp: Math.floor(new Date().getTime() / 1000),
            amount: interestAmount,
          }),
        });
      } else {
        if (!penalty) {
          await dbConnect().update("bank-management", {
            ...data,
            interestData: data.interestData.push({
              status: 1,
              timeStamp: Math.floor(new Date().getTime() / 1000),
              amount: interestAmount,
              penalty: (interestAmount * 15) / 100,
            }),
          });
        } else {
          await dbConnect().update("bank-management", {
            ...data,
            collateral: {
              ...data.collateral,
              owner: "Bank",
            },
          });
        }
      }
    };

    for (let i = 0; i < loanData.length; i++) {
      const data = loanData[i];

      if (data.interestData.length > 0) {
        const currentInterest = data.interestData.reduce((max, obj) => {
          return obj.timeStamp > max.timeStamp ? obj : max;
        }, data[0]);

        if (currentInterest.status == 0) {
          const dates = getDates(currentInterest.timeStamp);

          if (dates.nowDate >= dates.updatedEpochTime) {
            await interestDeduct(data);
          }
        }

        if (currentInterest.status == 1) {
          const nowDate = Math.floor(Date.now() / 1000);
          const updatedEpochTime =
            currentInterest.timeStamp + 24 * 60 * 60 * 10;

          if (nowDate >= updatedEpochTime) {
          }
        }

        if (currentInterest.status == 1) {
          const dates = getDates(currentInterest.timeStamp);

          if (dates.nowDate >= dates.updatedEpochTime) {
            await interestDeduct(data);
          }
        }
      } else {
        const dates = getDates(data.startDate);
        if (dates.nowDate >= dates.updatedEpochTime) {
          await interestDeduct(data);
        }
      }
    }

    res.status(200).json({ status: true, message: "success", data: loanData });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
