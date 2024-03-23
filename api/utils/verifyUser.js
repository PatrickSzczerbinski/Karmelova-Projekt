import jwt from 'jsonwebtoken'
import { errorHandler } from './error.js'

export const generateToken = user => {
	return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' }) // Token ważny przez 1 godzinę
}

export const verifyToken = (req, res, next) => {
	// Sprawdź czy istnieje obiekt cookies w żądaniu i czy zawiera access_token
	if (!req.cookies || !req.cookies.access_token) {
		return next(errorHandler(401, 'Brak autoryzacji - Zaloguj się ponownie'))
	}

	// Pobierz token z ciasteczka
	const token = req.cookies.access_token

	// Weryfikacja tokenu JWT
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
	// Usunięcie ciasteczka przechowującego token
	res.clearCookie('access_token')
	next()
}
// export const verifyToken = (req, res, next) => {
// 	// Pobranie tokena z ciasteczka o nazwie "access_token" z żądania
// 	console.log('Wykonano weryfikację oprogramowania pośredniego tokenu')
// 	const token = req.cookies.access_token
// 	if (!token) {
// 		return next(errorHandler(401, 'Brak autoryzacji - Zaloguj się ponownie'))
// 	}
// 	// Weryfikacja tokenu JWT
// 	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
// 		if (err) {
// 			return next(errorHandler(401, 'Błąd weryfikacji tokena JWT'))
// 		}
// 		req.user = user // Przypisanie danych użytkownika do obiektu żądania (req.user)
// 		next()
// 	})
// }
