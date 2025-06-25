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