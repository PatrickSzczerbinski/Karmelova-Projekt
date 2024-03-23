/* eslint-disable react/jsx-key */
import { Modal, Table, Button, Alert } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { FaCheck, FaTimes } from 'react-icons/fa'

export default function DashUsers() {
	const { currentUser } = useSelector(state => state.user)
	const [users, setUsers] = useState([])
	const [showMore, setShowMore] = useState(true)
	const [showModal, setShowModal] = useState(false)
	const [errorMessage, setErrorMessage] = useState(null)
	const [userIdToDelete, setUserIdToDelete] = useState('')
	useEffect(() => {
		const fetchUsers = async () => {
			setErrorMessage(null)
			try {
				const res = await fetch(`/api/user/getusers`)
				const data = await res.json()
				if (res.ok) {
					setUsers(data.uzytkownicy)
					if (data.uzytkownicy.length < 9) {
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
		if (currentUser.isAdmin) {
			fetchUsers()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser._id])

	const handleShowMore = async () => {
		const startIndex = users.length
		try {
			const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`)
			const data = await res.json()
			if (res.ok) {
				setUsers(prev => [...prev, ...data.uzytkownicy])
				if (data.uzytkownicy.length < 10) {
					setShowMore(false)
				}
			}
		} catch (error) {
			console.log(error.message)
		}
	}

	const handleDeleteUser = async () => {
		try {
			const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
				method: 'DELETE',
			})
			const data = await res.json()
			if (res.ok) {
				setUsers(prev => prev.filter(user => user._id !== userIdToDelete))
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
			{currentUser.isAdmin && users.length > 0 ? (
				<>
					<Table hoverable className='shadow-md'>
						<Table.Head>
							<Table.HeadCell>Awatar</Table.HeadCell>
							<Table.HeadCell>Nazwa użytkownika</Table.HeadCell>
							<Table.HeadCell>Adres e-mail</Table.HeadCell>
							<Table.HeadCell>Admin</Table.HeadCell>
							<Table.HeadCell>Data utworzenia</Table.HeadCell>
							<Table.HeadCell>Akcje</Table.HeadCell>
						</Table.Head>
						<Table.Body>
							{users.map(user => (
								<Table.Row key={user._id} className='rounded-lg'>
									<Table.Cell>
										<img
											src={user.profilePicture}
											alt={user.username}
											className='w-12 h-12 object-cover bg-gray-500 rounded-full'
										/>
									</Table.Cell>
									<Table.Cell>{user.username}</Table.Cell>
									<Table.Cell>{user.email}</Table.Cell>
									<Table.Cell>
										{user.isAdmin ? <FaCheck className='text-green-500' /> : <FaTimes className='text-red-500' />}
									</Table.Cell>
									<Table.Cell>{new Date(user.updatedAt).toLocaleDateString()}</Table.Cell>
									<Table.Cell>
										<div className='flex space-x-4 my-4'>
											<Button
												className='font-medium cursor-pointer'
												gradientDuoTone='pinkToOrange'
												outline
												onClick={() => {
													setShowModal(true)
													setUserIdToDelete(user._id)
												}}>
												Usuń
											</Button>
										</div>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
					{/* Przycisk Rozwiń */}
					{showMore && (
						<div className='flex justify-center items-center my-4'>
							<Button gradientDuoTone='purpleToBlue' outline onClick={handleShowMore} className='text-sm '>
								Rozwiń
							</Button>
						</div>
					)}
				</>
			) : (
				<p>Nie masz żadnych użytkowników!</p>
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
							<Button color='failure' onClick={handleDeleteUser}>
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
