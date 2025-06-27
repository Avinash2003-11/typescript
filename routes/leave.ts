import express from 'express';
import { applyLeave, deleteLeaveByEmail } from '../controllers/leavecontroller';

const router = express.Router()

router.post("/apply", applyLeave)

router.delete("/delete", deleteLeaveByEmail)

export default router;
