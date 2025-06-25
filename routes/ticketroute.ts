import express from 'express'
import { gettickets, ticket, updateTicket } from '../controllers/ticketcontroller'

const router = express.Router()

router.post('/ticket', ticket)
router.get("/tickets", gettickets)
router.put("/tickets/:id", updateTicket)
export default router