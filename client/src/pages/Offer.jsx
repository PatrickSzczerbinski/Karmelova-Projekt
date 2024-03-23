import { useState } from 'react'
import { Button } from 'flowbite-react'
import { useSelector } from 'react-redux'
// eslint-disable-next-line react/prop-types
const Offer = ({ onOfferSelect }) => {
	const { currentUser } = useSelector(state => state.user)
	const [selectedOffer, setSelectedOffer] = useState(null)
	const offers = [
		{
			id: 1,
			items: [
				'1.fotobudka',
				'2.drink bar',
				'3.stół wiejski',
				'4.stół z owocami morza + 1 talerz sushi',
				'5.-',
				'6.-',
				'7.-',
			],
			price: 200,
		},
		{
			id: 2,
			items: [
				'1.fotobudka',
				'2.drink bar',
				'3.stół wiejski',
				'4.stół z owocami morza + 1 talerz sushi',
				'5.candy bar',
				'6.-',
				'7.-',
			],
			price: 250,
		},
		{
			id: 3,
			items: [
				'1.fotobudka',
				'2.drink bar',
				'3.stół wiejski',
				'4.stół z owocami morza + 1 talerz sushi',
				'5.candy bar',
				'6.stół sushi',
				'7.stół z nalewkami',
			],
			price: 300,
		},
	]
	const handleOfferSelect = offer => {
		setSelectedOffer(offer.id)
		onOfferSelect(offer)
	}
	return (
		<div className='flex flex-col mx-auto w-full mt-4 text-center font-bold'>
			<h1 className='text-4xl font-bold mt-4'>Krok 3: Wybierz ofertę</h1>
			<div className='max-w-md mx-auto w-full rounded'>
				<div className=''>
					<div className='text-2xl'>
						<p className='text-white p-4'>Wybrano ofertę numer:</p>
						<div className=''></div>
						<input
							type='text'
							value={selectedOffer || ''}
							readOnly
							className='text-center text-2xl text-black rounded-full'
						/>
					</div>
				</div>
			</div>
			<div className='grid grid-cols-1 gap-8 p-10 md:grid-cols-3 sm:grid-cols-2 mx-auto'>
				{offers.map(offer => (
					<div key={offer.id} className='p-4 border-2 rounded-xl shadow-md '>
						<h2 className='text-2xl text-blue-400 font-bold mb-4 text-center italic'>Oferta nr. {offer.id}</h2>
						<div className='border-t-2 border-blue-500 p-2'></div>
						<ul>
							{offer.items.map((item, index) => (
								<li key={index} className='mb-2 text-left'>
									{item}
								</li>
							))}
						</ul>
						<div className='border-t-2 border-blue-500 p-2'></div>
						<div className='flex flex-col justify-end items-center'>
							<p className='mt-2 text-2xl text-teal-300'>Cena: {offer.price} zł/os</p>
							<div className='flex justify-center items-center space-x-4 mt-6'>
								<Button
									onClick={() => handleOfferSelect({ ...offer, user: currentUser })}
									gradientDuoTone='purpleToBlue'
									outline>
									Wybierz tę ofertę
								</Button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
export default Offer
