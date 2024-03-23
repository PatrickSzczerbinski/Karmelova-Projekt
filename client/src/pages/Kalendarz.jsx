/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import {
	format,
	addMonths,
	subMonths,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	addDays,
	isSameMonth,
	isSameDay,
	isWeekend,
} from 'date-fns'
import clsx from 'clsx'
import { pl } from 'date-fns/locale'
import { Link } from 'react-router-dom'
import { Alert, Button } from 'flowbite-react'
import { useSelector } from 'react-redux'
import Menu from './Menu.jsx'
import Offer from './Offer.jsx'

export default function Calendar() {
	const { currentUser } = useSelector(state => state.user)
	const [terminy, setTerminy] = useState([])
	const [loading, setLoading] = useState(true)
	const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
	const [updateUserError, setUpdateUserError] = useState(null)
	const [currentDate, setCurrentDate] = useState(new Date())
	const [selectedDate, setSelectedDate] = useState(null)
	const [selectedMenu, setSelectedMenu] = useState(null)
	const [selectedOffer, setSelectedOffer] = useState(null)
	const [selectedDateForReservation, setSelectedDateForReservation] = useState(null)
	const [zarezerwowaneTerminy, setZarezerwowaneTerminy] = useState([])
	const [reservationSuccessMessage, setReservationSuccessMessage] = useState({})
	const [formData, setFormData] = useState({})
	const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
	const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
	const storedReservedDates = localStorage.getItem('reservedDates')
	const initialReservedDates = storedReservedDates ? JSON.parse(storedReservedDates) : []
	const [reservedDates, setReservedDates] = useState(initialReservedDates)
	const [isChecked, setIsChecked] = useState(false)

	useEffect(() => {
		const fetchTerminy = async () => {
			try {
				const res = await fetch('/api/kalendarz/zarezerwowane')
				const data = await res.json()
				setReservedDates(data.terminy)
				localStorage.setItem('reservedDates', JSON.stringify(data.terminy))
			} catch (error) {
				console.log(error.message)
			}
		}
		fetchTerminy()
	}, [currentUser._id])
	//Rezerwacja
	const handleReserve = async e => {
		e.preventDefault()
		setUpdateUserError(null)
		setUpdateUserSuccess(null)
		formData.date = new Date(selectedDateForReservation)
		if (!formData.date || !formData.menu || !formData.offer) {
			setUpdateUserError('Wybierz wszystkie pola')
			return
		}
		try {
			const { menu, offer, user } = formData
			console.log('Dane żądania API:', {
				date: selectedDateForReservation,
				username: user.username,
				menuId: menu.id.toString(),
				offerId: offer.id.toString(),
			})
			const res = await fetch('/api/kalendarz/rezerwuj', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					date: selectedDateForReservation,
					username: user.username,
					accepted: false,
					isReserved: true,
					menuId: menu.id.toString(),
					offerId: offer.id.toString(),
				}),
			})
			const data = await res.json()
			const updatedReservedDates = [
				...reservedDates,
				{ date: selectedDateForReservation, accepted: true, _id: data.terminId },
			]
			if (!res.ok) {
				setUpdateUserError(data.message)
			} else {
				console.log('API Response Data:', data)
				setReservedDates(updatedReservedDates)
				localStorage.setItem('reservedDates', JSON.stringify(updatedReservedDates))
				setUpdateUserSuccess('Termin został przesłany do akceptacji')
			}
		} catch (error) {
			setUpdateUserError('Coś poszło nie tak')
			console.error('Błąd w handleReserve:', error)
		}
	}
	//Wybór Daty
	const handleDateSelect = date => {
		const today = new Date()
		if (isWeekday(date) || (date <= today && isWeekend(date))) {
			// Nie pozwóla na wybór dni od poniedziałku do piątku lub weekendów wstecz od dzisiaj
			return
		}
		setSelectedDate(new Date(date))
		setSelectedDateForReservation(format(date, 'yyyy-MM-dd'))
	}
	//Wybór Menu
	const handleMenuSelect = menu => {
		setFormData(prevState => ({
			...prevState,
			menu: {
				id: menu.id,
				items: menu.items,
			},
			user: menu.user,
		}))
	}
	//Wybór Oferty
	const handleOfferSelect = offer => {
		setFormData(prevState => ({
			...prevState,
			offer: {
				id: offer.id,
				details: offer.details,
			},
			user: offer.user,
		}))
	}
	const isWeekday = date => {
		const dayOfWeek = new Date(date).getDay()
		return dayOfWeek >= 1 && dayOfWeek <= 5 // Od Poniedziałku do piątku
	}
	const handleCheckboxChange = () => {
		setIsChecked(!isChecked)
	}
	//Miesiące
	const renderHeader = () => {
		return (
			<div className='flex justify-between items-center mb-4'>
				<button onClick={prevMonth} className='text-gray-600 hover:text-gray-900 focus:outline-none'>
					{'<'}
				</button>
				<h2 className='text-xl font-bold text-gray-800 text-uppercase'>
					{currentDate.toLocaleDateString(pl, { month: 'long', year: 'numeric' })}
				</h2>
				<button onClick={nextMonth} className='text-gray-600 hover:text-gray-900 focus:outline-none'>
					{'>'}
				</button>
			</div>
		)
	}
	//Dni tygodnia
	const renderDays = () => {
		const days = ['Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'Sb', 'Nd']
		return (
			<div className='grid grid-cols-7 gap-1 mb-2'>
				{days.map((day, index) => (
					<div key={index} className='text-sm font-medium text-gray-500 text-center'>
						{day}
					</div>
				))}
			</div>
		)
	}
	//Dni
	const renderCells = () => {
		const monthStart = startOfMonth(currentDate)
		const monthEnd = endOfMonth(monthStart)
		const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
		const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })
		const rows = []
		let days = []
		let day = startDate

		while (day <= endDate) {
			for (let i = 0; i < 7; i++) {
				days.push(day)
				day = addDays(day, 1)
			}
			rows.push(
				<div key={day} className='grid grid-cols-7 gap-1'>
					{days.map(d => (
						<div
							key={d}
							onClick={() => handleDateSelect(d)}
							className={clsx('text-sm font-medium p-2 text-center cursor-pointer', {
								'text-gray-300': !isSameMonth(d, monthStart),
								'text-gray-400': isSameMonth(d, monthStart),
								'bg-green-500 text-white': isWeekend(d) && (isSameDay(d, new Date()) || isWeekend(d)),
								'bg-blue-300 hover:bg-blue-400': !isSameDay(d, new Date()) && isWeekend(d) && isWeekend(d),
								'bg-red-500 text-white': isReservedAndAccepted(d),
							})}>
							{format(d, 'd', { locale: pl })}
						</div>
					))}
				</div>
			)
			days = []
		}
		return rows
	}
	const isReservedAndAccepted = date => {
		const result = reservedDates.some(reservedDate => {
			const isSameDayResult = isSameDay(new Date(reservedDate.date), date)
			return isSameDayResult && reservedDate.accepted
		})
		return result
	}
	return (
		<div className='flex flex-col mx-auto w-full mt-4 text-center font-bold font-body'>
			<h1 className='text-4xl font-bold mt-4'>Krok 1: Wybierz datę</h1>
			<div className='max-w-md mx-auto w-full rounded'>
				<div className=''>
					<div className='text-2xl'>
						<p className='text-white p-4'>Wybrana data:</p>
						<div className=''></div>
						<input
							type='text'
							value={selectedDateForReservation || ''}
							readOnly
							className='text-center text-2xl text-black rounded-full'
						/>
					</div>
				</div>
			</div>
			<div className=''>
				<div className='p-1'>
					<div className='max-w-md mx-auto p-10 bg-white rounded'>
						{renderHeader()}
						{renderDays()}
						{renderCells()}
					</div>
				</div>
				<Menu onMenuSelect={handleMenuSelect} />
				<Offer onOfferSelect={handleOfferSelect} />
				<div>
					<div className='flex justify-center gap-2 text-sm mt-5'>
						<label className='flex items-center'>
							<span>
								Akceptuje warunki
								<Link to='/regulamin' className='m-2 text-blue-500 underline'>
									regulaminu
								</Link>
							</span>
							<input
								type='checkbox'
								className='form-checkbox h-5 w-5 text-blue-500'
								checked={isChecked}
								onChange={handleCheckboxChange}
							/>
						</label>
					</div>
					<div className='flex justify-center gap-2 text-sm mt-5'>
						<Link to='/'>
							<Button gradientDuoTone='purpleToBlue' outline>
								Wstecz
							</Button>
						</Link>
						<Link to='/'>
							<Button gradientDuoTone='purpleToBlue' outline onClick={handleReserve} disabled={!isChecked}>
								Rezerwuj
							</Button>
						</Link>
					</div>
				</div>
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
		</div>
	)
}
