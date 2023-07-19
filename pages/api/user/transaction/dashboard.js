import dbConnect from "../../../../helper/connection";
import { withSessionRoute } from "../../../../helper/session";

export default withSessionRoute(async (req, res) => {
  try {
    const user = req.session.user;

    const userBal = (
      await dbConnect().mango("bank-management", {
        selector: {
          docType: "User",
          _id: user.userId,
        },
        fields: ["balance", "createdAt"],
      })
    ).data.docs[0];

    const fetchTransData = async (date, bookmark = null, docs = []) => {
      const { data } = await dbConnect().mango("bank-management", {
        selector: {
          docType: "Transaction",
          status: 1,
          $or: [{ userId: user.userId }, { fromId: user.userId }],
          createdAt: {
            $and: [
              { $gte: date },
              { $lte: Math.floor(start.getTime() / 1000) },
            ],
          },
        },
        sort: [{ createdAt: "asc" }],
        bookmark,
      });

      docs = docs.concat(data.docs);

      if (data.bookmark && data.docs.length > 0) {
        return fetchTransData(data.bookmark, docs);
      } else {
        return docs;
      }
    };

    if (
      userBal.createdAt + 30 * 24 * 60 * 60 >
      Math.floor(new Date().getTime() / 1000.0)
    ) {
      const data = await fetchTransData(userBal.createdAt);
      const days = getDaysFromDate(userBal.createdAt).pop();

      let balance = data.reduce((item, amt) => {
        if (amt.type == "b2c" || amt.type == "c2b") {
          if (user.userId == amt.userId) {
            return item - Number(amt.amount);
          } else {
            return item + Number(amt.amount);
          }
        } else {
          if (user.userId == amt.userId) {
            return item + Number(amt.amount);
          } else {
            return item - Number(amt.amount);
          }
        }
      }, userBal.balance);

      const balanceDate = days.map((item) => {
        const dayData = data.filter(
          (fil) => item.start < fil.createdAt && item.end > fil.createdAt
        );

        if(dayData.length > 0) {
          const 
        }
      });
    }

    res.status(200).json({
      status: true,
      message: "success",
      data: {},
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
});
