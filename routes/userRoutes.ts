import express from "express";
import { loginUser, registerUser, getusers, updateUserByName } from "../controllers/userController";


const router = express.Router()

router.post('/login', loginUser);
router.post('/register', registerUser)
router.get('/users', getusers)
router.put('/update/:name', updateUserByName)

export default router;