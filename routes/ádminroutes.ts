import express from "express";
import {
  adminlogin,
  gettickets,
  updateTicket,
  getAllLeaves,
  getUserLeaves,
  updateLeaveStatusByEmail,
} from "../controllers/admincontroller";

import { verifyJWT } from "../middleware/authentication";
import { isadmin } from "../middleware/isadmin";

const router = express.Router();

// ✅ Public route for admin login
router.post('/adminlogin', adminlogin);

// ✅ Protect all below routes
router.use(verifyJWT, isadmin);

// 🔐 Admin-only routes
router.get('/tickets', gettickets);
router.put('/tickets/:id', updateTicket);

router.get('/leaves', getAllLeaves);
router.get('/leaves/:userId', getUserLeaves);
router.put('/leaves/update', updateLeaveStatusByEmail);

export default router;
