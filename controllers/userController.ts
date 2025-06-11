import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userSchema';
import { sendTokenAsCookie } from '../middleware/authentication'; // Reuse your utility

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

    const isMatch = await bcrypt.compare(password, user.password);
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
  const { name, email, password, confirmpassword } = req.body;

  try {
    // Basic validation
    if (!name || !email || !password || !confirmpassword) {
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();

    sendTokenAsCookie(res, { id: newUser._id });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};
