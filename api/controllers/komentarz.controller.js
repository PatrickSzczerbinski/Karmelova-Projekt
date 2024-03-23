import { errorHandler } from '../utils/error.js'
import Comment from '../models/komentarz.model.js'
import User from '../models/user.model.js'

export const createComment = async (req, res, next) => {
	try {
		const { userId, content, postId, username } = req.body
		if (userId !== req.user.id) {
			return next(errorHandler(403, 'Nie możesz utworzyć tego komentarza'))
		}
		const userInfo = await User.findById(userId)
		const newComment = new Comment({
			content,
			postId,
			userId,
			username: userInfo.username,
			profilePicture: userInfo.profilePicture,
		})
		await newComment.save()
		res.status(200).json(newComment)
	} catch (error) {
		next(error)
	}
}

export const getPostComments = async (req, res, next) => {
	try {
		const comments = await Comment.find({ postId: req.params.postId }).sort({
			createdAt: -1,
		})
		res.status(200).json(comments)
	} catch (error) {
		next(error)
	}
}

export const likeComment = async (req, res, next) => {
	try {
		const comment = await Comment.findById(req.params.commentId)
		if (!comment) {
			return next(errorHandler(404, 'Nie znaleziono komentarza'))
		}
		const userIndex = comment.likes.indexOf(req.user.id)
		if (userIndex === -1) {
			comment.numberOfLikes += 1
			comment.likes.push(req.user.id)
		} else {
			comment.numberOfLikes -= 1
			comment.likes.splice(userIndex, 1)
		}
		await comment.save()
		res.status(200).json(comment)
	} catch (error) {
		next(error)
	}
}

export const editComment = async (req, res, next) => {
	try {
		const comment = await Comment.findById(req.params.commentId)
		if (!comment) {
			return next(errorHandler(404, 'Nie znaleziono komentarza'))
		}
		if (comment.userId !== req.user.id && !req.user.isAdmin) {
			return next(errorHandler(403, 'Nie możesz edytować tego komentarza'))
		}
		const editedComment = await Comment.findByIdAndUpdate(
			req.params.commentId,
			{
				content: req.body.content,
			},
			{ new: true }
		)
		res.status(200).json(editedComment)
	} catch (error) {
		next(error)
	}
}

export const getComments = async (req, res, next) => {
	if (!req.user.isAdmin) return next(errorHandler(403, 'Nie możesz pobrać wszystkich komentarzy'))
	try {
		const startIndex = parseInt(req.query.startIndex) || 0
		const limit = parseInt(req.query.limit) || 9
		const sortDirection = req.query.sort === 'desc' ? -1 : 1
		const comments = await Comment.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit)
		const totalComments = await Comment.countDocuments()
		const now = new Date()
		const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
		const lastMonthComments = await Comment.countDocuments({
			createdAt: { $gte: oneMonthAgo },
		})
		res.status(200).json({ comments, totalComments, lastMonthComments })
	} catch (error) {
		console.error('Błąd podczas pobierania użytkowników:', error)
		res.status(500).json({
			success: false,
			statusCode: 500,
			message: `Wewnętrzny błąd serwera podczas pobierania użytkowników. Szczegóły: ${error.message}`,
		})
	}
}

export const deleteComment = async (req, res, next) => {
	try {
		const comment = await Comment.findById(req.params.commentId)
		if (!comment) {
			return next(errorHandler(404, 'Nie znaleziono komentarza'))
		}
		if (comment.userId !== req.user.id && !req.user.isAdmin) {
			return next(errorHandler(403, 'Nie możesz usunąć tego komentarza'))
		}
		await Comment.findByIdAndDelete(req.params.commentId)
		res.status(200).json('Komentarz został usunięty')
	} catch (error) {
		next(error)
	}
}
