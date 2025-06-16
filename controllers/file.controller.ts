import { Request, Response } from "express";
import { s3UploadFile } from "../utils/s3client";
import FileModel from "../models/file";

interface MulterRequest extends Request {
  file: Express.Multer.File;
}

export const uploadFile = async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const s3Result = await s3UploadFile(req.file);

    const savedFile = await FileModel.create({
      originalName: req.file.originalname,
      s3Url: s3Result.Location,
    });

    return res.status(200).json(savedFile);
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Failed to upload file" });
  }
};
