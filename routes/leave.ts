import express from 'express';
import { applyLeave, getUserLeaves, getAllLeaves, updateLeaveStatusByEmail, deleteLeaveByEmail } from '../controllers/leavecontroller';
import { getusers } from '../controllers/userController';
const router = express.Router()

router.post("/apply", applyLeave)
router.get("/all", getAllLeaves)
router.put('/update-by-email', updateLeaveStatusByEmail)
router.delete("/delete", deleteLeaveByEmail)

export default router;
