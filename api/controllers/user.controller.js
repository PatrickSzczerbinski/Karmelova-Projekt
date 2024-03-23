import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

export const updateUser = async (req, res, next) => {
	if (req.user.id !== req.params.userId) {
		return next(errorHandler(403, 'Nie można zaaktualizować tego użytkownika'))
	}
	if (req.body.username) {
		if (req.body.username.length < 7 || req.body.username.length > 20) {
			return next(errorHandler(400, 'Nazwa użytkownika musi mieć między 7 a 20 znaków'))
		}
		if (req.body.username.indexOf(' ') !== -1) {
			return next(errorHandler(400, 'Nazwa użytkownika nie może zawierać spacji'))
		}
		if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
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
		return next(errorHandler(400, 'Ta nazwa użytkownika jest już zajęta'))
	}
	try {
		const updatedUser = await User.findByIdAndUpdate(
			req.params.userId,
			{
				$set: {
					username: req.body.username,
					
					profilePicture: req.body.profilePicture,
					password: req.body.password,
				},
			},
			{ new: true }
		)
		const { password, ...rest } = updatedUser._doc
		res.status(200).json(rest)
	} catch (error) {
		next(error)
	}
}

export const deleteUser = async (req, res, next) => {
	if (!req.user.isAdmin && req.user.id !== req.params.userId) {
		return next(errorHandler(403, 'Nie możesz usunąć tego użytkownika'))
	}
	try {
		await User.findByIdAndDelete(req.params.userId)
		res.status(200).json('Użytkownik został usunięty')
	} catch (error) {
		next(error)
	}
}

export const signout = (req, res, next) => {
	try {
		res.clearCookie('access_token').status(200).json('Użytkownik został wylogowany')
	} catch (error) {
		next(error)
	}
}

export const pobierzUzytkownikow = async (req, res, next) => {
	if (!req.user.isAdmin) {
		return next(errorHandler(403, 'Nie możesz zobaczyć wszystkich użytkowników'))
	}
	try {
		const startIndex = parseInt(req.query.startIndex) || 0
		const limit = parseInt(req.query.limit) || 9
		const sortDirection = req.query.sort === 'asc' ? 1 : -1
		const uzytkownicy = await User.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit)
		const usersWithoutPassword = uzytkownicy.map(user => {
			const { password, ...rest } = user._doc
			return rest
		})
		const totalUzytkownicy = await User.countDocuments()
		const now = new Date()
		const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
		const lastMonthUzytkownicy = await User.countDocuments({
			createdAt: { $gte: oneMonthAgo },
		})
		res.status(200).json({
			uzytkownicy: usersWithoutPassword,
			totalUzytkownicy,
			lastMonthUzytkownicy,
		})
	} catch (error) {
		console.error('Błąd podczas pobierania użytkowników:', error)
		res.status(500).json({
			success: false,
			statusCode: 500,
			message: `Wewnętrzny błąd serwera podczas pobierania użytkowników. Szczegóły: ${error.message}`,
		})
	}
}

export const getUser = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.userId)
		if (!user) {
			return next(errorHandler(404, 'Nie znaleziono użytkownika'))
		}
		const { password, ...rest } = user._doc
		res.status(200).json(rest)
	} catch (error) {
		next(error)
	}
}

export const test = (req, res) => {
	res.json({ message: 'Uruchomiono API' })
}
