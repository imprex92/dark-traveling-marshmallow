import {useState, useEffect} from 'react'
import Image from 'next/image'
import axios from 'axios'
import {projectFirestore, projectStorage, projectTimestampNow, projectAuth} from '../../firebase/config'
import Slides from '../../components/Slides'
import { useAuth } from '../../contexts/AuthContext'
import Sidenav from '../../components/nav/SideNav'
import withPrivateRoute from '../../components/HOC/withPrivateRoute'
import { fetchUserblog, fetchUserHotels, fetchDbUserData } from '../../components/utility/subscriptions'
if(typeof window !== 'undefined'){
	M = require( 'materialize-css/dist/js/materialize.js')
}
//TODO Write a title for every page

const dashboard = (userData) => {
	const logedInUserId = projectAuth.currentUser.uid
	const userDbRef = projectFirestore.collection('testUserCollection').doc(logedInUserId)
	const {currentUser} = useAuth()
	const [UserFirstname, setUserFirstname] = useState(null)
	const [userLocation, setUserLocation] = useState(null)
	const [reversedGeolocation, setReversedGeolocation] = useState(null)
	const [locationLoading, setLocationLoading] = useState(false)
	const [locationError, setLocationError] = useState(null)
	const [searchText, setSearchText] = useState(null)
	const [broadcastMessage, setBroadcastMessage] = useState(null)
	const [blogPosts, setBlogPosts] = useState([])
	const [stayingHotels, setStayingHotels] = useState([])
	const [dbUserData, setDbUserData] = useState([])
	const [byCountrySearchTerm, setByCountrySearchTerm] = useState('')
	let blogsToSend;
	useEffect(() => {
		//! ComponentWillMount!
		const unsubscribePosts = userDbRef.collection('blogPosts').onSnapshot(blogPostListener, err => {
			console.error('Subscibe to blogposts failed', err);
		})
		//! Subscribe to hotels as well?
		const unsubscribeHotels = userDbRef.collection('stayingHotel').onSnapshot(hotelListener, err => {
			console.error('Subscribe to Hotels failed', err);
		})
		const unsubscribeDbUserData = userDbRef.onSnapshot(DbUserDataListener, err => {
			console.error('Subscribe to Firestore userData failed', err);
		})
		let carousel = document.querySelectorAll(".carousel")
		M.Carousel.init(carousel, {
			dist: -100,
			shift: 0,
			padding: 20,
			numVisible: 5,
			indicators: true,
			fullWidth: false
		})

		
		if(currentUser){
			let userName = currentUser.displayName
			let firstName = userName.split(' ')[0];
			setUserFirstname(firstName)
		}
		let lang = navigator.language || navigator.userLanguage;
		let language = lang.split('-')[0];
		console.log(language);

		//! inside return, same as ComponentWillUnmount! unsubscribe firestore listeners
		
		return () => {
			unsubscribePosts
			unsubscribeHotels
			unsubscribeDbUserData
		}
	}, [])

	//! 3 firestore listeners!
	function blogPostListener(){
		fetchUserblog(userData.userAuth.uid)
		.then(blogs => {
			blogsToSend = blogs
			setBlogPosts(blogs)
		})
	}
	function hotelListener(){
		fetchUserHotels(userData.userAuth.uid)
		.then(userHotels => {
			setStayingHotels(userHotels)
		})
	}
	function DbUserDataListener(){
		fetchDbUserData(userData.userAuth.uid)
		.then(user => {
			setDbUserData(user)
		})
	}

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
	//! SearchTerm, filter vid click på land i navbar, kommer från navbar, skickas vidare till Slides componenten
	function filterCountry(dataFromChildToParent){
		console.log('User wants to search for: ', dataFromChildToParent);
		setByCountrySearchTerm(dataFromChildToParent)
	}


	return (
		<div className="dashboard-main">	
			<Sidenav dataFromChildToParent={filterCountry} dbUserData={dbUserData}/>
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


					<div className="custom-body">
						{/* //! SearchTerm, filter vid click på land i navbar, kommer från navbar, skickas vidare till Slides componenten */}
						{/* //! userBlogs, skickar vidare bloggarna vi fått med subscription från Firetore till Slides för att visa och visa eventuella sökresultat */}
						<Slides searchByText={searchText} countrySearchTerm={byCountrySearchTerm} userBlogs={blogPosts}/>
					</div>





						{/* <div className="carousel post-carousel"> */}
						{/* {blogPosts.map((post) => (
								<a href="#one!" className="carousel-item post-carousel-item">
									<Image
									src={post.imgURL}
									alt="post image"
									quality={75}
									layout="fill"
									/>
									<p className="post-location-container"><i className=" material-icons">place</i>this is location</p>
								</a>
							))} */}
							{/* {userData.userBlogs.map((post) => (
								<a href="#one!" className="carousel-item post-carousel-item" key={post.id}>
									<img
									src="https://res.cloudinary.com/allseeingeye/image/upload/v1605473801/nexusBoats/boat_019_lrefjr.jpg"
									alt="post image"
									/>
									<p className="post-location-container"><i className=" material-icons">place</i>this is location</p>
								</a>
							))} */}
							 {/* <a href="#one!" className="carousel-item post-carousel-item">
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
							</a> */}
						{/* </div> */}
					</div>
				</div>
			
		</div>
	)
}

dashboard.getInitialProps = async props => {
	console.info("### Yay! you're Authorized!", props);
	if(projectAuth.currentUser){
		const logedInUserId = projectAuth.currentUser.uid
		const userDbRef = projectFirestore.collection('testUserCollection').doc(logedInUserId)
		let userData;
		// let userBlogs = [];
		// let userStayingHotels = [];
		if(logedInUserId == null){
			userData = (await userDbRef.get()).data()
			// if(userData){
			// 	await userDbRef.collection('blogPosts').get()
			// 	.then(docSet => {
			// 		docSet.forEach(doc => {
			// 			userBlogs.push({
			// 				id: doc.id,
			// 				...doc.data()
			// 			})
			// 		})
			// 		console.log(userBlogs);
			// 		return userBlogs
			// 	})
			// 	.catch(err => {
			// 		console.error('Fetch user blogs Error', err);
			// 		setBroadcastMessage(err)
			// 	})
			// 	await userDbRef.collection('stayingHotel').get()
			// 	.then(docSet => {
			// 		docSet.forEach(doc =>  {
			// 			userStayingHotels.push({
			// 				id: doc.id,
			// 				...doc.data()
			// 			})
			// 		})
			// 		return userStayingHotels
			// 	})
			// 	.catch(err => {
			// 		console.error('Fetch user hotels Error', err);
			// 		setBroadcastMessage(err)
			// 	})
			// }
		console.log('userData from initialProps', userData);
		return userData
		// return {userData, userBlogs: userBlogs, userStayingHotels: userStayingHotels}
	}else{
		console.log('No user present');
	}
}
	return {}
}

// export default dashboard
export default withPrivateRoute(dashboard)

