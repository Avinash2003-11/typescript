// src/controllers/uploadController.ts
import { Request, Response } from "express";
import { uploadToS3 } from "../utils/s3upload";
export const uploadFileController = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const result = await uploadToS3(file);
    return res.status(200).json({ success: true, fileUrl: result.location });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Upload failed" });
  }
};

