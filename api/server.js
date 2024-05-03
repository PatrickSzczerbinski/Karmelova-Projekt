import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import nodemailer from 'nodemailer'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import postRoutes from './routes/post.route.js'
import terminRoutes from './routes/termin.route.js'
import obrazRoutes from './routes/obraz.route.js'
import sprawdzTerminRoutes from './routes/termin.route.js'
import commentRoutes from './routes/komentarz.route.js'

dotenv.config()
mongoose
	.connect(process.env.MONGO)
	.then(() => {
		console.log('Połączono z bazą MongoDB')
	})
	.catch(err => {
		console.log(err)
	})
const __dirname = path.resolve()
const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())
app.listen(3000, () => {
	console.log('Server działa na porcie:3000')
})
//Poczta
app.post('/api/email', async (req, res) => {
	const { from, to, subject, message } = req.body
	const formData = req.body
	const cleanedMessage = formData.message.replace(/<p>/g, '').replace(/<\/p>/g, '')

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		host: process.env.MAIL_SECRET,
		port: '587',
		secure: false,
		auth: {
			user: process.env.EMAIL_SECRET,
			pass: process.env.PASS_SECRET,
		},
	})
	const options = {
		from: `${formData.name} <${formData.email}>`,
		to: process.env.EMAIL_SECRET,
		subject: `**${subject}**`,
		text: `
        Wiadomość od: ${formData.name} <${formData.email}>
        Temat: ${subject}
        Treść wiadomości: ${cleanedMessage}`,
	}

	transporter.sendMail(options, function (error, info) {
		if (error) {
			console.error('Błąd podczas wysyłania e-maila:', error)
			res.status(500).json({ success: false, message: 'Wystąpił błąd podczas wysyłania e-maila' })
		} else {
			console.log('E-mail został wysłany:', info.response)
			res.json({ success: true, message: 'E-mail został wysłany pomyślnie' })
		}
	})
})
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/post', postRoutes)
app.use('/api/kalendarz', terminRoutes)
app.use('/api/kalendarz', sprawdzTerminRoutes)
app.use('/api/komentarz', commentRoutes)
app.use('/api/obraz', obrazRoutes)
app.use(express.static(path.join(__dirname, '/client/dist')))
// app.use(express.static(path.join(__dirname, 'client')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});
// Middleware obsługi błędów
app.use((err, req, res, next) => {
	console.error(err)
	const statusCode = err.statusCode || 500
	const message = err.message || 'Wewnętrzny błąd serwera'
	res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	})
})
