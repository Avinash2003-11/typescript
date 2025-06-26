import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userSchema';
import { sendTokenAsCookie } from '../middleware/authentication'; 
import { hash } from '../utils/hashpassword';
import { compare } from '../utils/hashpassword';
import { transporter } from '../utils/mailer';
import userprofile from '../models/userprofile'

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    sendTokenAsCookie(res, { id: user._id });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, confirmpassword, department } = req.body;

  try {
    if (!name || !email || !password || !confirmpassword || !department) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    if (password !== confirmpassword) {
      res.status(400).json({ message: 'Passwords do not match' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    const hashedPassword = await hash(password);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      department,
    });

    await newUser.save();

    const profile = new userprofile({
      userId: newUser._id,
      name: newUser.name,
      email: newUser.email,
      department: newUser.department,
    });

    await profile.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: 'Your Profile Details',
      text: `Your profile details:\nName: ${newUser.name}\nEmail: ${newUser.email}\nDepartment: ${newUser.department}\nUser ID: ${newUser._id}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        department: newUser.department
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};


export const getusers = async(req:Request, res: Response) =>{
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ users })
  } catch (error) {
    res.status(500).json({message: "error fetching details", error: (error as Error).message})
  }
};

export const updateUserByName = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.params;
  const { email, department } = req.body;

  try {
    const user = await User.findOne({ name });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (email) user.email = email.toLowerCase();
    if (department) user.department = department;
    await user.save();

    const profile = await userprofile.findOne({ userId: user._id });
    if (profile) {
      if (email) profile.email = email.toLowerCase();
      if (department) profile.department = department;
      await profile.save();
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your profile has been updated',
      text: `Hello ${user.name},\n\nYour profile has been successfully updated.\n\nUpdated Details:\nName: ${user.name}\nEmail: ${user.email}\nDepartment: ${user.department}\n\nThank you.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'User and profile updated successfully',
      updatedUser: {
        name: user.name,
        email: user.email,
        department: user.department,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};