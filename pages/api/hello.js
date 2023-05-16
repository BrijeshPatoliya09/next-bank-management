import dbConnect from "../../helper/connection";

export default async (req, res) => {
  try {
    let name;
    await dbConnect()
      .listDatabases()
      .then((dbs) => {
        console.log(dbs);
        name = dbs || "efwe"
      })
      .catch((err) => {
        console.error(err);
      });

    res.status(200).json({ status: true, message: "success", data: name });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
