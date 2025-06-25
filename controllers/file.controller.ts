import { Request, Response } from "express";
import { s3UploadFile } from "../utils/s3client";
import FileModel from "../models/file";


export const uploadFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const file = (req as Request & { file?: Express.Multer.File }).file;

  if (!file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  try {
    const s3Result = await s3UploadFile(file); // upload to S3

    const savedFile = await FileModel.create({
      originalName: file.originalname,
      s3Url: s3Result.Location,
    });

    res.status(200).json(savedFile);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
};