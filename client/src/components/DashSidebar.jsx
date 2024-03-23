import { Button, Sidebar } from 'flowbite-react'
import { HiArrowSmRight } from 'react-icons/hi'
import { FaCalendarCheck, FaComment, FaUsersCog, FaUserCog, FaSquareFull } from 'react-icons/fa'
import { toggleTheme } from '../redux/theme/themeSlice'
import { BsFilePost } from 'react-icons/bs'
import { MdDashboard } from 'react-icons/md'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { signoutSuccess } from '../redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux' 

export default function DashSidebar() {
	const { currentUser } = useSelector(state => state.user)
	const { theme } = useSelector(state => state.theme)
	const [tab, setTab] = useState('')
	const dispatch = useDispatch()
	const location = useLocation()

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search)
		const tabFromUrl = urlParams.get('tab')
		if (tabFromUrl) {
			setTab(tabFromUrl)
		}
	}, [location.search])
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
			}
		} catch (error) {
			console.log(error.message)
		}
	}
	return (
		<Sidebar className='w-full md:w-56 '>
			<Sidebar.Items>
				<div className='text-center text-xl'>
					{currentUser.isAdmin ? <span style={{ color: 'Gold' }}>Panel administratora</span> : 'Panel użytkownika'}
				</div>
				<Sidebar.ItemGroup className=''>
					<Sidebar.ItemGroup className=''></Sidebar.ItemGroup>
					<Link to='/dashboard?tab=profil'>
						<Sidebar.Item
							active={tab === 'profil'}
							icon={FaUserCog}
							label={currentUser.isAdmin ? <span style={{ color: 'gold' }}>Admin</span> : 'User'}
							labelColor='dark'
							as='div'>
							Profil
						</Sidebar.Item>
					</Link>
				</Sidebar.ItemGroup>
				{!currentUser.isAdmin && (
					<Sidebar.ItemGroup className=''>
						<p className='text-center italic text-xl'>** Rezerwacje **</p>
						<Sidebar.ItemGroup className=''></Sidebar.ItemGroup>
						<Link to='/dashboard?tab=rezerwacjeusera'>
							<Sidebar.Item active={tab === 'pulpit'} icon={FaCalendarCheck} as='div'>
								Twoje terminy
							</Sidebar.Item>
						</Link>
					</Sidebar.ItemGroup>
				)}
				<Sidebar.ItemGroup className=''></Sidebar.ItemGroup>
				{currentUser.isAdmin && (
					<>
						<p className='text-center italic text-xl'>** Pulpit **</p>
						<Sidebar.ItemGroup className='flex flex-col gap-1'>
							<Link to='/dashboard?tab=pulpit'>
								<Sidebar.Item active={tab === 'pulpit'} icon={MdDashboard} as='div'>
									Pulpit
								</Sidebar.Item>
							</Link>
						</Sidebar.ItemGroup>
					</>
				)}
				<Sidebar.ItemGroup className='flex flex-col gap-1'>
					{currentUser.isAdmin && (
						<>
							<p className='text-center italic text-xl'> ** Listy **</p>
							<Sidebar.ItemGroup className='flex flex-col gap-1'></Sidebar.ItemGroup>
							<Link to='/dashboard?tab=uzytkownicy'>
								<Sidebar.Item active={tab === 'uzytkownicy'} icon={FaUsersCog} as='div'>
									Użytkownicy
								</Sidebar.Item>
							</Link>
							<Link to='/dashboard?tab=posty'>
								<Sidebar.Item active={tab === 'posty'} icon={BsFilePost} as='div'>
									Posty
								</Sidebar.Item>
							</Link>
							<Link to='/dashboard?tab=komentarze'>
								<Sidebar.Item active={tab === 'comments'} icon={FaComment} as='div'>
									Komentarze
								</Sidebar.Item>
							</Link>
							<Link to='/dashboard?tab=rezerwacje'>
								<Sidebar.Item active={tab === 'rezerwacje'} icon={FaCalendarCheck} as='div'>
									Rezerwacje
								</Sidebar.Item>
							</Link>
							<Sidebar.ItemGroup className='flex flex-col gap-1'></Sidebar.ItemGroup>
							<p className='text-center italic text-xl'>*** Opublikuj post ***</p>
							<Link to={'/AddPost'}>
								<Button type='button' gradientDuoTone='purpleToBlue' outline className='w-full mb-2'>
									Opublikuj
								</Button>
							</Link>
						</>
					)}
					<Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignout}>
						Wyloguj
					</Sidebar.Item>
				</Sidebar.ItemGroup>
				<div className='text-4xl'>
					<button className='w-12 h-10 m-4 hidden sm:inline' onClick={() => dispatch(toggleTheme())}>
						{theme === 'light' ? <FaSquareFull /> : theme === 'dark' ? <FaSquareFull /> : null}
					</button>
				</div>
			</Sidebar.Items>
		</Sidebar>
	)
}
