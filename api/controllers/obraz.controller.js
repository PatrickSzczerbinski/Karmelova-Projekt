import { errorHandler } from '../utils/error.js'
import Image from '../models/obraz.model.js'

export const przeslijObraz = async (req, res, next) => {
	if (!req.user.isAdmin) {
		return next(errorHandler(403, 'Nie możesz dodać postu'))
	}
	const newObraz = new Image({
		...req.body,
		userId: req.user.id,
	})
	try {
		const savedObraz = await newObraz.save()
		res.status(200).json(savedObraz)
	} catch (error) {
		next(error)
	}
}

export const getObraz = async (req, res, next) => {
	try {
		const obrazy = await Image.find({
			...(req.query.userId && { userId: req.query.userId }),
		})
		const totalImages = await Image.countDocuments()
		const now = new Date()
		const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
		res.status(200).json({
			obrazy,
			totalImages,
		})
	} catch (error) {
		next(error)
	}
}

export const usunObraz = async (req, res, next) => {
	if (!req.user.isAdmin || req.user.id !== req.params.userId) {
		return next(errorHandler(403, 'Nie możesz usunąć tego postu'))
	}
	try {
		await Image.findByIdAndDelete(req.params.obrazId)
		res.status(200).json('Post został usunięty')
	} catch (error) {
		next(error)
	}
}
