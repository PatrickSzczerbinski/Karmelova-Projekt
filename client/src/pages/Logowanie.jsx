import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'

export default function Logowanie() {
	const [formData, setFormData] = useState({})
	const { loading, error: errorMessage } = useSelector(state => state.user)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	useEffect(() => {
		const errorTimeout = setTimeout(() => {
			dispatch(signInFailure(null))
		}, 5000) 

		return () => clearTimeout(errorTimeout) 
	}, [errorMessage, dispatch])

	const handleChange = e => {
		setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
	}
	const handleSumbit = async e => {
		e.preventDefault()
		if (!formData.email || !formData.password) {
			return dispatch(signInFailure('Wypełnij wszystkie pola'))
		}
		try {
			dispatch(signInStart())
			const res = await fetch('/api/auth/logowanie', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			})
			const data = await res.json()
			if (data.success === false) {
				dispatch(signInFailure(data.message))
			}

			if (res.ok) {
				dispatch(signInSuccess(data))
				navigate('/')
			}
		} catch (error) {
			dispatch(signInFailure(error.message))
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
					<p className='text-sm mt-5 font-bold'>Zaloguj się już teraz! Poznaj naszą salę i zarezerwuj termin</p>
				</div>
				
				<div className='flex-1'>
					<h1 className='text-3xl font-semibold mb-5'>Logowanie</h1>
					<form className='flex flex-col gap-4' onSubmit={handleSumbit}>
						<div>
							<Label value='Adres e-mail' />
							<TextInput type='email' placeholder='Wpisz adres e-mail' id='email' onChange={handleChange} />
						</div>
						<div>
							<Label value='Hasło' />
							<TextInput type='password' placeholder='Podaj hasło' id='password' onChange={handleChange} />
						</div>
						<Button gradientDuoTone='purpleToBlue' outline type='submit' disabled={loading}>
							{loading ? (
								<>
									<Spinner size='sm' />
									<span className='pl-3'>Loading...</span>
								</>
							) : (
								'Zaloguj się'
							)}
						</Button>
						<OAuth />
					</form>
					<div className='flex gap-2 text-sm mt-5'>
						<span>Nie masz konta?</span>
						<Link to='/rejestracja' className='text-blue-500'>
							Zarejestruj się
						</Link>
					</div>
					{errorMessage && (
						<Alert className='mt-5' color='failure'>
							{errorMessage}
						</Alert>
					)}
				</div>
			</div>
		</div>
	)
}
