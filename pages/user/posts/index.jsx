import {useEffect, useState} from 'react'
import withPrivateRoute from '../../../components/HOC/withPrivateRoute'
import {projectFirestore} from '../../../firebase/config'
import BlogList  from '../../../components/BlogList'
import SideNav from 'components/nav/Sidenav'
import { fetchUserblog, fetchUserHotels, fetchDbUserData } from '../../../components/utility/subscriptions'

const index = ({userAuth}) => {
	const userDbRef = projectFirestore.collection('testUserCollection').doc(userAuth.uid)
	const [blogPosts, setBlogPosts] = useState([])
	const [stayingHotels, setStayingHotels] = useState([])
	const [dbUserData, setDbUserData] = useState([])
	const [byCountrySearchTerm, setByCountrySearchTerm] = useState('')
	const [searchText, setSearchText] = useState('')
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
		//! inside return, same as ComponentWillUnmount! unsubscribe firestore listeners
		
		return () => {
			unsubscribePosts
			unsubscribeHotels
			unsubscribeDbUserData
		}
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
		setByCountrySearchTerm(dataFromChildToParent)
	}

	return (
		<div className="dashboard-main">
			<SideNav dataFromChildToParent={filterCountry} dbUserData={dbUserData}/>
			<BlogList countrySearchTerm={byCountrySearchTerm} userBlogs={blogPosts}/>
		</div>
	)
}

index.getInitialProps = async props => {
	// console.info('##### Congratulations! You are authorized! ######', props);
	return {};
};
export default withPrivateRoute(index)
