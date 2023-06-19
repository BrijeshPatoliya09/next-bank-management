import dbConnect from "../../../../helper/connection";
import { withSessionRoute } from "../../../../helper/session";

export default withSessionRoute(async (req, res) => {
  const {
    body: { loan, collteral },
  } = req;
  try {
    //!loan
    let validationLoan = [];
    Object.keys(loan).map((eachData) => {
      if (
        !loan[eachData] ||
        loan[eachData] == "" ||
        loan[eachData] == undefined
      ) {
        validationLoan.push(`Please enter loan ${eachData}`);
      }
    });

    //!collateral
    let validationCollateral = [];
    Object.keys(collteral).map((eachData) => {
      if (
        !collteral[eachData] ||
        collteral[eachData] == "" ||
        collteral[eachData] == undefined
      ) {
        validationCollateral.push(`Please enter collateral ${eachData}`);
      }
    });

    if (validationLoan.length > 0) {
      return res.status(422).json({ status: false, message: validationLoan });
    } else if (validationCollateral.length > 0) {
      return res
        .status(422)
        .json({ status: false, message: validationCollateral });
    } else if (loan.amount < 100000) {
      return res
        .status(422)
        .json({ status: false, message: "Please enter valid amount" });
    } else if (collteral.value < loan.amount) {
      return res.status(422).json({
        status: false,
        message: "Please enter valid collateral value",
      });
    }
    const user = req.session.user;

    const mango = {
      selector: {
        docType: "User",
        _id: user.userId,
      },
      fields: ["bank", "accountNumber"],
    };

    const userData = (await dbConnect().mango("bank-management", mango)).data
      .docs[0];

    const prevloan = (
      await dbConnect().mango("bank-management", {
        selector: {
          docType: "Loan",
          ifscCode: userData.bank,
          userAccountNo: userData.accountNumber,
          type: loan.type,
          status: { $or: [0, 1] },
        },
        fields: ["_id"],
      })
    ).data.docs;

    if (prevloan.length == 0) {
      await dbConnect().insert("bank-management", {
        ...loan,
        type: Number(loan.type),
        duration: Number(loan.duration),
        createdAt: Math.floor(Date.now() / 1000),
        status: 0,
        ifscCode: userData.bank,
        userAccountNo: userData.accountNumber,
        interest:
          loan.type == 0 || loan.type == 2 ? 12 : loan.type == 1 ? 9 : 15,
        collateral: {
          ...collteral,
          owner: "user",
        },
        docType: "Loan",
      });

      res
        .status(200)
        .json({ status: true, message: "Loan successfully registered" });
    } else {
      res.status(404).json({
        status: false,
        message: "This type of loan is already on going",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
});
