import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import { przeslijObraz, getObraz, usunObraz } from '../controllers/obraz.controller.js'

const router = express.Router()

router.post('/przeslijObraz', verifyToken, przeslijObraz)
router.get('/pobierzObraz', getObraz)
router.delete('/usunObraz/:obrazId/:userId', verifyToken, usunObraz)

export default router
