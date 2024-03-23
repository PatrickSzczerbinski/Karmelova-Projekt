/* eslint-disable react/prop-types */
import { Button } from 'flowbite-react'
import { Link } from 'react-router-dom'

export default function PostCard({ post }) {
	return (
		<div className='group relative w-full border border-blue-500 h-[420px] overflow-hidden rounded-lg sm:w-[430px] hover:transition-all p-3'>
			<div className='flex flex-col p-2 gap-2'>
				<img className='h-60' src={post.image} />
				<p className='text-lg font-semibold '>{post.title}</p>
				<span className='italic text-sm'>{post.category}</span>
				<Link className='' to={`/post/${post.slug}`}>
					<Button
						gradientDuoTone='purpleToBlue'
						outline
						className='m-2 group-hover:bottom-0 absolute bottom-[-300px] left-0 right-0  ease-out duration-700'>
						Przeczytaj post
					</Button>
				</Link>
			</div>
		</div>
	)
}
