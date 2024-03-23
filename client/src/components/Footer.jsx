import { Footer } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { BsFacebook, BsInstagram, BsTwitter } from 'react-icons/bs'

export default function FooterCom() {
	return (
		<Footer container className='border-t-4 py-6 dark:bg-gray-900'>
			<div className='container mx-auto'>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
					<div className='col-span-1'>
						<Link to='/' className='text-4xl font-bold text-black dark:text-white'>
							Karmelova
						</Link>
					</div>
					<div className='col-span-2 sm:flex justify-between items-center'>
						<div className='mt-6 sm:mt-0'>
							<Footer.Title title='Kontakt' className='text-lg font-semibold mb-4' />
							<Footer.LinkGroup className='flex flex-col gap-4'>
								<Footer.Link href='/kontakt' className='hover:text-blue-300 transition duration-300'>
									tel: 545-545-545
								</Footer.Link>
								<Footer.Link href='/kontakt' className='hover:text-blue-300 transition duration-300'>
									e-mail: p.szczerbinski2023g@gmail.com
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
						<div className='mt-6 sm:mt-0'>
							<Footer.Title title='O nas' className='text-lg font-semibold mb-4' />
							<Footer.LinkGroup className='flex flex-col gap-4'>
								<Footer.Link
									href='https://www.facebook.com/profile.php?id=100078883596067'
									target='_blank'
									rel='noopener noreferrer'
									className='hover:text-blue-300 transition duration-300'>
									Karmelova
								</Footer.Link>
								<Footer.Link
									href='https://www.facebook.com/wdolinieorza'
									target='_blank'
									rel='noopener noreferrer'
									className='hover:text-blue-300 transition duration-300'>
									W dolinie orza
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
						<div className='mt-6 sm:mt-0'>
							<Footer.Title title='Obserwuj nas' className='text-lg font-semibold mb-4' />
							<Footer.LinkGroup className='flex flex-col gap-4'>
								<Footer.Link
									href='https://www.facebook.com/profile.php?id=100078883596067'
									target='_blank'
									rel='noopener noreferrer'
									className='hover:text-blue-300 transition duration-300'>
									Karmelova
								</Footer.Link>
								<Footer.Link
									href='https://www.facebook.com/wdolinieorza'
									target='_blank'
									rel='noopener noreferrer'
									className='hover:text-blue-300 transition duration-300'>
									W dolinie orza
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
						<div className='mt-6 sm:mt-0'>
							<Footer.Title title='Prawa' className='text-lg font-semibold mb-4' />
							<Footer.LinkGroup className='flex flex-col gap-4'>
								<Footer.Link href='/regulamin' className='hover:text-blue-300 transition duration-300'>
									Polityka Prywatności
								</Footer.Link>
								<Footer.Link href='/regulamin' className='hover:text-blue-300 transition duration-300'>
									Zasady i warunki umowy
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
					</div>
				</div>
				<Footer.Divider className='my-8 border-t border-gray-700' />
				<div className='flexflex-justify-between items-center'>
					<Footer.Copyright href='#' by='Karmelova' year={new Date().getFullYear()} className='text-sm opacity-70' />
					<div className='flex gap-8'>
						<Footer.Icon
							href='https://www.facebook.com/profile.php?id=100078883596067'
							icon={BsFacebook}
							size={28}
							className='text-white hover:text-blue-300 transition duration-300'
						/>
						<Footer.Icon
							href='https://www.facebook.com/profile.php?id=100078883596067'
							icon={BsInstagram}
							size={28}
							className='text-white hover:text-blue-300 transition duration-300'
						/>
						<Footer.Icon
							href='https://www.facebook.com/profile.php?id=100078883596067'
							icon={BsTwitter}
							size={28}
							className='text-white hover:text-blue-300 transition duration-300'
						/>
					</div>
				</div>
			</div>
		</Footer>
	)
}
