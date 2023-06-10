import dbConnect from "../../../../helper/connection";
import { withSessionRoute } from "../../../../helper/session";

export default withSessionRoute(async (req, res) => {
  const {
    body: { accountNo, ifscCode, description, amount },
  } = req;
  try {
    if (accountNo || accountNo.trim()) {
      if (ifscCode || ifscCode.trim()) {
        if (amount || amount.trim()) {
          const user = req.session.user;
          if (user) {
            const getUset = (
              await dbConnect().mango("bank-management", {
                selector: {
                  docType: "User",
                  _id: user.userId,
                },
              })
            ).data.docs[0];

            const getBank = (
              await dbConnect().mango("bank-management", {
                selector: {
                  docType: "Bank",
                  ifscCode: getUset.bank,
                },
              })
            ).data.docs[0];

            if (getUset.balance >= amount) {
              const user2 = (
                await dbConnect().mango("bank-management", {
                  selector: {
                    docType: "User",
                    accountNumber: accountNo,
                    bank: ifscCode,
                  },
                })
              ).data.docs[0];

              if (user2.length > 0) {
                const bank2 = (
                  await dbConnect().mango("bank-management", {
                    selector: {
                      docType: "Bank",
                      ifscCode: user2.bank,
                    },
                  })
                ).data.docs[0];

                await dbConnect().update("bank-management", {
                  ...getUset,
                  balance: getUset.balance - amount,
                });

                await dbConnect().update("bank-management", {
                  ...getBank,
                  funds: getBank.funds - amount,
                });

                await dbConnect().update("bank-management", {
                  ...user2,
                  balance: user2.balance + amount,
                });

                await dbConnect().update("bank-management", {
                  ...bank2,
                  funds: bank2.funds + amount,
                });

                await dbConnect().insert("bank-management", {
                  userId: user.userId,
                  fromId: user2._id,
                  type: "b2b",
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
                  type: "b2b",
                  createdAt: Math.floor(new Date().getTime() / 1000),
                  status: 1,
                  description,
                  docType: "Credit",
                });

                res.status(200).json({ status: true, message: "success" });
              } else {
                res.status(404).json({
                  status: true,
                  message: "User doesnt exist with this account no.",
                });
              }
            } else {
              res
                .status(404)
                .json({ status: false, message: "Insufficient balance" });
            }
          } else {
            res.status(401).json({ status: false, message: "Unauthorized" });
          }
        } else {
          res
            .status(404)
            .json({ status: false, message: "Please enter amount" });
        }
      } else {
        res
          .status(404)
          .json({ status: false, message: "Please enter bank IFSC code" });
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
