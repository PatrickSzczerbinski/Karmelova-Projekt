import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { errorHandler } from '../utils/error.js'

export const rejestracja = async (req, res, next) => {
	const { username, email, password } = req.body

	if (!username || !email || !password || username === '' || email === '' || password === '') {
		next(errorHandler(400, 'Wszystkie pola są wymagane'))
	}
	if (req.body.username) {
		if (req.body.username.length < 7 || req.body.username.length > 20) {
			return next(errorHandler(400, 'Nazwa użytkownika musi mieć między 7 a 20 znaków'))
		}
		if (req.body.username.indexOf(' ') !== -1) {
			return next(errorHandler(400, 'Nazwa użytkownika nie może zawierać spacji'))
		}
		if (!req.body.username.match(/^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/u)) {
			return next(errorHandler(400, 'Nazwa użytkownika może zawierać tylko litery i liczby'))
		}
	}
	if (req.body.password) {
		if (req.body.password.length < 6) {
			return next(errorHandler(400, 'Hasło musi mieć więcej niż 6 znaków'))
		}
		req.body.password = bcryptjs.hashSync(req.body.password, 10)
	}
	const existingUser = await User.findOne({ username: req.body.username })
	if (existingUser) {
		return next(errorHandler(400, 'Taki użytkownik już istnieje'))
	}
	const existingEmail = await User.findOne({ email: req.body.email })
	if (existingEmail) {
		return next(errorHandler(400, 'Ten adres e-mail już posiada konto'))
	}
	//Hasz na hasło za pomocą bcryptjs
	const hashedPassword = bcryptjs.hashSync(password, 10)
	const newUser = new User({
		username,
		email,
		password: hashedPassword,
	})
	const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET)
	try {
		// Zapis nowego usera w bazie
		await newUser.save()
		res.json({
			msg: 'Rejestracja pomyślna',
			token,
			newUser: {
				...newUser._doc,
				password: '',
			},
		})
	} catch (error) {
		next(error)
	}
}

export const logowanie = async (req, res, next) => {
	const { email, password } = req.body
	if (!email || !password || email === '' || password === '') {
		next(errorHandler(400, 'Wszystkie pola są wymagane'))
	}
	try {
		// Sprawdz, czy istnieje użytkownik o podanym adresie email
		const validUser = await User.findOne({ email })
		if (!validUser) {
			return next(errorHandler(404, 'Nie ma takiego użytkownika'))
		}
		// Sprawdzenie poprawności hasła użytkownika
		const validPassword = bcryptjs.compareSync(password, validUser.password)
		if (!validPassword) {
			return next(errorHandler(400, 'Błędne hasło'))
		}
		// Generuje token JWT dla poprawnego użytkownika
		const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET)
		// Usuwa hasło z obiektu użytkownika przed wysłaniem odpowiedzi
		const { password: pass, ...rest } = validUser._doc

		// 	res
		// .status(200)
		// .cookie('access_token', token, {
		//   httpOnly: true,
		// })
		// .json({
		//   msg: "Logowanie pomyślne!",
		//   token,
		//   validUser: {
		//     ...validUser._doc,
		//     password: "",
		//   },
		// });
		res
			.status(200)
			.cookie('access_token', token, {
				httpOnly: true,
			})
			.json({
				msg: 'Logowanie pomyślne!',
				...validUser._doc,
			})
	} catch (error) {
		next(error)
	}
}

export const refreshToken = async (req, res, next) => {
	try {
		const refreshToken = req.cookies.refresh_token
		if (!refreshToken) {
			throw errorHandler(401, 'Brak Refresh Tokena')
		}
		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
			if (err) {
				throw errorHandler(403, 'Nieprawidłowy Refresh Token')
			}
			const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
				expiresIn: '2h',
			})
			res.cookie('access_token', token, {
				httpOnly: true,
			})
			res.status(200).json({ success: true, message: 'Token odświeżony pomyślnie' })
		})
	} catch (error) {
		next(error)
	}
}

export const google = async (req, res, next) => {
	const { email, name, googlePhotoUrl } = req.body
	try {
		const user = await User.findOne({ email })
		if (user) {
			const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET)
			const { password, ...rest } = user._doc
			res
				.status(200)
				.cookie('access_token', token, {
					httpOnly: true,
				})
				.json(rest)
		} else {
			const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
			const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)
			const newUser = new User({
				username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
				email,
				password: hashedPassword,
				profilePicture: googlePhotoUrl,
			})
			await newUser.save()
			const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET)
			const { password, ...rest } = newUser._doc
			res
				.status(200)
				.cookie('access_token', token, {
					httpOnly: true,
				})
				.json(rest)
		}
	} catch (error) {
		next(error)
	}
}
