import express from "express";
import dotenv from 'dotenv';
import connectdb from "./config/db";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_req, res) => {
    console.log('GET / route hit');
    res.send('welcome to backend server');
});

const startServer = async () => {
  await connectdb();

  app.listen(port, () => {
    console.log(`server running on port ${port}`);
  });
};

startServer();
