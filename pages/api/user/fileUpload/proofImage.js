import nextConnect from "next-connect";
import multer from "multer";
import dbConnect from "../../../../helper/connection";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

const apiRoute = nextConnect();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "/public/assets/image/user"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadMiddleware = upload.single("file");

apiRoute.use(uploadMiddleware);

apiRoute.post(async (req, res) => {
  await dbConnect();

  const fileName = req.file.filename;
  res.status(200).json({ data: "success", imgUrl: fileName });
});

export default apiRoute;
