import cywilnyImage from '../images/cywilny.png'
import miloscImage from '../images/napis.jpg'

export default function onas() {
	return (
		<div className='flex max-w-4xl mx-auto font-body text-center italic'>
			<div className=''>
				<h1 className='text-3xl font font-semibold my-7'>O nas</h1>
				<div className='flex flex-col text-md gap-6 dark:text-white'>
					<p>Sala Bankietowa Karmelova zaprasza do nowoczesnego obiektu położonego w malowniczym otoczeniu przyrody:</p>
					<p className='text-2xl'>OFERUJEMY PAŃSTWU:</p>
					<ul className='flex flex-col gap-5 mb-10'>
						<li>nowoczesną, klimatyzowaną salę która pomieści 300 osób</li>
						<li>wyśmienite dania polskiej kuchni</li>
						<li>profesjonalną obsługę</li>
						<li>przestronny parking</li>
						<li>pokoje noclegowe</li>
					</ul>
					<div className='group border-2 border-blue-500 rounded-xl overflow-hidden'>
						<img
							className='h-96 rounded-xl object-center object-cover w-full transition-transform duration-500 group-hover:scale-110'
							src={cywilnyImage}
							alt='cywilny'
						/>
					</div>
					<p className='text-2xl p-4 rounded-xl'>Specjalizujemy się w kompleksowej organizacji:</p>
					<div className='flex flex-col justify-center p-4 gap-2 md:flex-row'>
						<ul className='text-left mr-2 border-2 border-blue-500 p-6 rounded-xl list-disc'>
							<li>przyjęć weselnych</li>
							<li>imprez okolicznościowych</li>
							<li>studniówek</li>
							<li>bankietów</li>
							<li>przyjęć komunijnych</li>
							<li>chrzcin</li>
							<li>konsolacji</li>
							<li>spotkań firmowych</li>
						</ul>
						<div className='group border-2 border-blue-500 rounded-xl overflow-hidden'>
							<img
								className='object-cover w-full h-full transition-transform duration-500 group-hover:scale-110'
								src={miloscImage}
								alt='milosc'
							/>
						</div>
					</div>
					<p className='text-xl mb-10 underline'>Dla imprez kameralnych (do 100 osób) udostępniamy Małą salę</p>
				</div>
			</div>
		</div>
	)
}
