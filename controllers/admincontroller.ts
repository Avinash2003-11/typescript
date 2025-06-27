import { Request, Response } from "express";
import User from "../models/userSchema";
import { sendTokenAsCookie } from "../middleware/authentication";
import { compare } from '../utils/hashpassword';
import ticketmodel from "../models/ticket";
import LeaveRequest from "../models/leaverequests";
import { transporter } from "../utils/mailer";

export const adminlogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email !== 'admin@gmail.com') {
    return res.status(403).json({ message: "Access denied: Admin only" });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Password does not match" });
  }

  const payload = { id: user._id, email: user.email, role: 'admin' };
  sendTokenAsCookie(res, payload);

  res.status(200).json({ message: "Admin login successful" });
};


export const gettickets = async(req:Request, res:Response) =>{
    try {
        const tickets = await ticketmodel.find()
        if(!ticketmodel || tickets.length == 0){
            return res.status(404).json({message:"no tickets found"})
        }
        res.status(200).json(tickets)
    } catch (error) {
        console.error("error fetching ticket", error)
        res.status(400).json({message:"failed to retrive tickets"})
    }
}

export const updateTicket = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, employeeId, problem } = req.body;

  try {
    const updatedTicket = await ticketmodel.findByIdAndUpdate(
      id,
      { name, employeeId, problem },
      { new: true, runValidators: true } 
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({
      message: "Ticket updated successfully",
      ticket: updatedTicket,
    });

    
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ message: "Failed to update ticket" });
  }
};

export const getUserLeaves = async (req: Request, res: Response) => {
  try {
    const leaves = await LeaveRequest.find({ userId: req.params.userId });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user leaves', error });
  }
};

export const getAllLeaves = async (req: Request, res: Response) => {
  try {
    const leaves = await LeaveRequest.find().populate('userId', 'name email');
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all leaves', error });
  }
};

 export const updateLeaveStatusByEmail = async (req: Request, res: Response) => {
  try {
    const { email, status,remarks } = req.body;

    // 1. Find the user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Find their most recent leave request (or customize this logic)
    const leave = await LeaveRequest.findOne({ userId: user._id }).sort({ createdAt: -1 });

    if (!leave) {
      return res.status(404).json({ message: 'No leave request found for this user' });
    }

    // 3. Update the leave status
    leave.status = status;
    leave.remarks = remarks;
    await leave.save();

    res.status(200).json({ message: 'Leave status updated successfully', leave });

    const mailsend = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "updated leave details",
      text: `your leave status have been updated by admin. status: ${status}, remarks: ${remarks}`
    }
    await transporter.sendMail(mailsend)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating leave status', error });
  }
};
