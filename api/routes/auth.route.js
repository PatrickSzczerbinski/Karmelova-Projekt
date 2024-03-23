import express from 'express'
import { google, logowanie, rejestracja, refreshToken } from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/rejestracja', rejestracja)
router.post('/logowanie', logowanie)
router.post('/google', google) //Logowanie-Google
router.post('/refresh', refreshToken)

export default router 
