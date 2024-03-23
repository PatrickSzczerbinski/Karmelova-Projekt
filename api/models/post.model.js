import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
			unique: true,
		},
		image: {
			type: String,
			default: 'https://lastrada.pl/wp-content/uploads/2023/03/tematyczna-impreza-firmowa.jpeg',
		},
		category: {
			type: String,
			default: 'Brak',
		},
		slug: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{ timestamps: true }
)

const Post = mongoose.model('Post', postSchema)

export default Post
