import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
		},
		postId: {
			type: String,
			required: true,
		},
		userId: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		profilePicture: {
			type: String,
			default: 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
		},
		likes: {
			type: Array,
			default: [],
		},
		numberOfLikes: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
)

const Comment = mongoose.model('Comment', commentSchema)

export default Comment
