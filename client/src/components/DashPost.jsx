/* eslint-disable react/jsx-key */
import { Modal, Table, Button, Alert } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function DashPost() {
	const { currentUser } = useSelector(state => state.user)
	const [userPosts, setUserPosts] = useState([])
	const [showMore, setShowMore] = useState(true)
	const [showModal, setShowModal] = useState(false)
	const [errorMessage, setErrorMessage] = useState(null)

	const [postIdToDelete, setPostIdToDelete] = useState('')
	useEffect(() => {
		setErrorMessage(null)
		const fetchPosts = async () => {
			try {
				const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`)
				const data = await res.json()
				if (res.ok) {
					setUserPosts(data.posts)
					if (data.posts.length < 9) {
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
			fetchPosts()
		}
	}, [currentUser._id])

	const handleShowMore = async () => {
		const startIndex = userPosts.length
		try {
			const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`)
			const data = await res.json()
			if (res.ok) {
				setUserPosts(prev => [...prev, ...data.posts])
				if (data.posts.length < 10) {
					setShowMore(false)
				}
			}
		} catch (error) {
			console.log(error.message)
		}
	}

	const handleDeletePost = async () => {
		setShowModal(false)
		try {
			const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
				method: 'DELETE',
			})
			const data = await res.json()
			if (!res.ok) {
				console.log(data.message)
			} else {
				setUserPosts(prev => prev.filter(post => post._id !== postIdToDelete))
			}
		} catch (error) {
			console.log(error.message)
		}
	}

	return (
		<div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
			{currentUser.isAdmin && userPosts.length > 0 ? (
				<>
					<Table hoverable className='shadow-md'>
						<Table.Head>
							<Table.HeadCell>Tytuł</Table.HeadCell>
							<Table.HeadCell>Obraz</Table.HeadCell>
							<Table.HeadCell>Kategoria</Table.HeadCell>
							<Table.HeadCell>Data aktualizacji</Table.HeadCell>
							<Table.HeadCell>Akcje</Table.HeadCell>
						</Table.Head>
						<Table.Body>
							{userPosts.map(post => (
								<Table.Row key={post._id} className='rounded-lg'>
									<Table.Cell>
										<Link className='font-medium text-gray-900 dark:text-white' to={`/post/${post.slug}`}>
											{post.title}
										</Link>
									</Table.Cell>
									<Table.Cell>
										<Link to={`/post/${post.slug}`}>
											<img
												src={post.image}
												alt={post.title}
												className='w-20 h-10 object-cover bg-gray-500 rounded-lg'
											/>
										</Link>
									</Table.Cell>
									<Table.Cell>{post.category}</Table.Cell>
									<Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
									<Table.Cell>
										{/* Przyciski */}
										<div className='flex space-x-4 my-4'>
											<Button className='font-medium cursor-pointer' gradientDuoTone='purpleToBlue' outline>
												<Link className='' to={`/update-post/${post._id}`}>
													Edytuj
												</Link>
											</Button>
											<Button
												className='font-medium cursor-pointer'
												gradientDuoTone='pinkToOrange'
												outline
												onClick={() => {
													setShowModal(true)
													setPostIdToDelete(post._id)
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
				<p>Nie masz żadnych postów!</p>
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
						<h3 className='mb-4 text-lg text-red-600 '>Czy na pewno chcesz usunąć post?</h3>
						<div className='flex justify-center gap-4'>
							<Button color='failure' onClick={handleDeletePost}>
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
