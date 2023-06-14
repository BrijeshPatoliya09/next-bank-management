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

    if (transactionData.type == "b2b" && transactionData.docType == "Debit") {
      const getUset = (
        await dbConnect().mango("bank-management", {
          selector: {
            docType: "User",
            _id: transactionData.userId,
          },
        })
      ).data.docs[0];

      const user2 = (
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
            ifscCode: getUset.bank,
          },
        })
      ).data.docs[0];

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
        balance: Number(getUset.balance) - Number(transactionData.amount),
      });

      await dbConnect().update("bank-management", {
        ...getBank,
        funds: Number(getBank.funds) - Number(transactionData.amount),
      });

      await dbConnect().update("bank-management", {
        ...user2,
        balance: Number(user2.balance) + Number(transactionData.amount),
      });

      await dbConnect().update("bank-management", {
        ...bank2,
        funds: Number(bank2.funds) + Number(transactionData.amount),
      });

      await dbConnect().insert("bank-management", {
        userId: user2._id,
        fromId: getUset._id,
        amount: transactionData.amount,
        type: "b2b",
        createdAt: Math.floor(new Date().getTime() / 1000),
        status: 1,
        description: transactionData.description,
        docType: "Credit",
      });
    } else {
      if (transactionData.docType == "Credit") {
        const getUser = (
          await dbConnect().mango("bank-management", {
            selector: {
              docType: "Bank",
              _id: transactionData.userId,
            },
          })
        ).data.docs[0];

        const getfrom = (
          await dbConnect().mango("bank-management", {
            selector: {
              docType: "User",
              _id: transactionData.fromId,
            },
          })
        ).data.docs[0];

        await dbConnect().update("bank-management", {
          ...getUser,
          funds: getUser.funds + Number(transactionData.amount),
        });
        await dbConnect().update("bank-management", {
          ...getfrom,
          balance: getfrom.balance + Number(transactionData.amount),
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
        console.log("getUser: ", getUser);

        const getfrom = (
          await dbConnect().mango("bank-management", {
            selector: {
              docType: "Bank",
              _id: transactionData.fromId,
            },
          })
        ).data.docs[0];
        console.log("getfrom: ", getfrom);

        await dbConnect().update("bank-management", {
          ...getfrom,
          funds: getfrom.funds - Number(transactionData.amount),
        });
        await dbConnect().update("bank-management", {
          ...getUser,
          balance: getUser.balance - Number(transactionData.amount),
        });
      }
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
