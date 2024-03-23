import jwt from 'jsonwebtoken'
import { errorHandler } from './error.js'

export const verifyToken = (req, res, next) => {
	// Pobranie tokena z ciasteczka o nazwie "access_token" z żądania
	console.log('Wykonano weryfikację oprogramowania pośredniego tokenu')
	const token = req.cookies.access_token
	if (!token) {
		return next(errorHandler(401, 'Brak autoryzacji - Brak tokena'))
	}
	// Weryfikacja tokenu JWT
	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) {
			return next(errorHandler(401, 'Błąd weryfikacji tokena JWT'))
		}
		req.user = user // Przypisanie danych użytkownika do obiektu żądania (req.user)
		next()
	})
}
