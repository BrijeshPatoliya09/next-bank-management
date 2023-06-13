import dbConnect from "../../../../helper/connection";
import { withSessionRoute } from "../../../../helper/session";

export default withSessionRoute(async (req, res) => {
  const {
    body: { type, description, amount },
  } = req;
  try {
    if (type) {
      if (amount || amount.trim()) {
        const user = req.session.user;
        if (user) {
          const getUset = (
            await dbConnect().mango("bank-management", {
              selector: {
                docType: "User",
                _id: user.userId,
              },
              fields: ["balance", "bank"],
            })
          ).data.docs[0];

          if (type == 0) {
            if (Number(getUset.balance) >= amount) {
              const user2 = (
                await dbConnect().mango("bank-management", {
                  selector: {
                    docType: "Bank",
                    ifscCode: getUset.bank,
                  },
                  fields: ["_id"],
                })
              ).data.docs[0];

              await dbConnect().insert("bank-management", {
                userId: user2._id,
                fromId: user.userId,
                type: "b2c",
                amount,
                createdAt: Math.floor(new Date().getTime() / 1000),
                status: 0,
                description,
                docType: "Debit",
              });

              res
                .status(200)
                .json({ status: true, message: "Request sent successfully" });
            } else {
              res
                .status(404)
                .json({ status: false, message: "Insufficient balance" });
            }
          } else {
            const user2 = (
              await dbConnect().mango("bank-management", {
                selector: {
                  docType: "Bank",
                  ifscCode: getUset.bank,
                },
                fields: ["_id"],
              })
            ).data.docs[0];

            await dbConnect().insert("bank-management", {
              userId: user.userId,
              fromId: user2._id,
              amount,
              type: "c2b",
              createdAt: Math.floor(new Date().getTime() / 1000),
              status: 0,
              description,
              docType: "Credit",
            });

            res
              .status(200)
              .json({ status: true, message: "Request sent successfully" });
          }
        } else {
          res.status(401).json({ status: false, message: "Unauthorized" });
        }
      } else {
        res.status(404).json({ status: false, message: "Please enter amount" });
      }
    } else {
      res
        .status(404)
        .json({ status: false, message: "Please enter bank IFSC code" });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
});
