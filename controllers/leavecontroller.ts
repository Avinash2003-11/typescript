import { Request, Response } from 'express';
import LeaveRequest from '../models/leaverequests';
import User from '../models/userSchema';
import { transporter } from '../utils/mailer';
import { text } from 'stream/consumers';

export const applyLeave = async (req: Request, res: Response) => {
  try {
    const { userId, email, fromDate, toDate, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User ID not found. Please register." });
    }

    const leave = await LeaveRequest.create({ userId, email, fromDate, toDate, reason });

    // ✅ Mail logic moved inside the try block after successful leave creation
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Leave Application Details',
      text: `Leave for User ID: ${userId} has been applied successfully from ${fromDate} to ${toDate}. Reason: ${reason}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Leave applied successfully', leave });
  } catch (error) {
    res.status(500).json({ message: 'Error applying for leave', error });
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

  export const deleteLeaveByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the most recent leave (or adjust logic to delete specific one)
    const deleted = await LeaveRequest.findOneAndDelete({ userId: user._id });

    if (!deleted) {
      return res.status(404).json({ message: 'No leave request found for this user' });
    }

    res.status(200).json({ message: 'Leave request deleted successfully', deleted });
    const mailsent = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "deleting leave request",
      text: "your leave request has been deleted successfully"
    }
    await transporter.sendMail(mailsent)
  } catch (error) {
    console.error('Error deleting leave:', error);
    res.status(500).json({ message: 'Error deleting leave request', error });
  }
};