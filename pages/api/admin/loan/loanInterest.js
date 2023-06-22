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

    for (let i = 0; i < loanData.length; i++) {
      const data = loanData[i];

      const nowDate = Math.floor(Date.now() / 1000);

      const currentDate = new Date(startDate * 1000);

      currentDate.setMonth(currentDate.getMonth() + monthsToAdd);

      const updatedEpochTime = Math.floor(currentDate.getTime() / 1000);
      
    }

    res.status(200).json({ status: true, message: "success", data: loanData });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
