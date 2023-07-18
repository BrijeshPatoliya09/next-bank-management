import dbConnect from "../../../../helper/connection";
import { withSessionRoute } from "../../../../helper/session";
import { filterFunction, dataSorting } from "../../../../helper/common";

export default withSessionRoute(async (req, res) => {
  const { page, sort, filter } = req.body;
  try {
    const user = req.session.user;

    const userBal = (
      await dbConnect().mango("bank-management", {
        selector: {
          docType: "User",
          _id: user.userId,
        },
        fields: ["balance"],
      })
    ).data.docs[0];

    const fetchTransData = async (bookmark = null, docs = []) => {
      const { data } = await dbConnect().mango("bank-management", {
        selector: {
          docType: "Transaction",
          $or: [{ userId: user.userId }, { fromId: user.userId }],
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

    const data = await fetchTransData();

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

    const c2cIds = data
      .filter((item) => item.type == "c2c")
      .reduce((item, c2c) => [...item, c2c.fromId, c2c.userId], []);

    const c2cData = (
      await dbConnect().mango("bank-management", {
        selector: {
          docType: "User",
          _id: { $or: c2cIds },
        },
        fields: ["_id", "firstName", "lastName"],
      })
    ).data.docs;

    const b2bIds = data
      .filter((item) => item.type == "b2b")
      .reduce((item, b2b) => [...item, b2b.fromId, b2b.userId], []);

    const b2bData = (
      await dbConnect().mango("bank-management", {
        selector: {
          docType: "User",
          _id: { $or: b2bIds },
        },
        fields: ["_id", "bank"],
      })
    ).data.docs;

    const newData = data.map((item) => {
      if (item.type == "b2b" || item.type == "c2c") {
        if (item.type == "b2b") {
          if (user.userId == item.userId) {
            const nameData = b2bData.filter(
              (filt) => filt._id == item.fromId
            )[0];
            balance = balance - Number(item.amount);
            return { ...item, trans: 0, name: nameData.bank, balance };
          }
          if (user.userId == item.fromId) {
            const nameData = b2bData.filter(
              (filt) => filt._id == item.userId
            )[0];
            balance = balance + Number(item.amount);
            return { ...item, trans: 0, name: nameData.bank, balance };
          }
        } else {
          if (user.userId == item.userId) {
            const nameData = c2cData.filter(
              (filt) => filt._id == item.fromId
            )[0];
            balance = balance - Number(item.amount);
            return {
              ...item,
              trans: 0,
              name: nameData.firstName + " " + nameData.lastName,
              balance,
            };
          }
          if (user.userId == item.fromId) {
            const nameData = c2cData.filter(
              (filt) => filt._id == item.userId
            )[0];
            balance = balance + Number(item.amount);
            return {
              ...item,
              trans: 0,
              name: nameData.firstName + " " + nameData.lastName,
              balance,
            };
          }
        }
      } else if (item.type == "b2c" || item.type == "c2b") {
        if (user.userId == item.userId) {
          balance = balance + Number(item.amount);
          return { ...item, trans: 1, name: "Bank", balance };
        }
        if (user.userId == item.fromId) {
          balance = balance - Number(item.amount);
          return { ...item, trans: 0, name: "Bank", balance };
        }
      } else {
        if (user.userId == item.userId) {
          balance = balance - Number(item.amount);
          return { ...item, trans: 0, name: "Bank", balance };
        }
        if (user.userId == item.fromId) {
          balance = balance + Number(item.amount);
          return { ...item, trans: 1, name: "Bank", balance };
        }
      }
    });

    let filteredData = await filterFunction(filter, newData);

    res.status(200).json({
      status: true,
      message: "success",
      data: {
        userData: await dataSorting(sort, filteredData, page),
        count: filteredData.length,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
});
