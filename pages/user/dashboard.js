import {useState, useEffect} from 'react'
import axios from 'axios'
import {projectFirestore} from '../../firebase/config'
import Slides from '../../components/Slides'
import { useAuth } from '../../contexts/AuthContext'
import Sidenav from '../../components/nav/SideNav'
import withPrivateRoute from '../../components/HOC/withPrivateRoute'
import { fetchUserblog, fetchUserHotels, fetchDbUserData } from '../../components/utility/subscriptions'
if(typeof window !== 'undefined'){
	M = require( '@materializecss/materialize/dist/js/materialize.min.js')
}
//TODO Write a title for every page

const dashboard = ({userAuth, userBlogs}) => {
	const logedInUserId = userAuth?.uid
	const userDbRef = projectFirestore.collection('testUserCollection').doc(logedInUserId)
	const {currentUser} = useAuth()
	const [UserFirstname, setUserFirstname] = useState(null)
	const [userLocation, setUserLocation] = useState(null)
	const [reversedGeolocation, setReversedGeolocation] = useState(null)
	const [locationLoading, setLocationLoading] = useState(false)
	const [locationError, setLocationError] = useState(null)
	const [searchText, setSearchText] = useState('')
	const [broadcastMessage, setBroadcastMessage] = useState(null)
	const [blogPosts, setBlogPosts] = useState([])
	const [stayingHotels, setStayingHotels] = useState([])
	const [dbUserData, setDbUserData] = useState([])
	const [byCountrySearchTerm, setByCountrySearchTerm] = useState('')
	const [init, setInit] = useState(false)
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
		if(!init){
			let carousel = document.querySelectorAll(".carousel")
			M.Carousel.init(carousel, {
				dist: -100,
				shift: 0,
				padding: 20,
				numVisible: 5,
				indicators: true,
				fullWidth: false
			})
			setInit(true)
		}
		
		if(currentUser){
			let userName = currentUser.displayName
			let firstName = userName;
			setUserFirstname(firstName)
		}
		let lang = navigator.language || navigator.userLanguage;
		let language = lang.split('-')[0];

		//! inside return, same as ComponentWillUnmount! unsubscribe firestore listeners
		
		return () => {
			unsubscribePosts
			unsubscribeHotels
			unsubscribeDbUserData
		}
	}, [])
	useEffect(() => {
		blogPosts.length === 0 ? setBlogPosts(userBlogs) : ''
	}, [])

	//! 3 firestore listeners!
	function blogPostListener(){
		fetchUserblog(userAuth.uid)
		.then(blogs => {
			blogsToSend = blogs
			setBlogPosts(blogs)
		})
	}
	function hotelListener(){
		fetchUserHotels(userAuth.uid)
		.then(userHotels => {
			setStayingHotels(userHotels)
		})
	}
	function DbUserDataListener(){
		fetchDbUserData(userAuth.uid)
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
						<h5>Let's start your journey</h5>					
					</div>
				</div>
				<div className="row valign-wrapper">
					<form className="col s12 searchbar-section">
						<div className="row">
							<div className="input-field col s8 push-s2 m6 push-m3">
								<i className="material-icons prefix">search</i>
								<input type="search" className="white-text" onChange={(e) => setSearchText(e.target.value)} name="" id="search-field"/>
								<label className="white-text" htmlFor="search-field">Make a search</label>
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
					</div>
				</div>			
		</div>
	)
}

dashboard.getInitialProps = async props => {
	// console.info('##### Congratulations! You are authorized! ######', props);
	let userBlogs = []
	const userDbRef = projectFirestore.collection('testUserCollection').doc(props.auth.uid)
	await userDbRef.collection('blogPosts').get()
	.then(docSet => {
		if(docSet !== null){
			docSet.forEach(doc => userBlogs.push(({...doc.data(), id: doc.id})))
		}
	})
	return {userBlogs};
};

export default withPrivateRoute(dashboard)

