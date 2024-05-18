/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { HiArrowNarrowUp } from 'react-icons/hi'
import { Button } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { BsFilePost } from 'react-icons/bs'
import { FaComment, FaUsersCog, FaCalendarCheck } from 'react-icons/fa'

export default function DashComp() {
	const [uzytkownicy, setUzytkownicy] = useState([])
	const [komentarze, setKomentarze] = useState([])
	const [posty, setPosty] = useState([])
	const [rezerwacje, setRezerwacje] = useState([])
	const [totalUzytkownicy, setTotalUzytkownicy] = useState(0)
	const [totalKomentarze, setTotalKomentarze] = useState(0)
	const [totalPosty, setTotalPosty] = useState(0)
	const [totalRezerwacje, setTotalRezerwacje] = useState(0)
	const [ostatniMiesiacUzytkownicy, setOstatniMiesiacUzytkownicy] = useState(0)
	const [ostatniMiesiacKomentarze, setOstatniMiesiacKomentarze] = useState(0)
	const [ostatniMiesiacPosty, setOstatniMiesiacPosty] = useState(0)
	const [ostatniMiesiacRezerwacje, setOstatniMiesiacRezerwacje] = useState(0)
	const { currentUser } = useSelector(state => state.user)

	useEffect(() => {
		const fetchUzytkownicy = async () => {
			try {
				const res = await fetch('/api/user/getusers?limit=5')
				const data = await res.json()
				if (res.ok) {
					console.log('Dane uzytkownikow:', data.uzytkownicy)
					setUzytkownicy(data.uzytkownicy)
					setTotalUzytkownicy(data.totalUzytkownicy)
					setOstatniMiesiacUzytkownicy(data.lastMonthUzytkownicy)
				}
			} catch (error) {
				console.error(error.message)
			}
		}
		const fetchKomentarze = async () => {
			try {
				const res = await fetch('/api/komentarz/getcomments?limit=5')
				const data = await res.json()
				if (res.ok) {
					console.log('Dane komentarzy:', data.comments)
					setKomentarze(data.comments)
					setTotalKomentarze(data.totalComments)
					setOstatniMiesiacKomentarze(data.lastMonthComments)
				}
			} catch (error) {
				console.log(error.message)
			}
		}
		const fetchPosty = async () => {
			try {
				const res = await fetch('/api/post/getposts?limit=5')
				const data = await res.json()
				if (res.ok) {
					console.log('Dane postów:', data.posts)
					setPosty(data.posts)
					setTotalPosty(data.totalPosts)
					setOstatniMiesiacPosty(data.lastMonthPosts)
				}
			} catch (error) {
				console.log(error.message)
			}
		}
		const fetchRezerwacje = async () => {
			try {
				const res = await fetch('/api/kalendarz/zarezerwowane?limit=5')
				const data = await res.json()
				if (res.ok) {
					console.log('Dane rezerwacji:', data.terminy)
					setRezerwacje(data.terminy)
					setTotalRezerwacje(data.totalTerminy)
					setOstatniMiesiacRezerwacje(data.lastMonthTerminy)
				}
			} catch (error) {
				console.log(error.message)
			}
		}
		if (currentUser.isAdmin) {
			fetchUzytkownicy()
			fetchKomentarze()
			fetchPosty()
			fetchRezerwacje()
		}
	}, [currentUser])
	return (
		<div className='md:mx-auto '>
			<div className='grid grid-cols-1 mx-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 '>
				<div className='flex flex-col m-4 p-2 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
					<div className='flex justify-between'>
						<div className=''>
							<h3 className='text-gray-500 text-md uppercase'>Całkowita liczba użytkowników</h3>
							<p className='text-4xl'>{totalUzytkownicy}</p>
						</div>
						<FaUsersCog className='bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg' />
					</div>
					<div className='flex gap-2 text-sm'>
						<span className='text-green-500 flex items-center'>
							<HiArrowNarrowUp />
							{ostatniMiesiacUzytkownicy}
						</span>
						<div className='text-gray-500'>Ostatni miesiąc</div>
						<Link to={'/dashboard?tab=uzytkownicy'}>
							<Button className='' gradientDuoTone='purpleToBlue' outline>
								Zobacz więcej
							</Button>
						</Link>
					</div>
				</div>
				<div className='flex flex-col m-4 p-2 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
					<div className='flex justify-between'>
						<div className=''>
							<h3 className='text-gray-500 text-md uppercase'>Całkowita liczba komentarzy</h3>
							<p className='text-4xl'>{totalKomentarze}</p>
						</div>
						<FaComment className='bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg' />
					</div>
					<div className='flex  gap-2 text-sm'>
						<span className='text-green-500 flex items-center'>
							<HiArrowNarrowUp />
							{ostatniMiesiacKomentarze}
						</span>
						<div className='text-gray-500'>Ostatni miesiąc</div>
						<Link to={'/dashboard?tab=komentarze'}>
							<Button className='' gradientDuoTone='purpleToBlue' outline>
								Zobacz więcej
							</Button>
						</Link>
					</div>
				</div>
				<div className='flex flex-col m-4 p-2 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
					<div className='flex justify-between'>
						<div className=''>
							<h3 className='text-gray-500 text-md uppercase'>
								Całkowita liczba <br></br>postów
							</h3>
							<p className='text-4xl'>{totalPosty}</p>
						</div>
						<BsFilePost className='bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg' />
					</div>
					<div className='flex gap-2 text-sm'>
						<span className='text-green-500 flex items-center'>
							<HiArrowNarrowUp />
							{ostatniMiesiacPosty}
						</span>
						<div className='text-gray-500'>Ostatni miesiąc</div>
						<Link to={'/dashboard?tab=posty'}>
							<Button className='' gradientDuoTone='purpleToBlue' outline>
								Zobacz więcej
							</Button>
						</Link>
					</div>
				</div>
				<div className='flex flex-col m-4 p-2 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
					<div className='flex justify-between'>
						<div className=''>
							<h3 className='text-gray-500 text-md uppercase'>
								Całkowita liczba <br></br>rezerwacji
							</h3>
							<p className='text-4xl'>{totalRezerwacje}</p>
						</div>
						<FaCalendarCheck className='bg-red-600  text-white rounded-full text-5xl p-3 shadow-lg' />
					</div>
					<div className='flex  gap-2 text-sm'>
						<span className='text-green-500 flex items-center'>
							<HiArrowNarrowUp />
							{ostatniMiesiacRezerwacje}
						</span>
						<div className='text-gray-500'>Ostatni miesiąc</div>
						<Link to={'/dashboard?tab=rezerwacje'}>
							<Button className='' gradientDuoTone='purpleToBlue' outline>
								Zobacz więcej
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
