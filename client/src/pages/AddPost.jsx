import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import { useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import 'react-quill/dist/quill.snow.css'
import { app } from '../firebase'
import { useNavigate } from 'react-router-dom'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import ReactQuill from 'react-quill'

export default function AddPost() {
	const [file, setFile] = useState(null)
	const [formData, setFormData] = useState({})
	const [publishError, setPublishError] = useState(null)
	const [imageUploadProgress, setImageUploadProgress] = useState(null)
	const [imageUploadError, setImageUploadError] = useState(null)
	const navigate = useNavigate()

	const handleUploadImage = async () => {
		try {
			if (!file) {
				setImageUploadError('Najpierw wybierz zdjęcie')
				return
			}
			setImageUploadError(null)
			const storage = getStorage(app)
			const fileName = new Date().getTime() + '-' + generateRandomString(10) + '-' + file.fileName
			const storageRef = ref(storage, fileName)
			const uploadTask = uploadBytesResumable(storageRef, file)
			uploadTask.on(
				'state_changed',
				snapshot => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
					setImageUploadProgress(progress.toFixed(0))
				},
				// eslint-disable-next-line no-unused-vars
				error => {
					setImageUploadError('Przesyłanie obrazu nie powiodło się')
					setImageUploadProgress(null)
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
						setImageUploadProgress(null)
						setImageUploadError(null)
						setFormData({ ...formData, image: downloadURL })
					})
				}
			)
		} catch (error) {
			setImageUploadError('Przesyłanie obrazu nie powiodło się')
			setImageUploadProgress(null)
			console.log(error)
		}
	}

	function generateRandomString(length) {
		let result = ''
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
		const charactersLength = characters.length
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength))
		}
		return result
	}

	const handleSubmit = async e => {
        e.preventDefault();
        try {
            await handleUploadImage(); // Dodanie wywołania funkcji przesyłającej obraz
            const res = await fetch('/api/post/create', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return;
            }
            if (res.ok) {
                setPublishError(null);
                navigate(`/post/${data.slug}`);
            }
        } catch (error) {
            setPublishError('Coś poszło nie tak');
            console.log(error);
        }
    };

	return (
		<div className='p-3 max-w-3xl mx-auto min-h-screen'>
			<h1 className='text-center text-4xl my-8 font-semibold'>Dodaj Post</h1>
			<form action='' className='flex flex-col gap-4' onSubmit={handleSubmit}>
				<div className='flex flex-col gap-4 sm:flex-row justify-between mt-2'>
					<TextInput
						type='text'
						placeholder='Tytuł postu'
						required
						id='title'
						className='flex-1 '
						onChange={e => setFormData({ ...formData, title: e.target.value })}
					/>
					<Select className='' onChange={e => setFormData({ ...formData, category: e.target.value })}>
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
							'Wczytaj zdjęcie'
						)}
					</Button>
				</div>
				{imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
				{formData.image && <img src={formData.image} alt='Przesłano' className='w-full h-72 object-cover' />}
				<ReactQuill
					theme='snow'
					placeholder='Dodaj opis...'
					className='h-80 mt-4'
					required
					onChange={value => setFormData({ ...formData, content: value })}
				/>
				<Button type='submit' gradientDuoTone='purpleToBlue' className='mt-12' outline>
					Opublikuj
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
