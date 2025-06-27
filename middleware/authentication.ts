import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const jwt_secret = process.env.JWT_SECRET || "default_secret";

// --- Create JWT ---
export const createJWT = (payload: Record<string, any>): string => {
  return jwt.sign(payload, jwt_secret, { expiresIn: "24h" });
};

// --- Send JWT in Cookie ---
export const sendTokenAsCookie = (res: Response, payload: Record<string, any>) => {
  const token = createJWT(payload);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};

// --- Middleware to Verify JWT ---
export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Authentication token missing" });
  }

  try {
    const decoded = jwt.verify(token, jwt_secret) as JwtPayload;
    (req as any).user = decoded; // ✅ Quick workaround for testing
    if (decoded.email !== "admin@gmail.com") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
