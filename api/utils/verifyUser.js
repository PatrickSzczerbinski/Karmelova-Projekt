import jwt from 'jsonwebtoken'
import { errorHandler } from './error.js'

export const generateToken = user => {
	return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' }) // Token ważny przez 1 godzinę
}

export const verifyToken = (req, res, next) => {
	if (!req.cookies || !req.cookies.access_token) {
		return next(errorHandler(401, 'Brak autoryzacji - Zaloguj się ponownie'))
	}
	const token = req.cookies.access_token
	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) {
			return next(errorHandler(401, 'Błąd weryfikacji tokena JWT'))
		}
		req.user = user
		next()
	})
}

export const verifyTokenMiddleware = token => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				reject(err)
			} else {
				resolve(decoded)
			}
		})
	})
}
// Middleware do wylogowania użytkownika
export const logoutMiddleware = (req, res, next) => {
	res.clearCookie('access_token')
	next()
}
