import { Alert, Table } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { useSelector } from 'react-redux'

export default function DashReserv() {
	const { currentUser } = useSelector(state => state.user)
	const [terminy, setTerminy] = useState([])
	const [errorMessage, setErrorMessage] = useState(null)

	useEffect(() => {
		const fetchTerminy = async () => {
			try {
				if (!currentUser || !currentUser.username) {
					throw new Error('Brak nazwy użytkownika')
				}
				const res = await fetch(`/api/kalendarz/zarezerwowaneusera?username=${currentUser.username}`)
				const data = await res.json()
				if (res.ok) {
					setTerminy(data.terminy)
				}
				if (!res.ok) {
					setErrorMessage(data.message)
				}
			} catch (error) {
				console.log(error.message)
			}
		}
		fetchTerminy()
	}, [currentUser.username])

	return (
		<div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
			{!currentUser?.isAdmin && terminy.length > 0 && (
				<Table hoverable className='shadow-md'>
					<Table.Head>
						<Table.HeadCell>Awatar</Table.HeadCell>
						<Table.HeadCell>Nazwa użytkownika</Table.HeadCell>
						<Table.HeadCell>Adres e-mail</Table.HeadCell>
						<Table.HeadCell>Zarezerwowany termin</Table.HeadCell>
						<Table.HeadCell>Nr. Menu</Table.HeadCell>
						<Table.HeadCell>Nr. Oferty</Table.HeadCell>
						<Table.HeadCell>Status akceptacji</Table.HeadCell>
					</Table.Head>
					<Table.Body>
						{terminy.map(termin => (
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
										{termin.accepted ? <FaCheck className='text-green-500' /> : <FaTimes className='text-red-500' />}
									</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			)}
			<div className='max-w-lg mx-auto p-3 w-full'>
				{errorMessage && (
					<Alert color='failure' className='m-2'>
						{errorMessage}
					</Alert>
				)}
			</div>
		</div>
		
	)
}
