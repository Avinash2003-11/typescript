// src/routes/uploadRoutes.ts
import express from "express";
import multer from "multer";
import { uploadFileController } from "../controllers/file.controller";

const router = express.Router();
const upload = multer(); // In-memory storage

router.post("/upload", upload.single("file"), uploadFileController);

export default router;
