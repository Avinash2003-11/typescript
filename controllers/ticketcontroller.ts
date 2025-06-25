import { Request, Response } from "express";
import ticketmodel from "../models/ticket";

export const ticket = async (req: Request, res: Response) => {
  const { name, employeeId, problem } = req.body;

  try {
    if (!name || !employeeId || !problem) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const newticket = new ticketmodel({
      name,
      employeeId,
      problem,
      ticketCreatedAt: new Date()
    });

    await newticket.save(); // ✅ fix here
    res.status(200).json({ message: "Ticket created",
        ticket:{
            name: newticket.name,
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