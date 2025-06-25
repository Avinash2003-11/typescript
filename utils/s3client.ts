import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS!,
  },
  region: process.env.AWS_REGION!,
  endpoint: process.env.AWS_ENDPOINT, // Optional, if you are using a custom endpoint
  forcePathStyle: false, // Use path-style URLs for S3
  // This is useful for local S3-compatible services like MinIO

});

export const s3UploadFile = async (file: Express.Multer.File) => {
  const fileExtension = file.originalname.split(".").pop();
  const key = `${uuid()}.${fileExtension}`;
  
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const result = await s3.send(new PutObjectCommand(uploadParams));

  // Manually construct the URL
  const fileUrl = `https://${uploadParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return {
    ...result,
    Location: fileUrl,
  };

}; 

