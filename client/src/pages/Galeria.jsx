/* eslint-disable no-unused-vars */
import { Button, FileInput } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { AiOutlineCloseCircle } from 'react-icons/ai'

export default function Galeria() {
	const { currentUser } = useSelector(state => state.user) || {}
	const [zdjecie, setZdjecie] = useState([])
	const [file, setFile] = useState(null)
	const [formData, setFormData] = useState({})
	const [imageUploadProgress, setImageUploadProgress] = useState(null)
	const [imageUploadError, setImageUploadError] = useState(null)
	const [publishError, setPublishError] = useState(null)
	const [obraz, setObraz] = useState([])
	const [downloadURL, setDownloadURL] = useState(null)
	const [obrazIdToDelete, setObrazIdToDelete] = useState('')
	const isAdmin = currentUser && currentUser.isAdmin

	useEffect(() => {
		const pobierzObraz = async () => {
			try {
				const res = await fetch('/api/obraz/pobierzObraz')
				if (!res.ok) {
					throw new Error('Błąd pobierania obrazu')
				}
				const data = await res.json()
				setObraz(data.obrazy)
			} catch (error) {
				console.error(error)
			}
		}
		pobierzObraz()
	}, [])

	const handleUploadImage = async () => {
		try {
			if (!file) {
				setImageUploadError('Najpierw wybierz zdjęcie')
				return
			}
			setImageUploadError(null)
			const storage = getStorage(app)
			const fileName = new Date().getTime() + '-' + file.name
			const storageRef = ref(storage, fileName)
			const uploadTask = uploadBytesResumable(storageRef, file)
			uploadTask.on(
				'state_changed',
				snapshot => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
					setImageUploadProgress(progress.toFixed(0))
				},
				error => {
					console.error(error)
					setImageUploadError('Przesyłanie obrazu nie powiodło się')
					setImageUploadProgress(null)
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
						setDownloadURL(downloadURL)
						setZdjecie(prevZdjecie => [...prevZdjecie, downloadURL])
						setImageUploadProgress(null)
						setImageUploadError(null)
					})
				}
			)
		} catch (error) {
			setImageUploadError('Przesyłanie obrazu nie powiodło się')
			setImageUploadProgress(null)
			console.log(error)
		}
	}
	const handleSubmit = async e => {
		e.preventDefault()
		try {
			const res = await fetch('/api/obraz/przeslijObraz', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify({ ...formData, image: downloadURL }),
			})
			const data = await res.json()
			if (!res.ok) {
				setPublishError(data.message)
				return
			}
			if (res.ok) {
				setPublishError(null)
				window.location.reload()
			}
		} catch (error) {
			setPublishError('Coś poszło nie tak')
			console.log(error)
		}
	}

	const usunZdjecie = async () => {
		try {
			const res = await fetch(`/api/obraz/usunObraz/${obrazIdToDelete}/${currentUser._id}`, {
				method: 'DELETE',
			})
			const data = await res.json()
			if (!res.ok) {
				console.log(data.message)
			} else {
				setObraz(prev => prev.filter(obraz => obraz._id !== obrazIdToDelete))
			}
		} catch (error) {
			console.log(error.message)
		}
	}

	return (
		<div>
			<div className='m-4 p-4 max-w-3xl mx-auto'>
				<h2 className='text-center text-3xl p-10'>Galeria Zdjęć</h2>
				{isAdmin && (
					<div className='grid items-center md:grid-flow-row border-4 border-blue-500  p-3 border-double'>
						{zdjecie.map((zdjecie, index) => (
							<div key={index}>
								<img src={zdjecie} alt={`Zdjęcie ${index + 1}`} />
							</div>
						))}
						<div className='gap-4 m-6 grid grid-cols '>
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
									'Wczytaj zdjęcie'
								)}
							</Button>
							<Button type='button' gradientDuoTone='purpleToBlue' size='md' outline onClick={handleSubmit}>
								Dodaj zdjęcie
							</Button>
						</div>
					</div>
				)}
			</div>
			<div className='max-w-7xl mx-auto'>
				<div className='my-6 grid grid-cols lg:grid-cols-2 gap-4'>
					{obraz.map((image, index) => (
						<div key={index} className='relative group border-2 border-blue-500 rounded-xl overflow-hidden'>
							<div className='w-full h-full transform transition-transform hover:scale-110'>
								<img src={image.image} alt={`Obraz ${index}`} className='object-cover w-full h-full' />
							</div>
							{isAdmin && (
								<button
									className='absolute top-0 right-1 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity'
									onClick={() => {
										setObrazIdToDelete(image._id) 
										usunZdjecie() 
									}}>
									<AiOutlineCloseCircle />
								</button>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
