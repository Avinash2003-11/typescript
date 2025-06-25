import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  originalName: String,
  s3Url: String,
}, { timestamps: true });

const FileModel = mongoose.model("File", fileSchema);
export default FileModel;