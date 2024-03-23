import Post from '../models/post.model.js'
import { errorHandler } from '../utils/error.js'

export const create = async (req, res, next) => {
	if (!req.user.isAdmin) {
		return next(errorHandler(403, 'Nie możesz dodać postu'))
	}
	if (!req.body.title || !req.body.content) {
		return next(errorHandler(400, 'Wypełnij wszystkie pola'))
	}
	const slug = req.body.title
		.split(' ')
		.join('-')
		.toLowerCase()
		.replace(/[^a-zA-Z0-9-]/g, '')

	try {
		const existingPostTitle = await Post.findOne({ title: req.body.title })
		const existingPostSlug = await Post.findOne({ slug: slug })

		if (existingPostTitle) {
			return next(errorHandler(400, 'Taki tytuł postu już istnieje'))
		}
		if (existingPostSlug) {
			return next(errorHandler(400, 'Taki tytuł postu już istnieje'))
		}
		const newPost = new Post({
			...req.body,
			slug,
			userId: req.user.id,
		})
		const savedPost = await newPost.save()
		res.status(201).json(savedPost)
	} catch (error) {
		console.error('Błąd podczas tworzenia postu:', error)
		res.status(500).json({
			success: false,
			statusCode: 500,
			message: `Wewnętrzny błąd serwera podczas tworzenia postu. Szczegóły: ${error.message}`,
		})
	}
}

export const getposts = async (req, res, next) => {
	try {
		const startIndex = parseInt(req.query.startIndex) || 0
		const limit = parseInt(req.query.limit) || 9
		const sortDirection = req.query.order === 'asc' ? 1 : -1
		const posts = await Post.find({
			...(req.query.userId && { userId: req.query.userId }),
			...(req.query.category && { category: req.query.category }),
			...(req.query.slug && { slug: req.query.slug }),
			...(req.query.postId && { _id: req.query.postId }),
			...(req.query.searchTerm && {
				$or: [
					{ title: { $regex: req.query.searchTerm, $options: 'i' } },
					{ content: { $regex: req.query.searchTerm, $options: 'i' } },
				],
			}),
		})
			.sort({ updatedAt: sortDirection })
			.skip(startIndex)
			.limit(limit)
		const totalPosts = await Post.countDocuments()
		const now = new Date()
		const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
		const lastMonthPosts = await Post.countDocuments({
			createdAt: { $gte: oneMonthAgo },
		})
		res.status(200).json({
			posts,
			totalPosts,
			lastMonthPosts,
		})
	} catch (error) {
		console.error('Błąd podczas pobierania postów:', error)
		res.status(500).json({
			success: false,
			statusCode: 500,
			message: `Wewnętrzny błąd serwera podczas pobierania postów. Szczegóły: ${error.message}`,
		})
	}
}

export const deletepost = async (req, res, next) => {
	if (!req.user.isAdmin || req.user.id !== req.params.userId) {
		return next(errorHandler(403, 'Nie możesz usunąć tego postu'))
	}
	try {
		await Post.findByIdAndDelete(req.params.postId)
		res.status(200).json('Post został usunięty')
	} catch (error) {
		next(error)
	}
}

export const updatepost = async (req, res, next) => {
	if (!req.user.isAdmin || req.user.id !== req.params.userId) {
		return next(errorHandler(403, 'Nie możesz aktualizować tego postu'))
	}
	try {
		const updatedPost = await Post.findByIdAndUpdate(
			req.params.postId,
			{
				$set: {
					title: req.body.title,
					content: req.body.content,
					category: req.body.category,
					image: req.body.image,
				},
			},
			{ new: true }
		)
		res.status(200).json(updatedPost)
	} catch (error) {
		next(error)
	}
}
