import { useState } from 'react'
import { Button } from 'flowbite-react'
import { useSelector } from 'react-redux'
// eslint-disable-next-line react/prop-types
const Menu = ({ onMenuSelect }) => {
	const { currentUser } = useSelector(state => state.user)
	const [selectedMenu, setSelectedMenu] = useState(null)
	const menus = [
		{
			id: 1,
			items: [
				'1.Krem z pomidorów z bazylią',
				'2.Carpaccio z łososia',
				'3.Sałatka caprese z mozzarellą',
				'4.Półmisek krewetek',
				'5.Risotto z grzybami leśnymi',
				'6.Filet z kurczaka',
				'7.Zrazy wołowe w sosie',
			],
		},
		{
			id: 2,
			items: [
				'1.Tatar z łososia',
				'2.Sałatka z krewetek i awokado',
				'3.Półmisek świeżych ostryg',
				'4.Ciasteczka z sera feta i oliwek',
				'5.Pierogi z kaczką i żurawiną',
				'6.Polędwiczki wieprzowe w sosie',
				'7.Krewetki w sosie czosnkowym',
			],
		},
		{
			id: 3,
			items: [
				'1.Gravadlax (marynowany łosoś)',
				'2.Sałatka z grillowanym kurczakiem',
				'3.Owoce morza po bretońsku',
				'4.Karp w galarecie',
				'5.Makaron z krewetkami i szparagami',
				'6.Filet z dorsza w sosie cytrynowym',
				'7.Polędwiczki cielęce w sosie',
			],
		},
	]
	const handleMenuSelect = menu => {
		setSelectedMenu(menu.id)
		onMenuSelect(menu)
	}
	return (
		<div className='flex flex-col mx-auto w-full mt-4 text-center font-bold'>
			<h1 className='text-4xl font-bold mt-4'>Krok 2: Wybierz menu</h1>
			<div className='max-w-md mx-auto w-full rounded'>
				<div className=''>
				<div className='text-2xl'>
					<p className='text-white p-4'>Wybrano menu numer:</p>
					<div className=''></div>
					<input
						type='text'
						value={selectedMenu || ''}
						readOnly
						className='text-center text-2xl text-black rounded-full'
					/>
				</div>

				</div>
			</div>
			<div className='grid grid-cols-1 gap-8 p-10 md:grid-cols-3 sm:grid-cols-2 mx-auto'>
				{menus.map(menu => (
					<div key={menu.id} className='p-4 border-2 rounded-xl shadow-md'>
						<h2 className='text-2xl text-blue-400 font-bold mb-4 text-center italic'>Menu nr. {menu.id}</h2>
						<div className='border-t-2 border-blue-500 p-2'>
							<ul>
								{menu.items.map((item, index) => (
									<li key={index} className='mb-4 text-left'>
										{item}
									</li>
								))}
							</ul>
						</div>
						<div className='border-t-2 border-blue-500 p-2'></div>
						<div className='flex flex-col justify-end items-center'>
							<div className='flex justify-center items-center space-x-4 mt-6'>
								<Button
									onClick={() => handleMenuSelect({ ...menu, user: currentUser })}
									gradientDuoTone='purpleToBlue'
									outline>
									Wybierz to menu
								</Button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
export default Menu
