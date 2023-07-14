import fs from "fs";

export default async (req, res) => {
  try {
    fs.unlink(`public${req.body}`, (err) => {
      if (err) {
        console.log("err: ", err);
        return res
          .status(404)
          .json({ status: false, message: "Image not found" });
      }
    });
    res
      .status(200)
      .json({ status: true, message: "Image removed successfuly" });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Somehing went wrong" });
  }
};
