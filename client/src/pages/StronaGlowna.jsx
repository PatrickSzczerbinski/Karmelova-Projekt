import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import coupleImage from '../images/couple-big.jpg'
import { Button } from 'flowbite-react'
import { useEffect, useState } from 'react'
import PostCard from '../components/PostCard'
import Kontakt from './Kontakt'

export default function StronaGlowna() {
	const { currentUser } = useSelector(state => state.user)
	const [posts, setPosts] = useState([])

	useEffect(() => {
		const fetchPosts = async () => {
			const res = await fetch('/api/post/getPosts')
			const data = await res.json()
			setPosts(data.posts)
		}
		fetchPosts()
	}, [])

	return (
		<div className=''>
			<div className='h-screen relative '>
				<div className='bg-cover bg-center h-full' style={{ backgroundImage: `url(${coupleImage})` }}>
					<div className='absolute inset-0 bg-black opacity-50'></div>
					<div className='absolute inset-0 flex items-center justify-center text-white'>
						<div className='flex flex-col items-center justify-center'>
							<h1 className='text-5xl font-bold italic md:text-6xl '>Karmelova</h1>
							<p className='text-lg italic mb-4 md:text-2xl font-body'>Z nami zrobisz wymarzone wesele</p>
							<p className='text-xs m-2 lg:text-lg font-body'>Zaloguj się i zarezerwuj termin już teraz</p>

							{currentUser ? (
								<Link to='/kalendarz'>
									<Button gradientDuoTone='purpleToBlue' outline>
										Przejdź do kalendarza
									</Button>
								</Link>
							) : (
								<Link to='/logowanie'>
									<Button gradientDuoTone='purpleToBlue' outline>
										Rezerwuj termin
									</Button>
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className='font-body font-semibold text-center'>
				<h2 className='m-10 text-4xl '>Publikacje</h2>
			</div>
			<div className='flex mx-auto w-full p-3 items-center justify-center'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{posts.map(post => (
						<div key={post._id} className='flex'>
							<PostCard post={post} />
						</div>
					))}
				</div>
			</div>
			<div className='font-body font-semibold text-center'>
				<h2 className='m-10 text-4xl '>Lokalizacja</h2>
			</div>
			<div className='flex items-center justify-center  m-10'>
				<iframe
					width='1200px'
					height='400'
					scrolling='no'
					src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2452.4377898023886!2d21.574237929185426!3d52.9152782090276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471e5b2a72b60e65%3A0xaef397eb8ae41a5e!2sSala%20Bankietowa%20%22Karmelova%22!5e1!3m2!1spl!2spl!4v1710075740112!5m2!1spl!2spl'>
					<a href='https://www.gps.ie/'>Nawigacja</a>
				</iframe>
			</div>
			<Kontakt></Kontakt>
		</div>
	)
}
