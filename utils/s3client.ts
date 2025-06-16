import AWS from "aws-sdk";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS!,
  },
  region: process.env.AWS_REGION,
});

export const s3UploadFile = (file: Express.Multer.File) => {
  const fileExtension = file.originalname.split(".").pop();
  const key = `${uuid()}.${fileExtension}`;

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  return s3.upload(uploadParams).promise();
};
