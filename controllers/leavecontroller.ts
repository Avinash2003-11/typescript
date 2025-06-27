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