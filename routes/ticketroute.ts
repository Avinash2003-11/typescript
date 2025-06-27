import express from 'express'
import {  ticket,  } from '../controllers/ticketcontroller'

const router = express.Router()

router.post('/ticket', ticket)

export default router