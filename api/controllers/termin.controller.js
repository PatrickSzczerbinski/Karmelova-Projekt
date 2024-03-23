import { errorHandler } from '../utils/error.js'
import Termin from '../models/termin.model.js'
import User from '../models/user.model.js'
import mongoose from 'mongoose'
// Kontroler do tworzenia rezerwacji terminu
export const rezerwujTermin = async (req, res, next) => {
	try {
		const { date, username, menuId, offerId } = req.body
		if (!username || !date || !menuId || !offerId) {
			return next(errorHandler(400, 'Proszę wybrać datę z wolnym terminem'))
		}
		const reservationsCount = await Termin.countDocuments({ username })
		const maxReservations = 5
		if (reservationsCount >= maxReservations) {
			return res.status(400).json({
				success: false,
				message: `Użytkownik ${username} już zarezerwował maksymalną ilość terminów (${maxReservations}).`,
			})
		}
		// Sprawdź, czy użytkownik już ma rezerwację w tym dniu
		const existingReservationForUserAndDate = await Termin.findOne({
			date,
			// username,
		})
		if (existingReservationForUserAndDate) {
			return res.status(400).json({
				success: false,
				message: 'Inny użytkownik już ma rezerwację na tę datę.',
			})
		}
		const userInfo = await User.findOne({ username })
		// Stwórz nową rezerwację
		const newReservation = new Termin({
			date,
			isReserved: true,
			accepted: false,
			username: userInfo.username,
			email: userInfo.email,
			profilePicture: userInfo.profilePicture,
			menuId,
			offerId,
		})
		await newReservation.save() // Zapis rezerwacji w bazie
		res.status(200).json({
			success: true,
			message: 'Rezerwacja zakończona sukcesem.',
		})
	} catch (error) {
		console.error('Błąd podczas rezerwacji:', error)
		res.status(500).json({
			success: false,
			statusCode: 500,
			message: `Wewnętrzny błąd serwera podczas rezerwacji. Szczegóły: ${error.message}`,
		})
	}
}

export const sprawdzTermin = async (req, res, next) => {
	try {
		const { date } = req.query
		const isReserved = await Termin.findOne({ date })
		res.json({ isReserved })
	} catch (error) {
		res.status(500).json({ message: 'Wewnętrzny błąd serwera' })
	}
}
// Kontroler do pobierania wszystkich terminów
export const getZarezerwowaneTerminy = async (req, res, next) => {
	try {
		const startIndex = parseInt(req.query.startIndex) || 0
		const limit = parseInt(req.query.limit) || 9
		const sortDirection = req.query.sort === 'asc' ? 1 : -1
		const terminy = await Termin.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit)
		const totalTerminy = await Termin.countDocuments()
		const now = new Date()
		const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
		const lastMonthTerminy = await Termin.countDocuments({
			createdAt: { $gte: oneMonthAgo },
		})
		res.status(200).json({
			terminy,
			totalTerminy,
			lastMonthTerminy,
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

export const getZarezerwowaneTerminyUser = async (req, res, next) => {
	try {
		const username = req.query.username
		if (!username) {
			throw new Error('Brak nazwy użytkownika')
		}
		const startIndex = parseInt(req.query.startIndex) || 0
		const limit = parseInt(req.query.limit) || 9
		const sortDirection = req.query.sort === 'asc' ? 1 : -1

		const terminyAll = await Termin.find({ username: username })
			.sort({ createdAt: sortDirection })
			.skip(startIndex)
			.limit(limit)
		const totalTerminy = await Termin.countDocuments({ username: username })
		const now = new Date()
		const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
		const ostatniMiesiacTerminy = await Termin.countDocuments({
			username: username,
			createdAt: { $gte: oneMonthAgo },
		})
		res.status(200).json({
			terminy: terminyAll,
			totalTerminy,
			ostatniMiesiacTerminy,
		})
	} catch (error) {
		console.error('Błąd podczas rezerwacji:', error)
		res.status(500).json({
			success: false,
			statusCode: 500,
			message: `Wewnętrzny błąd serwera podczas rezerwacji. Szczegóły: ${error.message}`,
		})
	}
}

export const usunTermin = async (req, res, next) => {
	try {
		const termin = await Termin.findById(req.params.terminId)
		if (!termin) {
			return next(errorHandler(404, 'Nie znaleziono terminu'))
		}
		if (termin.userId !== req.user.id && !req.user.isAdmin) {
			return next(errorHandler(403, 'Nie możesz usunąć tego terminu'))
		}
		await Termin.findByIdAndDelete(req.params.terminId)
		res.status(200).json({ message: 'Termin został usunięty' })
	} catch (error) {
		next(error)
	}
}

export const usunTerminUser = async (req, res, next) => {
	try {
		const termin = await Termin.findById(req.params.terminId)
		if (!termin) {
			return next(errorHandler(404, 'Nie znaleziono terminu'))
		}
		if (termin.username !== req.user.username) {
			return next(errorHandler(403, 'Nie możesz usunąć tego terminu'))
		}
		await Termin.findByIdAndDelete(req.params.terminId)
		res.status(200).json({ message: 'Termin został usunięty' })
	} catch (error) {
		next(error)
	}
}

export const akceptujTermin = async (req, res, next) => {
	try {
		const termin = await Termin.findById(req.params.terminId)
		if (!termin) {
			return next(errorHandler(404, 'Nie znaleziono terminu'))
		}
		if (termin.accepted) {
			return res.status(400).json({
				success: false,
				message: 'Termin został już zaakceptowany.',
			})
		}
		termin.accepted = true
		await termin.save()
		res.status(200).json({
			success: true,
			message: 'Termin został zaakceptowany.',
		})
	} catch (error) {
		next(error)
	}
}
