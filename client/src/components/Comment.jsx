/* eslint-disable react/prop-types */
import moment from 'moment'
import { useEffect, useState } from 'react'
import { FaThumbsUp } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Button, Textarea } from 'flowbite-react'

export default function Comment({ comment, onLike, onEdit, onDelete }) {
	const [user, setUser] = useState({})
	const [isEditing, setIsEditing] = useState(false)
	const [editedContent, setEditedContent] = useState(comment.content)
	const { currentUser } = useSelector(state => state.user)

	useEffect(() => {
		const pobierzUzytkownikow = async () => {
			try {
				const res = await fetch(`/api/user/${comment.userId}`)
				const data = await res.json()
				if (res.ok) {
					setUser(data)
				}
			} catch (error) {
				console.log(error.message)
			}
		}
		pobierzUzytkownikow()
	}, [comment])

	const handleEdit = () => {
		setIsEditing(true)
		setEditedContent(comment.content)
	}

	const handleSave = async () => {
		try {
			const res = await fetch(`/api/komentarz/editComment/${comment._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					content: editedContent,
				}),
			})
			if (res.ok) {
				setIsEditing(false)
				onEdit(comment, editedContent)
			}
		} catch (error) {
			console.log(error.message)
		}
	}
	return (
		<div className='flex p-4 border-b text-sm dark:border-gray-500'>
			<div className='flex-shrink-0 mr-4'>
				<img className='w-12 h-12 rounded-full bg-gray-200' src={user.profilePicture} alt={user.username} />
			</div>
			<div className='flex-1'>
				<div className='flex items-center mb-2'>
					<span className='font-bold mr-2 text-xs truncate'>{user ? `@${user.username}` : 'anonymous user'}</span>
					<span className='text-gray-500 text-xs'>{moment(comment.createdAt).fromNow()}</span>
				</div>
				{isEditing ? (
					<>
						<Textarea className='mb-2' value={editedContent} onChange={e => setEditedContent(e.target.value)} />
						<div className='flex justify-end gap-2 text-xs'>
							<Button type='button' size='sm' gradientDuoTone='purpleToBlue' onClick={handleSave}>
							Zapisz
							</Button>
							<Button
								type='button'
								size='sm'
								gradientDuoTone='purpleToBlue'
								outline
								onClick={() => setIsEditing(false)}>
								Anuluj
							</Button>
						</div>
					</>
				) : (
					<>
						<p className='text-gray-500 pb-2'>{comment.content}</p>
						<div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
							<button
								type='button'
								onClick={() => onLike(comment._id)}
								className={`text-gray-400 hover:text-blue-500 ${
									currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'
								}`}>
								<FaThumbsUp className='text-sm' />
							</button>
							<p className='text-gray-400'>
								{comment.numberOfLikes > 0 &&
									comment.numberOfLikes + ' ' + (comment.numberOfLikes === 1 ? 'Polubień' : 'Pulubienia')}
							</p>
							{currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
								<>
									<button type='button' onClick={handleEdit} className='text-gray-400 hover:text-blue-500'>
									Edytuj
									</button>
									<button
										type='button'
										onClick={() => onDelete(comment._id)}
										className='text-gray-400 hover:text-red-500'>
										Usuń
									</button>
								</>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	)
}
