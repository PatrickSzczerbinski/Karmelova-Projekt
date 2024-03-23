// Obsługa logowania za pomocą konta Google, komunikacja z serwerem i aktualizacja stanu Redux po udanym logowaniu.
import { Button } from 'flowbite-react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

export default function OAuth() {
	// Inicjalizacja funkcji autentykacji Firebase
	const auth = getAuth(app)
	const dispatch = useDispatch()
	// Inicjalizacja funkcji nawigacji do przekierowywania po zalogowaniu
	const navigate = useNavigate()
	// Obsługa kliknięcia przycisku Google - logowanie za pomocą konta Google
	const handleGoogleClick = async () => {
		// Utworzenie autentykacji Google
		const provider = new GoogleAuthProvider()
		// Ustawienie niestandardowych parametrów, tutaj prompt: 'select_account' oznacza,
		// że użytkownik będzie zawsze proszony o wybór konta Google przy logowaniu
		provider.setCustomParameters({ prompt: 'select_account' })
		try {
			// Przejście do strony logowania Google i oczekiwanie na wyniki
			const resultsFromGoogle = await signInWithPopup(auth, provider)
			// Wysłanie danych zalogowanego użytkownika do serwera
			const res = await fetch('/api/auth/google', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: resultsFromGoogle.user.displayName,
					email: resultsFromGoogle.user.email,
					googlePhotoUrl: resultsFromGoogle.user.photoURL,
				}),
			})
			const data = await res.json()
			if (res.ok) {
				dispatch(signInSuccess(data))
				navigate('/')
			}
		} catch (error) {
			console.log(error)
		}
	}
	return (
		<Button type='button' gradientDuoTone='purpleToBlue' outline onClick={handleGoogleClick}>
			<AiFillGoogleCircle className='w-6 h-6 mr-2' />
			Kontynuuj przez portal Google
		</Button>
	)
}
