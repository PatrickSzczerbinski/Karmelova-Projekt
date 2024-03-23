import mongoose from 'mongoose'

const terminSchema = new mongoose.Schema(
	{
		date: {
			type: Date,
			required: true,
		},
		isReserved: {
			type: Boolean,
			default: true,
		},
		accepted: {
            type: Boolean,
            default: false,
        },
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		profilePicture: {
			type: String,
			default: 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
		},
		menuId: {
			type: String,
		},
		offerId: {
			type: String,
		},
	},
	{ timestamps: true }
)

const Termin = mongoose.model('Termin', terminSchema)

export default Termin
