import ReactQuill from 'react-quill' //edytor tekstu
import 'react-quill/dist/quill.snow.css'
import { Alert, Button, Label, TextInput } from 'flowbite-react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

export default function Kontakt() {
	const [formData, setFormData] = useState({})
	const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
	const [updateUserError, setUpdateUserError] = useState(null)
	const dispatch = useDispatch()

	const handleChange = content => {
		setFormData({ ...formData, message: content })
	}
	const wyslijMail = async e => {
		e.preventDefault()
		setUpdateUserError(null)
		setUpdateUserSuccess(null)
		if (!formData.name || !formData.email || !formData.subject || !formData.message) {
			return dispatch({ type: 'ERROR', payload: 'Wypełnij wszystkie pola' })
		}
		try {
			const res = await fetch('/api/email', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			})
			const data = await res.json()
			if (data.success === false) {
				dispatch({ type: 'ERROR', payload: data.message })
			}
			if (res.ok) {
				dispatch({ type: 'SUCCESS', payload: data })
				setUpdateUserSuccess('Formularz został wysłany')
				setTimeout(() => {
					window.location.reload()
				}, 3000)
			}
		} catch (error) {
			dispatch({ type: 'ERROR', payload: error.message })
			setUpdateUserError('Coś poszło nie tak')
			console.error('Błąd podczas wysyłania formularza:', error)
		}
		console.log(formData)
	}
	return (
		<div className='mx-auto m-10 w-full dark:border-gray-500 text-sm'>
			<h1 className='my-7 text-center font-bold text-3xl'>Skontaktuj się z nami</h1>
			<form className='max-w-2xl mx-auto rounded-md shadow-md' onSubmit={wyslijMail}>
				<div className='my-4'>
					<Label value='Imię i nazwisko'></Label>
					<TextInput
						type='text'
						id='name'
						placeholder='Imię i nazwisko'
						onChange={e => setFormData({ ...formData, name: e.target.value })}
						required
					/>
				</div>
				<div className='my-4'>
					<Label value='Twój adres e-mail'></Label>
					<TextInput
						type='email'
						id='email'
						placeholder='Email'
						required
						onChange={e => setFormData({ ...formData, email: e.target.value })}
					/>
				</div>
				<div className='my-4'>
					<Label value='Temat wiadomości'></Label>
					<TextInput
						type='subject'
						id='subject'
						placeholder='Temat'
						onChange={e => setFormData({ ...formData, subject: e.target.value })}
						required
					/>
				</div>
				<div className='my-4'>
					<Label value='Wiadomość'></Label>
					<ReactQuill
						theme='snow'
						placeholder='Dodaj wiadomość...'
						className='h-80 mt-4 text-white'
						required
						onChange={handleChange}
					/>
				</div>
				<Button type='submit' className='w-full mt-14' gradientDuoTone='purpleToBlue' outline>
					Wyślij wiadomość
				</Button>
			</form>
			<div className='max-w-lg mx-auto p-3 w-full'>
				{updateUserSuccess && (
					<Alert color='success' className='m-2'>
						{updateUserSuccess}
					</Alert>
				)}
				{updateUserError && (
					<Alert color='failure' className='m-2'>
						{updateUserError}
					</Alert>
				)}
			</div>
		</div>
	)
}
