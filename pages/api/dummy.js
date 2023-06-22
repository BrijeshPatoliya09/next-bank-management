export default async (req, res) => {
  try {
    setInterval(() => {
      res.status(200).json({
        status: true,
        message: "Admin session destroyed",
      });
    }, 1000);
  } catch (error) {
    console.log(error);
    res.status(404).json({ status: false, message: "Something went wrong" });
  }
};
