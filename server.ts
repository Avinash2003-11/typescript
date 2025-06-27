import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectdb from "./config/db"; // Make sure this exists
import authRoutes from "./routes/userRoutes"; // Adjust path as needed
import { getusers, loginUser, registerUser, updateUserByName } from "./controllers/userController";
import ticketroute from './routes/ticketroute'
import adminroutes from './routes/ádminroutes'


import { applyLeave,deleteLeaveByEmail, } from "./controllers/leavecontroller";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:3000", // Adjust to match your frontend origin
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.post("/login", loginUser);
app.post("/register", registerUser)
app.get("/users", getusers)
app.put('/update/:name',updateUserByName)
app.post('/ticket', ticketroute)

app.post('/apply', applyLeave)
app.get('/leaves', getusers)

app.delete("/delete", deleteLeaveByEmail)
app.use("/api", adminroutes)


app.get("/", (_req, res) => {
  res.send("Welcome to the backend server!");
});


const startServer = async () => {
  try {
    await connectdb(); // Ensure MongoDB is connected before starting server
    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

startServer();
