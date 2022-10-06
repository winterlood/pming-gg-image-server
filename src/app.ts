import express, { Request, Response, NextFunction } from "express";
import path from "path";
import multer from "multer";
import { storageEngine } from "multer-google-storage";

const uploadHandler = multer({
  storage: storageEngine({
    autoRetry: true,
    bucket: "pming",
    projectId: "delta-discovery-279706",
    keyFilename: path.join(
      __dirname,
      "./secure/delta-discovery-279706-05f98f12cbb3.json"
    ),
    filename: (req: any, file: any, cb: any) => {
      console.log(file);
      cb(null, `pming-gg-image/${Date.now()}`);
    },
  }),
});

const app = express();
app.use(express.static("view"));

const template = path.join(__dirname, "./view", "index.html");
app.get("/pmingg/test", (req: Request, res: Response) => {
  res.sendFile(template);
});

app.post(
  "/pmingg/upload",
  uploadHandler.single("image"),
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        throw new Error();
      }
      const uploadedFile = req.file as unknown as {
        encoding: string;
        fieldname: string;
        filname: string;
        mimetype: string;
        originalname: string;
        path: string;
      };
      res.send({
        filename: uploadedFile.fieldname,
        path: uploadedFile.path,
      });
    } catch (err) {
      return res.status(400).send({
        message: "Bad Request",
      });
    }
  }
);

app.listen("1234", () => {
  console.log(`
  ################################################
  🛡️  Server listening on port: 1234🛡️
  ################################################
`);
});
