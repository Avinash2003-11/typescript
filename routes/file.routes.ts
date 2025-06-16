import express from "express";
import multer from "multer";
import { uploadFile } from "../controllers/file.controller";

const router = express.Router();

// Use memory storage for direct upload to S3
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/files/upload
router.post("/upload", upload.single("file"), uploadFile);

export default router;
