import axios from 'axios'
import Image from 'next/image'
import {useState, useEffect} from 'react'
import { useAuth } from '../contexts/AuthContext'
// import { useFirestore } from '../contexts/DatabaseContext'

function Dashboard() {
	const {currentUser} = useAuth()
	const [UserFirstname, setUserFirstname] = useState(null)
	const [userLocation, setUserLocation] = useState(null)
	const [reversedGeolocation, setReversedGeolocation] = useState(null)
	const [locationLoading, setLocationLoading] = useState(false)
	const [locationError, setLocationError] = useState(null)
	const [searchText, setSearchText] = useState('')

	useEffect(() => {
		console.log('frferferf');
		if(currentUser){
			let userName = currentUser.displayName
			let firstName = userName.split(' ')[0];
			setUserFirstname(firstName)
		}
		const M = require('../js/materialize');
		let carousel = document.querySelectorAll(".carousel")
		M.Carousel.init(carousel, {
			dist: -100,
			shift: 0,
			padding: 20,
			numVisible: 5,
			indicators: true,
			fullWidth: false
		})

		let lang = navigator.language || navigator.userLanguage;
		let language = lang.split('-')[0];
		console.log(language);
	}, [])
	
	function getGeolocation(){
		setLocationLoading(true)
		if(navigator.geolocation){
			console.log('Geolocation is avaliable')
			navigator.geolocation.getCurrentPosition(position => {
				setUserLocation(position.coords)
				reverseGeolocation(position)
			})
			// setLocationLoading(false)
		}else {
			setLocationLoading(false)
			setLocationError('Browser does not support Geolocation')
		}
	}
	
	function reverseGeolocation(position){
		const userLanguage = navigator.language || navigator.userLanguage;
		const lang = userLanguage.split('-')[0]
		let latitude = position.coords.latitude;
		let longitude = position.coords.longitude;
		const baseURL = "https://api.bigdatacloud.net/data/reverse-geocode-client"
		let fullURL = baseURL + `?latitude=${latitude}&longitude=${longitude}&localityLanguage=${lang}`
		axios.get(fullURL)
		.then(result => {
			console.log("reverse OK", result);
			const reversedGeoData = result;
			setReversedGeolocation(reversedGeoData);
		})
		.catch(err => {
			setLocationError(err)
			console.error("reversing error", err);
		})
		setLocationLoading(false)
		console.log('reversing...', position);
	}

	return (
		<>
			<div className="">
				<div className="row valign-wrapper">
					<div className="col s12 m4 push-m4 l4 push-l4 center-align geoLocation-section">
						<span onClick={getGeolocation}>
							<p>
								<i className="material-icons">place</i>
								{(reversedGeolocation && !locationLoading) ? (reversedGeolocation.data.locality + ', ') : ''}
								<b>
									{(reversedGeolocation && !locationLoading) ? (reversedGeolocation.data.countryName) : ''}
									{(!reversedGeolocation && !locationLoading) ? 'Press to get location' : ''}
								</b>
								{locationLoading ? 'Loading...' : ''}
							</p>
						</span>
					</div>					
				</div>
				<div className="row valign-wrapper">
					<div className="greeting-section col">				
						<h4>Hi {currentUser && UserFirstname}!</h4>
						<h5>Let's start your jurney</h5>					
					</div>
				</div>
				<div className="row valign-wrapper">
					<form className="col s12 searchbar-section">
						<div className="row">
							<div className="input-field col s8 push-s2 m6 push-m3">
								<i className="material-icons prefix">search</i>
								<input type="search" onChange={(e) => setSearchText(e.target.value)} name="" id="search-field"/>
								<label htmlFor="search-field">Make a search</label>
							</div>
						</div>
					</form>
				</div>
				{/* //TODO mapa ut post i karusellen med bild och position */}
				<div className="row valign-wrapper">
					<div className="col s12 center-align post-carousel-section">
						<div className="carousel post-carousel">
							<a href="#one!" className="carousel-item post-carousel-item">
								<Image
								src="/../public/assets/testimages/ben-white-qDY9ahp0Mto-unsplash.jpg" 
								alt="test0"
								quality={75}
								layout="fill"
								/>
								<p className="post-location-container"><i className=" material-icons">place</i>this is location</p>
							</a>
							<a href="#two!" className="carousel-item post-carousel-item">
								<Image
								src="/../public/assets/testimages/green-chameleon-s9CC2SKySJM-unsplash.jpg" 
								alt="test1"
								quality={75}
								layout="fill"
								/>
								<p className="post-location-container"><i className=" material-icons">place</i>this is location</p>
							</a>
							<a href="#three!" className="carousel-item post-carousel-item">
								<Image
								src="/../public/assets/testimages/jeshoots-com--2vD8lIhdnw-unsplash.jpg" 
								alt="test2"
								quality={75}
								layout="fill"
								/>
								<p className="post-location-container"><i className=" material-icons">place</i>this is location</p>
							</a>
							<a href="#four!" className="carousel-item post-carousel-item">
								<Image
								src="/../public/assets/testimages/kendal-L4iKccAChOc-unsplash.jpg" 
								alt="test3"
								quality={75}
								layout="fill"
								/>
								<p className="post-location-container"><i className=" material-icons">place</i>this is location</p>
							</a>
							<a href="#five!" className="carousel-item post-carousel-item">
								<Image
								src="/../public/assets/testimages/lacie-slezak-yHG6llFLjS0-unsplash.jpg" 
								alt="test4"
								quality={75}
								layout="fill"
								/>
								<p className="post-location-container"><i className=" material-icons">place</i>this is location</p>
							</a>
							<a href="#six!" className="carousel-item post-carousel-item">
								<Image
								src="/../public/assets/testimages/scott-graham-5fNmWej4tAA-unsplash.jpg" 
								alt="test5"
								quality={75}
								layout="fill"
								/>
								<p className="post-location-container"><i className=" material-icons">place</i>this is location</p>
							</a>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Dashboard
