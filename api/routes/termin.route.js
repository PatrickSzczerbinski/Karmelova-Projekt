import express from 'express'
import {
	usunTermin,
	usunTerminUser,
	getZarezerwowaneTerminy,
	rezerwujTermin,
	sprawdzTermin,
	akceptujTermin,
	getZarezerwowaneTerminyUser,
} from '../controllers/termin.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()

router.post('/rezerwuj', verifyToken, rezerwujTermin)
router.get('/sprawdz', sprawdzTermin)
router.delete('/deletetermin/:terminId/:userId', verifyToken, usunTermin)
router.delete('/usuntermin/:terminId', verifyToken, usunTerminUser);
router.get('/zarezerwowane', verifyToken, getZarezerwowaneTerminy)
router.put('/akceptujtermin/:terminId', akceptujTermin)
router.get('/zarezerwowaneusera', verifyToken, getZarezerwowaneTerminyUser);

export default router
