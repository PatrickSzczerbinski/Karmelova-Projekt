
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
// ReactQuill - edytor tekstu
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { useEffect, useState } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function UpdatePost() {
	const { currentUser } = useSelector(state => state.user)
	const [file, setFile] = useState(null)
	const [imageUploadProgress, setImageUploadProgress] = useState(null)
	const [imageUploadError, setImageUploadError] = useState(null)
	const [formData, setFormData] = useState({
		title: '',
		category: 'Brak',
		content: '',
	})
	const [publishError, setPublishError] = useState(null)
	const { postId } = useParams()
	const navigate = useNavigate()

	useEffect(() => {
		const fetchPost = async () => {
			try {
				const res = await fetch(`/api/post/getposts?postId=${postId}`)
				const data = await res.json()

				if (res.ok) {
					setPublishError(null)
					setFormData(data.posts[0])
				} else {
					console.log(data.message)
					setPublishError(data.message)
				}
			} catch (error) {
				console.log(error.message)
			}
		}
		fetchPost()
	}, [postId])

	const handleUploadImage = async () => {
		try {
			if (!file) {
				setImageUploadError('Wybierz obraz')
				return
			}

			setImageUploadError(null)
			const storage = getStorage(app)
			const fileName = new Date().getTime() + '-' + file.name
			const storageRef = ref(storage, fileName)
			const uploadTask = uploadBytesResumable(storageRef, file)

			uploadTask.on('state_changed', snapshot => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
				setImageUploadProgress(progress.toFixed(0))
			})

			await uploadTask

			const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
			setImageUploadProgress(null)
			setImageUploadError(null)
			setFormData({ ...formData, image: downloadURL })
		} catch (error) {
			setImageUploadError('Przesyłanie obrazu nie powiodło się')
			setImageUploadProgress(null)
			console.log(error)
		}
	}

	const handleSubmit = async e => {
		e.preventDefault()
		try {
			const res = await fetch(`/api/post/updatepost/${postId}/${currentUser._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			})
			const data = await res.json()
			if (!res.ok) return setPublishError(data.message)
			setPublishError(null)
			navigate(`/post/${data.slug}`)
		} catch (error) {
			setPublishError('Coś poszło nie tak')
		}
	}

	return (
		<div className='p-3 max-w-3xl mx-auto min-h-screen'>
			<h1 className='text-center text-4xl my-8 font-semibold'>Edytuj Post</h1>
			<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
				<div className='flex flex-col gap-4 sm:flex-row justify-between mt-2'>
					<TextInput
						type='text'
						placeholder='Tytuł postu'
						required
						id='title'
						className='flex-1 '
						onChange={e => setFormData({ ...formData, title: e.target.value })}
						value={formData.title}
					/>
					<Select
						className=''
						onChange={e => setFormData({ ...formData, category: e.target.value })}
						value={formData.category}>
						<option value='Brak'>Wybierz kategorię</option>
						<option value='Informacja'>Informacja</option>
						<option value='Oferta'>Oferta</option>
						<option value='Wolne terminy'>Wolne terminy</option>
						<option value='Nowość'>Nowość</option>
					</Select>
				</div>
				<div className='flex gap-4 items-center justify-between border-4 border-teal-500  p-3 border-double'>
					<FileInput type='file' accept='image/*' onChange={e => setFile(e.target.files[0])} />
					<Button
						type='button'
						gradientDuoTone='purpleToBlue'
						size='md'
						outline
						onClick={handleUploadImage}
						disabled={imageUploadProgress}>
						{imageUploadProgress ? (
							<div className='w-16 h-16'>
								<CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
							</div>
						) : (
							'Dodaj zdjęcie'
						)}
					</Button>
				</div>
				{imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
				{formData.image && <img src={formData.image} alt='Przesłano' className='w-full h-72 object-cover' />}
				<ReactQuill
					value={formData.content}
					theme='snow'
					placeholder='Dodaj opis...'
					className='h-80 mt-4'
					required
					onChange={value => setFormData({ ...formData, content: value })}
				/>
				<Button type='submit' gradientDuoTone='purpleToBlue' className='mt-12' outline>
					Edytuj
				</Button>
				{publishError && (
					<Alert className='mt-5' color='failure'>
						{publishError}
					</Alert>
				)}
			</form>
		</div>
	)
}
