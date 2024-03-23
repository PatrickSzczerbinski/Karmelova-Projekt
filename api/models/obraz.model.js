import mongoose from 'mongoose'

const obrazSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			
		},
		
	},
	{ timestamps: true }
)

const Image = mongoose.model('Image', obrazSchema)

export default Image
