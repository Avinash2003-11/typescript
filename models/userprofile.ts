// models/UserProfile.ts

import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  bio: { type: String, default: "" },
  avatar: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("UserProfile", userProfileSchema);
