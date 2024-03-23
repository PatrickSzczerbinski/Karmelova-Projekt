import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { signoutSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

export default function Header() {
	const { currentUser } = useSelector(state => state.user)
	const path = useLocation().pathname
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const handleSignout = async () => {
		try {
			const res = await fetch('/api/user/signout', {
				method: 'POST',
			})
			const data = await res.json()
			if (!res.ok) {
				console.log(data.message)
			} else {
				dispatch(signoutSuccess())
				navigate('/')
			}
		} catch (error) {
			console.log(error.message)
		}
	}
	return (
		<Navbar className='relative border-b-4 dark:border-white dark:bg-gray-900'>
			<div className='col-span-1'>
				<Link to='/' className='text-4xl font-bold text-gray-900 dark:text-white'>
					<p className=''>Karmelova</p>
				</Link>
			</div>
			<div className='flex gap-2 md:order-2'>
				{currentUser ? (
					<Dropdown arrowIcon={false} inline label={<Avatar alt='user' img={currentUser.profilePicture} rounded />}>
						<Dropdown.Header className='p-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-300 ease-in-out'>
							<span className='block text-base font-semibold text-gray-300'>
								Nazwa użytkownika: {currentUser.username}
							</span>
							<span className='block text-base truncate font-semibold text-gray-400'>
								Adres e-mail: {currentUser.email}
							</span>
						</Dropdown.Header>
						<Link to={'/dashboard?tab=profil'} className='block'>
							<Dropdown.Item className='font-semibold py-2 transition-colors duration-300 ease-in-out hover:bg-gray-800 hover:text-blue-500'>
								Twój profil
							</Dropdown.Item>
						</Link>
						<Dropdown.Divider className='my-2' />
						<Dropdown.Item
							onClick={handleSignout}
							className='font-semibold py-2 transition-colors duration-300 ease-in-out hover:bg-gray-800 hover:text-red-500 cursor-pointer'>
							Wyloguj
						</Dropdown.Item>
					</Dropdown>
				) : (
					<Link to='/logowanie'>
						<Button gradientDuoTone='purpleToBlue' outline>
							Zaloguj Się
						</Button>
					</Link>
				)}
				<Navbar.Toggle />
			</div>
			<Navbar.Collapse >
				<Navbar.Link active={path === '/'} as={'div'}>
					<Link to='/'>Strona Główna</Link>
				</Navbar.Link>
				<Navbar.Link active={path === '/onas'} as={'div'}>
					<Link to='/onas'>O nas</Link>
				</Navbar.Link>
				<Navbar.Link active={path === '/projekty'} as={'div'}>
					<Link to='/galeria'>Galeria</Link>
				</Navbar.Link>
				<Navbar.Link active={path === '/kontakt'} as={'div'}>
					<Link to='/kontakt'>Kontakt</Link>
				</Navbar.Link>
			</Navbar.Collapse>
		</Navbar>
	)
}
