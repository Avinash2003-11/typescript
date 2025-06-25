import express from 'express'
import { gettickets, ticket } from '../controllers/ticketcontroller'

const router = express.Router()

router.post('/ticket', ticket)
router.get("/tickets", gettickets)
export default router