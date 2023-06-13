import dbConnect from "../../../../helper/connection";
import { withSessionRoute } from "../../../../helper/session";

export default withSessionRoute(async (req, res) => {
  const {
    body: { accountNo, description, amount },
  } = req;
  try {
    if (accountNo || accountNo.trim()) {
      if (amount || amount.trim()) {
        if (Number(amount) <= 50000) {
          const user = req.session.user;
          if (user) {
            const currentT = new Date();
            currentT.setHours(0, 0, 0, 0);
            const currentTime = Math.floor(currentT.getTime() / 1000);

            const nextTime = currentTime + 24 * 60 * 60;

            const timeData = (
              await dbConnect().mango("bank-management", {
                selector: {
                  docType: "Debit",
                  userId: user.userId,
                  createdAt: { $gt: currentTime, $lt: nextTime },
                },

                fields: ["amount"],
              })
            ).data.docs;

            console.log(timeData);

            if (timeData.length <= 10) {
              if (
                timeData.reduce(
                  (item, data) => item + Number(data.amount),
                  0
                ) <= 100000
              ) {
                const getUser = (
                  await dbConnect().mango("bank-management", {
                    selector: {
                      docType: "User",
                      _id: user.userId,
                    },
                  })
                ).data.docs[0];

                if (getUser.balance >= amount) {
                  const user2 = (
                    await dbConnect().mango("bank-management", {
                      selector: {
                        docType: "User",
                        accountNumber: accountNo,
                        bank: getUser.bank,
                      },
                    })
                  ).data.docs[0];

                  if (user2) {
                    const getBank = (
                      await dbConnect().mango("bank-management", {
                        selector: {
                          docType: "Bank",
                          ifscCode: getUser.bank,
                        },
                        fields: ["_id"],
                      })
                    ).data.docs;

                    if (getBank.length > 0) {
                      await dbConnect().update("bank-management", {
                        ...getUser,
                        balance: Number(getUser.balance) - Number(amount),
                      });

                      await dbConnect().update("bank-management", {
                        ...user2,
                        balance: Number(user2.balance) + Number(amount),
                      });

                      await dbConnect().insert("bank-management", {
                        userId: user.userId,
                        fromId: user2._id,
                        type: "c2c",
                        amount,
                        createdAt: Math.floor(new Date().getTime() / 1000),
                        status: 1,
                        description,
                        docType: "Debit",
                      });

                      await dbConnect().insert("bank-management", {
                        userId: user2._id,
                        fromId: user.userId,
                        amount,
                        type: "c2c",
                        createdAt: Math.floor(new Date().getTime() / 1000),
                        status: 1,
                        description,
                        docType: "Credit",
                      });

                      res.status(200).json({
                        status: true,
                        message: "Transaction completed successfully",
                      });
                    } else {
                      res.status(404).json({
                        status: false,
                        message: "Bank doesnt exist",
                      });
                    }
                  } else {
                    res.status(404).json({
                      status: false,
                      message: "User doesnt exist with this account no.",
                    });
                  }
                } else {
                  res
                    .status(404)
                    .json({ status: false, message: "Insufficient balance" });
                }
              } else {
                res.status(404).json({
                  status: false,
                  message: "Total amount exceeds the limit",
                });
              }
            } else {
              res.status(404).json({
                status: false,
                message: "Total number of transaction exceeded",
              });
            }
          } else {
            res.status(401).json({ status: false, message: "Unauthorized" });
          }
        } else {
          res.status(200).json({
            status: false,
            message: "Transaction is over limite",
          });
        }
      } else {
        res.status(404).json({ status: false, message: "Please enter amount" });
      }
    } else {
      res
        .status(404)
        .json({ status: false, message: "Please enter bank account no." });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
});
