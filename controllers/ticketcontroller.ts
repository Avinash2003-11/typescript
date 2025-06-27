import { Request, Response } from "express";
import ticketmodel from "../models/ticket";
import { transporter } from "../utils/mailer";

export const ticket = async (req: Request, res: Response) => {
  const { name, employeeId, problem, email } = req.body;

  try {
    if (!name || !employeeId || !problem || !email) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const newticket = new ticketmodel({
      name,
      email,
      employeeId,
      problem,
      ticketCreatedAt: new Date()
    });

    const mailoptions = {
        from : process.env.EMAIL_USER,
        to: email,
        subject: 'ticket raising confirmation',
        text: `Hi ${name},\n\nYour ticket has been created successfully.\n\nDetails:\n- Problem: ${problem}\n- Ticket ID: ${newticket._id}\n\nWe will get back to you soon.`
    };
    await transporter.sendMail(mailoptions)

    await newticket.save(); // ✅ fix here
    res.status(200).json({ message: "Ticket created",
        ticket:{
            name: newticket.name,
            email:  newticket.email,
            employeeId: newticket.employeeId,
            problem: newticket.problem,
            ticketCreatedAt: newticket.ticketcreatedat

        }

     });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Ticket creation failed" });
  }
};



