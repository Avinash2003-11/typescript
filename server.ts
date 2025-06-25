import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectdb from "./config/db"; // Make sure this exists
import authRoutes from "./routes/userRoutes"; // Adjust path as needed
import { uploadFile } from "./controllers/file.controller"
import fileroutes from "./routes/file.routes"
import { loginUser, registerUser } from "./controllers/userController";
import ticketroute from './routes/ticketroute'
import { updateTicket } from "./controllers/ticketcontroller";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // Adjust to match your frontend origin
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.post("/login", loginUser);
app.post("/register", registerUser)
app.use("/api/files", fileroutes);
app.post("/upload", uploadFile)
app.post('/ticket', ticketroute)
app.get("/tickets", ticketroute)
app.put("/tickets/:id", ticketroute)
// Root route
app.get("/", (_req, res) => {
  res.send("Welcome to the backend server!");
});

// Start server
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
