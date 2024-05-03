import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import {
	updateStart,
	updateSuccess,
	updateFailure,
	deleteUserStart,
	deleteUserSuccess,
	deleteUserFailure,
} from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function DashProfile() {
	const { currentUser, loading } = useSelector(state => state.user)
	const [imageFile, setImageFile] = useState(null)
	const [imageFileUrl, setImageFileUrl] = useState(null)
	const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
	const [imageFileUploadError, setImageFileUploadError] = useState(null)
	const [imageFileUploading, setImageFileUploading] = useState(false)
	const [success, setSuccess] = useState(null)
	const [error, setError] = useState(null)
	const [showModal, setShowModal] = useState(false)
	const [formData, setFormData] = useState({})
	const filePickerRef = useRef()
	const dispatch = useDispatch()
	const handleImageChange = e => {
		const file = e.target.files[0]
		if (file) {
			setImageFile(file)
			setImageFileUrl(URL.createObjectURL(file))
		}
	}
	useEffect(() => {
		if (imageFile) {
			uploadImage()
		}
	}, [imageFile])

console.log('currentUser:', currentUser);

	const uploadImage = async () => {
		setImageFileUploading(true)
		setImageFileUploadError(null)
		const storage = getStorage(app)
		const fileName = new Date().getTime() + imageFile.name
		const storageRef = ref(storage, fileName)
		const uploadTask = uploadBytesResumable(storageRef, imageFile)
		uploadTask.on(
			'state_changed',
			snapshot => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

				setImageFileUploadProgress(progress.toFixed(0))
			},
			// eslint-disable-next-line no-unused-vars
			error => {
				setImageFileUploadError('Plik musi mieć mniej niż 2MB')
				setImageFileUploadProgress(null)
				setImageFile(null)
				setImageFileUrl(null)
				setImageFileUploading(false)
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
					setImageFileUrl(downloadURL)
					setFormData({ ...formData, profilePicture: downloadURL })
					setImageFileUploading(false)
				})
			}
		)
	}

	const handleChange = e => {
		setFormData({ ...formData, [e.target.id]: e.target.value })
	}

	const handleSubmit = async e => {
		e.preventDefault()
		setError(null)
		setSuccess(null)
		if (Object.keys(formData).length === 0) {
			setError('Nie wprowadzono żadnych zmian')
			return
		}
		if (imageFileUploading) {
			setError('Poczekaj na załadowanie obrazu')
			return
		}
		try {
			dispatch(updateStart())
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			})
			const data = await res.json()
			if (!res.ok) {
				dispatch(updateFailure(data.message))
				setError(data.message)
				setTimeout(() => {
					setError(null)
				}, 4000)
			} else {
				dispatch(updateSuccess(data))
				setSuccess('Profil użytkownika został pomyślnie zaktualizowany')
				setTimeout(() => {
					setSuccess(null)
				}, 4000)
			}
		} catch (error) {
			dispatch(updateFailure(error.message))
			setError(error.message)
		}
	}
	const handleDeleteUser = async () => {
		setShowModal(false)
		try {
			dispatch(deleteUserStart())
			const res = await fetch(`/api/user/delete/${currentUser._id}`, {
				method: 'DELETE',
			})
			const data = await res.json()
			if (!res.ok) {
				dispatch(deleteUserFailure(data.message))
			} else {
				dispatch(deleteUserSuccess(data))
			}
		} catch (error) {
			dispatch(deleteUserFailure(error.message))
		}
	}

	return (
		<div className='max-w-lg mx-auto p-3 w-full'>
			<div className='my-7 text-center font-bold text-3xl'>
				{currentUser.isAdmin ? <span style={{ color: 'Gold' }}>Profil administratora</span> : 'Profil użytkownika'}
			</div>
			<form onSubmit={handleSubmit} className='flex flex-col gap-6 '>
				<input type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
				<div
					className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
					onClick={() => filePickerRef.current.click()}>
					{imageFileUploadProgress && (
						<CircularProgressbar
							value={imageFileUploadProgress || 0}
							text={`${imageFileUploadProgress}%`}
							strokeWidth={5}
							styles={{
								root: {
									width: '100%',
									height: '100%',
									position: 'absolute',
									top: 0,
									left: 0,
								},
								path: {
									stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
								},
							}}
						/>
					)}
					<img
						src={imageFileUrl || currentUser.profilePicture}
						alt='user'
						className={`rounded-full w-full h-full object-cover border-2 border-[#0fcadf] ${
							imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'
						}`}
					/>
				</div>
				{imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
				<p className='text-md font-body'>Dane konta:</p>
				<span className='text-lime-500'>{currentUser.email}</span>
				<span className='text-lime-500'>{currentUser.username}</span>

				<p className='text-md font-body'>Zmień nazwę użytkownika lub hasło:</p>

				<TextInput
					type='text'
					id='username'
					placeholder='Nazwa Użytkownika'
					defaultValue={currentUser.username}
					onChange={handleChange}
				/>
				<TextInput type='password' id='password' placeholder='Hasło' onChange={handleChange} />

				<Button
					type='submit'
					gradientDuoTone='purpleToBlue'
					outline
					onClick={() => setImageFileUploadProgress(null)}
					disabled={loading || imageFileUploading}>
					{loading ? 'Ładowanie' : 'Aktualizuj profil'}
				</Button>
			</form>
			{!currentUser.isAdmin && (
				<div className='flex justify-between m-5'>
					<span onClick={() => setShowModal(true)} className='cursor-pointer text-red-500 relative top-4 '>
						Usuń konto
					</span>
				</div>
			)}
			{success && (
				<Alert color='success' className='mt-5'>
					{success}
				</Alert>
			)}
			{error && (
				<Alert color='failure' className='mt-5'>
					{error}
				</Alert>
			)}
			<Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
				<Modal.Header />
				<Modal.Body>
					<div className='text-center'>
						<HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
						<h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Czy na pewno chcesz usunąć swoje konto?</h3>
						<div className='flex justify-center gap-4'>
							<Button color='failure' onClick={handleDeleteUser}>
								Potwierdź
							</Button>
							<Button color='gray' onClick={() => setShowModal(false)}>
								Anuluj
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	)
}
