// src/services/s3Upload.ts
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { s3 } from "./s3client";

export const uploadToS3 = async (file: Express.Multer.File) => {
  const extension = file.originalname.split(".").pop();
  const key = `${uuid()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3.send(command);

  return {
    key,
    location: `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${key}`,
  };
};
