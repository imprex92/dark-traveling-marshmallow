import {useState, useEffect} from 'react'
import { projectFirestore } from 'firebase/config'
import { useAuth } from 'contexts/AuthContext'
import Sidenav from 'components/nav/Sidenav'
import withPrivateRoute from 'components/HOC/withPrivateRoute'
import { fetchUserblog, fetchUserHotels, fetchDbUserData } from 'components/utility/subscriptions'
import Geolocator from 'components/Geolocator'
import Slides from 'components/Slides'
import styles from 'styles/dashboard.module.css'
import { useRouter } from 'next/router'
if(typeof window !== 'undefined'){
	M = require( '@materializecss/materialize/dist/js/materialize.min.js')
}

const dashboard = ({userAuth, userBlogs}) => {
	const loggedInUserId = userAuth?.uid
	const userDbRef = projectFirestore.collection('testUserCollection').doc(loggedInUserId)
	const route = useRouter()
	const {currentUser} = useAuth()
	const [UserFirstname, setUserFirstname] = useState(null)
	const [searchText, setSearchText] = useState('')
	const [broadcastMessage, setBroadcastMessage] = useState(null)
	const [blogPosts, setBlogPosts] = useState([])
	const [stayingHotels, setStayingHotels] = useState([])
	const [dbUserData, setDbUserData] = useState([])
	const [byCountrySearchTerm, setByCountrySearchTerm] = useState('')
	const [randomIndex, setRandomIndex] = useState(0)
	let blogsToSend;
	const sentences = [
		"Unlock the gateway to your uncharted adventures - Click here to craft your inaugural travel tale.",
		"Dive into the enigma of unexplored destinations - Click here to pen your maiden travel chronicle.",
		"Embark on a journey of secrets untold - Click here to embark on your inaugural travel odyssey.",
		"Venture into the unknown and create your debut travel saga - Click here to start writing your first travel epic."
	];

	useEffect(() => {
		//! ComponentWillMount!
		const unsubscribePosts = userDbRef.collection('blogPosts').onSnapshot(blogPostListener, err => {
			console.error('Subscribe to blogposts failed', err);
			M.toast({text: `Subscribe to blogposts failed, ${err}`})
		})
		const unsubscribeHotels = userDbRef.collection('stayingHotel').onSnapshot(hotelListener, err => {
			console.error('Subscribe to Hotels failed', err);
			M.toast({text: `Subscribe to hotels failed, ${err}`})
		})
		const unsubscribeDbUserData = userDbRef.onSnapshot(DbUserDataListener, err => {
			console.error('Subscribe to DB failed', err);
			M.toast({text: `Subscribe to DB failed, ${err}`})
		})
		
		if(currentUser){
			const userName = currentUser.displayName
			const firstName = userName;
			setUserFirstname(firstName)
		}
		const lang = navigator.language || navigator.userLanguage;
		const language = lang.split('-')[0];
		
		return () => {
			unsubscribePosts()
			unsubscribeHotels()
			unsubscribeDbUserData()
		}
	}, [])
	useEffect(() => {
		blogPosts.length === 0 ? setBlogPosts(userBlogs) : ''
	}, [])
	useEffect(() => {
	  	const randomIndex = Math.floor(Math.random() * sentences.length)
		setRandomIndex(randomIndex)
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


	//! SearchTerm, filter vid click på land i navbar, kommer från navbar, skickas vidare till Slides componenten
	function filterCountry(dataFromChildToParent){
		console.log('User wants to search for: ', dataFromChildToParent);
		setByCountrySearchTerm(dataFromChildToParent)
	}

	return (
		<div className={styles.dashboardMain}>	
			<Sidenav dataFromChildToParent={filterCountry} dbUserData={dbUserData}/>
			<div className={styles.wrapper}>
				<Geolocator />
				<div className="row valign-wrapper">
					<div className={`col ${styles.greetingSection}`}>				
						<h4>Hi {currentUser && UserFirstname}!</h4>
						<h5>Let's start your journey</h5>					
					</div>
				</div>
				<div className="row valign-wrapper">
					<form className={`col s12 ${styles.searchbarSection}`}>
						<div className="row">
							<div className={`input-field col s8 push-s2 m6 push-m3 ${styles.searchBox}`}>
								<i className="material-icons prefix">search</i>
								<input type="search" className="white-text" onChange={(e) => setSearchText(e.target.value)} name="" id="search-field"/>
								<label className="white-text" htmlFor="search-field">Make a search</label>
							</div>
						</div>
					</form>
				</div>
				<div className={`row valign-wrapper ${styles.postSlides} ${userBlogs.length > 0 ? styles.hasContent : styles.postSlides_empty}`}>
					<div className={`col s12 center-align ${userBlogs.length > 0 ? styles.postCarouselSection : styles.postCarouselSection_empty}`}>
						<div className="custom-body">
							{/* //! SearchTerm, filter vid click på land i navbar, kommer från navbar, skickas vidare till Slides componenten */}
							{/* //! userBlogs, skickar vidare bloggarna vi fått med subscription från Firestore till Slides för att visa och visa eventuella sökresultat */}
							{userBlogs.length > 0 ? 
							<Slides searchByText={searchText} countrySearchTerm={byCountrySearchTerm} userBlogs=
							{blogPosts}/> 
							: <AddFirstPost route={route} sentences={sentences} randomIndex={randomIndex} /> 
							}
						</div>
					</div>
				</div>			
			</div>
		</div>
	)
}

const AddFirstPost = ({sentences, randomIndex, route}) => {
	const redirect = () =>{
		route.push("/user/newpost")
	}

	return(
		<div onClick={redirect} className={styles.noPosts_root}>
			<div className={styles.noPostContainer}>
				<h5 className={styles.sentence}>{sentences[randomIndex]}</h5>
				<span className={`material-symbols-outlined ${styles.noPostIcon}`}>
					edit_document
				</span>
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

