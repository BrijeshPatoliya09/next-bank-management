import fs from "fs";

export default async (req, res) => {
  try {
    console.log(req.body);
    fs.unlink(`public${req.body}`, (err) => {
      return res
        .status(404)
        .json({ status: false, message: "Image not found" });
    });
    res
      .status(200)
      .json({ status: true, message: "Image removed successfuly" });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: false, message: "Somehing went wrong" });
  }
};
