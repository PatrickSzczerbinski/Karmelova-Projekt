import { Modal, Table, Button, Alert } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function DashComments() {
	const { currentUser } = useSelector(state => state.user)
	const [comments, setComments] = useState([])
	const [showMore, setShowMore] = useState(true)
	const [showModal, setShowModal] = useState(false)
	const [errorMessage, setErrorMessage] = useState(null)
	const [commentIdToDelete, setCommentIdToDelete] = useState('')
	useEffect(() => {
		const fetchComments = async () => {
			setErrorMessage(null)
			try {
				const res = await fetch(`/api/komentarz/getcomments`)
				const data = await res.json()
				if (res.ok) {
					setComments(data.comments)
					if (data.comments.length < 9) {
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
			fetchComments()
		}
	}, [currentUser._id])

	const handleShowMore = async () => {
		const startIndex = comments.length
		try {
			const res = await fetch(`/api/komentarz/getcomments?startIndex=${startIndex}`)
			const data = await res.json()
			if (res.ok) {
				setComments(prev => [...prev, ...data.comments])
				if (data.komentarze.length < 9) {
					setShowMore(false)
				}
			}
		} catch (error) {
			console.log(error.message)
		}
	}

	const handleDeleteComment = async () => {
		setShowModal(false)
		try {
			const res = await fetch(`/api/komentarz/deleteComment/${commentIdToDelete}`, {
				method: 'DELETE',
			})
			const data = await res.json()
			if (res.ok) {
				setComments(prev => prev.filter(comment => comment._id !== commentIdToDelete))
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
			{currentUser.isAdmin && comments.length > 0 ? (
				<>
					<Table hoverable className='shadow-md'>
						<Table.Head>
							<Table.HeadCell>Awatar</Table.HeadCell>
							<Table.HeadCell>Nazwa użytkownika</Table.HeadCell>
							<Table.HeadCell>Treść</Table.HeadCell>
							<Table.HeadCell>Liczba polubień</Table.HeadCell>
							<Table.HeadCell>Data publikacji</Table.HeadCell>
							<Table.HeadCell>Delete</Table.HeadCell>
						</Table.Head>
						{comments.map(comment => (
							<Table.Body className='divide-y' key={comment._id}>
								<Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
									<Table.Cell>
										<img src={comment.profilePicture} className='w-12 h-12 object-cover bg-gray-500 rounded-full' />
									</Table.Cell>
									<Table.Cell>{comment.username}</Table.Cell>
									<Table.Cell>{comment.content}</Table.Cell>
									<Table.Cell>{comment.numberOfLikes}</Table.Cell>
									<Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
									<Table.Cell>
										<span
											onClick={() => {
												setShowModal(true)
												setCommentIdToDelete(comment._id)
											}}
											className='font-medium text-red-500 hover:underline cursor-pointer'>
											Usuń
										</span>
									</Table.Cell>
								</Table.Row>
							</Table.Body>
						))}
					</Table>
					{showMore && (
						<button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
							Pokaż więcej
						</button>
					)}
				</>
			) : (
				<p>Nie masz jeszcze komentarzy!</p>
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
						<HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
						<h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
							Czy na pewno chcesz usunąć ten komentarz??
						</h3>
						<div className='flex justify-center gap-4'>
							<Button color='failure' onClick={handleDeleteComment}>
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
