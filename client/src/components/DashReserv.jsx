import { Alert, Button, Modal, Table } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function DashReserv() {
	const { currentUser } = useSelector(state => state.user)
	const [terminy, setTerminy] = useState([])
	const [showMore, setShowMore] = useState(true)
	const [showModal, setShowModal] = useState(false)
	const [errorMessage, setErrorMessage] = useState(null)
	const [terminIdToDelete, setTerminIdToDelete] = useState('')

	useEffect(() => {
		const fetchTerminy = async () => {
			setErrorMessage(null)
			try {
				const res = await fetch('/api/kalendarz/zarezerwowane')
				const data = await res.json()
				if (res.ok) {
					setTerminy(data.terminy)
					if (data.terminy.length < 9) {
						setShowMore(false)
					}
				}
				if (!res.ok) {
					setErrorMessage(data.message)
				}
			} catch (error) {
				console.log(error.message)
			}
		}
		fetchTerminy()
	}, [currentUser._id])

	const handleShowMore = async () => {
		const startIndex = terminy.length
		try {
			const res = await fetch(`/api/kalendarz/zarezerwowane?startIndex=${startIndex}`)
			const data = await res.json()
			if (res.ok) {
				setTerminy(prev => [...prev, ...data.terminy])
				if (data.terminy.length < 9) {
					setShowMore(false)
				}
			}
		} catch (error) {
			console.log(error.message)
		}
	}

	const handleAkceptujTermin = async terminId => {
		try {
			const res = await fetch(`/api/kalendarz/akceptujtermin/${terminId}`, {
				method: 'PUT',
			})
			const data = await res.json()
			if (res.ok) {
				// Zaktualizuj lokalnie stan, aby odzwierciedlić zmiany
				setTerminy(prev => prev.map(termin => (termin._id === terminId ? { ...termin, accepted: true } : termin)))
			} else {
				console.log(data.message)
			}
		} catch (error) {
			console.log(error.message)
		}
	}

	const handleUsunTermin = async () => {
		setShowModal(false)
		try {
			const res = await fetch(`/api/kalendarz/deletetermin/${terminIdToDelete}/${currentUser._id}`, {
				method: 'DELETE',
			})
			const data = await res.json()
			if (res.ok) {
				setTerminy(prev => prev.filter(termin => termin._id !== terminIdToDelete))
				setShowModal(false)
			} else {
				console.log(data.message)
			}
		} catch (error) {
			console.log(error.message)
		}
	}

	return (
		<div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
			{currentUser.isAdmin && terminy.length > 0 ? (
				<>
					<Table hoverable className='shadow-md'>
						<Table.Head>
							<Table.HeadCell>Awatar</Table.HeadCell>
							<Table.HeadCell>Nazwa użytkownika</Table.HeadCell>
							<Table.HeadCell>Adres e-mail</Table.HeadCell>
							<Table.HeadCell>Zarezerwowany termin</Table.HeadCell>
							<Table.HeadCell>Nr.Menu</Table.HeadCell>
							<Table.HeadCell>Nr.Oferty</Table.HeadCell>
							<Table.HeadCell>Akceptacja/Usuwanie</Table.HeadCell>
						</Table.Head>
						<Table.Body>
							{terminy.map(
								termin => (
									console.log(termin),
									(
										<Table.Row key={termin._id} className='rounded-lg'>
											<Table.Cell>
												<img src={termin.profilePicture} className='w-12 h-12 object-cover bg-gray-500 rounded-full' />
											</Table.Cell>
											<Table.Cell>{termin.username}</Table.Cell>
											<Table.Cell>{termin.email}</Table.Cell>
											<Table.Cell>{new Date(termin.date).toLocaleDateString()}</Table.Cell>
											<Table.Cell>{termin.menuId}</Table.Cell>
											<Table.Cell>{termin.offerId}</Table.Cell>
											<Table.Cell>
												<div className='flex space-x-4 my-4'>
													{!termin.accepted && (
														<Button
															className='font-medium cursor-pointer'
															gradientDuoTone='greenToBlue'
															outline
															onClick={() => handleAkceptujTermin(termin._id)}>
															Akceptuj
														</Button>
													)}
													<Button
														className='font-medium cursor-pointer'
														gradientDuoTone='pinkToOrange'
														outline
														onClick={() => {
															setShowModal(true)
															setTerminIdToDelete(termin._id)
														}}>
														Usuń
													</Button>
												</div>
											</Table.Cell>
										</Table.Row>
									)
								)
							)}
						</Table.Body>
					</Table>

					{showMore && (
						<div className='flex justify-center items-center my-4'>
							<Button gradientDuoTone='purpleToBlue' outline onClick={handleShowMore} className='text-sm '>
								Rozwiń
							</Button>
						</div>
					)}
				</>
			) : (
				<p>Brak danych do wyświetlenia.</p>
			)}
			<div className='max-w-lg mx-auto p-3 w-full'>
				{errorMessage && (
					<Alert color='failure' className='m-2'>
						{errorMessage}
					</Alert>
				)}
			</div>
			<Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
				<Modal.Header />
				<Modal.Body>
					<div className='text-center'>
						<HiOutlineExclamationCircle className='h-10 w-10 text-red-600 dark:text-gray-200 mb-4 mx-auto' />
						<h3 className='mb-4 text-lg text-red-600 '>Czy na pewno chcesz usunąć użytkownika?</h3>
						<div className='flex justify-center gap-4'>
							<Button color='failure' onClick={handleUsunTermin}>
								Tak
							</Button>
							<Button color='gray' onClick={() => setShowModal(false)}>
								Nie
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	)
}
