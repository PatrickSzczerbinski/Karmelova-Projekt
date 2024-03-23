import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'

export default function Rejestracja() {
	const navigate = useNavigate()
	const [error, setError] = useState(null)
	const [formData, setFormData] = useState({})
	const [successMessage, setSuccessMessage] = useState(null)
	const [loading, setLoading] = useState(false)
	const handleChange = e => {
		setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
	}
	const handleSumbit = async e => {
		e.preventDefault()
		if (!formData.username || !formData.email || !formData.password) {
			return setError('Wypełnij wszystkie pola')
		}
		try {
			setError(null)

			const res = await fetch('/api/auth/rejestracja', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			})
			const data = await res.json()
			if (data.success === false) {
				return setError(data.message)
			}
			if (res.ok) {
				setSuccessMessage('Rejestracja pomyślna, za chwilę zostaniesz przekierowany do logowania')
				setTimeout(() => {
					setLoading(true)
					navigate('/logowanie')
				}, 4000)
			}
		} catch (error) {
			setLoading(false)
			setError(error.message)
		}
	}
	return (
		<div className='flex items-center justify-center h-screen'>
			<div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
				<div className='flex-1'>
					<div className='col-span-1'>
						<Link to='/' className='text-4xl font-bold text-white'>
							Karmelova
						</Link>
					</div>
					<p className='text-sm mt-5 font-bold'>Zarejestruj się już teraz! Poznaj naszą salę i zarezerwuj termin</p>
				</div>
				<div className='flex-1'>
					<h1 className='text-3xl font-semibold mb-5'>Rejestracja</h1>
					<form className='flex flex-col gap-4' onSubmit={handleSumbit}>
						<div>
							<Label value='Wprowadź swoją nazwę użytkownika' />
							<TextInput type='text' placeholder='Nazwa użytkownika' id='username' onChange={handleChange} />
						</div>
						<div>
							<Label value='Wprowadź swój adres e-mail' />
							<TextInput type='email' placeholder='Adres e-mail' id='email' onChange={handleChange} />
						</div>
						<div>
							<Label value='Wprowadź swoje hasło' />
							<TextInput type='password' placeholder='Hasło' id='password' onChange={handleChange} />
						</div>
						<Button gradientDuoTone='purpleToBlue' outline type='submit' disabled={loading}>
							{loading ? (
								<>
									<Spinner size='sm' />
									<span className='pl-3'>Loading...</span>
								</>
							) : (
								'Zarejestruj się'
							)}
						</Button>
						<OAuth />
					</form>
					<div className='flex gap-2 text-sm mt-5'>
						<span>Masz już konto?</span>
						<Link to='/logowanie' className='text-blue-500'>
							Zaloguj się
						</Link>
					</div>
					{successMessage && (
						<Alert color='success' className='m-2'>
							{successMessage}
						</Alert>
					)}
					{error && (
						<Alert className='mt-5' color='failure'>
							{error}
						</Alert>
					)}
				</div>
			</div>
		</div>
	)
}
