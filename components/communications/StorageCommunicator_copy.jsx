import { useEffect, useState, useRef } from 'react'
import firebase from 'firebase/app'
import { projectTimestampNow } from '../../firebase/config'
import { handleSaveNewPost } from '../utility/subscriptions'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/AuthContext'
import Typewriter from 'typewriter-effect';
import countries from '../utility/countries.json'
import PlacesAutocomplete from '../utility/GooglePlacesAutocomplete'
import { overwrite, getCode } from 'country-list'
import ProgressBar from '../ProgressBar'
import { fetchWeatherByCoords } from 'components/utility/WeatherHandler'
import useSiteSettings from 'store/siteSettings';
import CircularLoader from 'components/loaders/preloaders/CircularLoader'
import styles from 'styles/newPost.module.css'

import SideNav from 'components/nav/Sidenav'
import AddPostForm from 'components/AddPostForm'

require('dotenv').config()

//? Temporary fix for country-list not finding some selected countries
overwrite([
	{
		"code": "UK",
		"name": "United Kingdom"
	},
	{
		"code": "US",
		"name": "United States"
	}
])

export default function StorageCommunicator_copy() {
	const router = useRouter()
	const [error, setError] = useState(null)
	const { logout, currentUser } = useAuth()
	const [formCountry, setFormCountry] = useState('')
	const [countryCode, setCountryCode] = useState(null)
	const [isSuccessful, setIsSuccessful] = useState(null)
	const [hasError, setHasError] = useState(null)
	const [init, setInit] = useState(false)
	const [isUploadLoading, setUploadLoading] = useState(false)
	const placesInputValue = useRef('')
	const countryIfOffline = useRef(null)
	const { latestWeather } = useSiteSettings(state => state.data) ?? { latestWeather: {} } 
	
	//* TAB 1 inputs
	const postCountry = useRef(null)
	const [datePicker, setDatePicker] = useState(new Date())
	const [postLocation, setPostLocation] = useState([])

	//* TAB 2 inputs
	const postTitle = useRef(null)
	const postMainContent = useRef(null)
	const postMood = useRef(null)
	const postWeather = useRef(null)

	//* TAB 3 inputs
	const [postMainImage, setPostMainImage] = useState(null)
	const [postAdditionalFiles, setPostAdditionalFiles] = useState(null)

	const fileTypeImage = ['image/jpeg', 'image/gif', 'image/png', 'image/raw', 'image/heif', 'image/webp', 'image/heic']
	const filetypeVideo = ["video/mp4", "video/mov", "video/wmv", "video/avi", "video/avchd", "video/webm", "video/mkv", "video/flv", "video/3gp"]
	const maxSize = 209715200;

	//* onUpload finish
	const [uploadedURL, setUploadedURL] = useState(null)

	const sidenav = document.querySelectorAll(".sidenav");
	const tabs = document.querySelectorAll(".tabs");
	const datepicker = document.querySelectorAll(".datepicker")
	const autocomplete = document.querySelectorAll('.autocomplete');

	M.Tabs.init(tabs, {});
	M.Autocomplete.init(autocomplete, {
		data: countries,
		minLength: 1,
		onAutocomplete: (selected) => {getCountryCode(selected); countryIfOffline.current = selected}
	});
	M.Datepicker.init(datepicker, {
		autoClose: true,
		format: 'mmmm d, yyyy',
		defaultDate: new Date(),
		setDefaultDate: true,
		firstDay: 1,
		maxDate: new Date(),
		onSelect: (date) => {setDatePicker(date)},			
	})
	M.Sidenav.init(sidenav, {
		onOpenEnd: (el) => { el.classList.toggle('nav-open') },
		onCloseEnd: (el) => { el.classList.toggle('nav-open') }
	});

	useEffect(() => {
		}, [uploadedURL]) //! formCountry?
		
	async function handleLogout() {
		setError('')
		try{
			await logout()
			closeSideNav()
			router.push('/login')
		}
		catch{
			setError("couldn't log you out")
			console.error(error);
			M.toast({text: "We couldn't log you out!", error, classes: 'rounded'});
		}
	}

	const getCountryCode = (country) => { setCountryCode(getCode(country).toLowerCase()) ?? country }

	function goToTab(tabId) {
		const instance = M.Tabs.getInstance(document.querySelector(".tabs"));
		instance.select(tabId);
		instance.updateTabIndicator();
	}

	function handleMainImage(e){
		
		const selectedImage = e.target.files[0]
		if(selectedImage && fileTypeImage.includes(selectedImage.type)){
			setHasError(null)
			const element = document.getElementById('main-image-upload')
			element.classList.add('invalid')
			setPostMainImage(selectedImage)
		}else{
			setHasError("You either didn't add a picture or file is not an image.")
			setPostMainImage(null)
			document.getElementById('main-image-upload').classList.add('red')
			document.getElementById('main-image-upload').classList.remove('valid')
		}
	}
	function handleAdditionalFiles(e){
		
		const selectedFiles = e.target.files
		if(selectedFiles && (fileTypeImage.includes(selectedFiles.type) || filetypeVideo.includes(selectedFiles.type)) && selectedFiles.size <= maxSize){
			setHasError(null)
			document.getElementById('additional-file-upload').classList.add('valid')
			setPostAdditionalFiles(selectedFiles)
		}else {
			document.getElementById('additional-file-upload').classList.add('red')
			setHasError("You either didn't add a supported format (image or video) or file is too large (200MB)")
			setPostAdditionalFiles(null)
		}
	}

	async function handlePostSubmit(e) {
	e.preventDefault();
	setUploadLoading(true)
	let postLocationData = {
		country: countryIfOffline.current ?? formCountry,
		state: null,
		city: null,
		geopoint: 'Coordinates not found',
		plusCode:  null,
		offlineAddress: placesInputValue.current,
		wasApiOffline: true
	};
	let postWeatherData = {
		weatherUser: postWeather.current.value || null,
		weatherAPI: latestWeather || null,
		wasApiOffline: true
	}

	if( postLocation.length > 0 ){
		const addressComponents = getAddressComponents(postLocation.locationData);
		const { weatherData, geoPoint } = await getGeoPointAndWeather(postLocation.coordinates)

		// Create postLocationData object
		postLocationData = {
			country: getComponentValue(addressComponents, 'country') || null,
			state: getComponentValue(addressComponents, 'administrative_area_level_1') || postLocation.locationData[0].vicinity,
			city: getComponentValue(addressComponents, 'postal_town') || getComponentValue(addressComponents, 'locality') || postLocation.locationData[0].name,
			geopoint: geoPoint || 'Coordinates not found',
			plusCode: postLocation.locationData[0]?.plus_code || null,
			offlineAddress: null,
			wasApiOffline: false
		};
		postWeatherData = {
			weatherUser: postWeather.current.value || null,
			weatherAPI: weatherData.data || latestWeather || null,
			wasApiOffline: false
		}
	}
	// Create formData object
	const formData = {
		user_uid: currentUser.uid,
		createdByUser: currentUser.displayName,
		imgURL: uploadedURL || null,
		postTitle: postTitle.current.value || null,
		postContent: postMainContent.current.value || null,
		postMood: postMood.current.value || null,
		postWeatherData,
		postLocationData,
		timestamp: projectTimestampNow,
		pickedDateForPost: datePicker,
		slug: createSlug(postTitle.current.value),
	};

	try {
		const res = await handleSaveNewPost({
		userID: currentUser.uid,
		dataToSave: formData,
		});
		setUploadLoading(false)
		M.toast({text: res.message})
		setIsSuccessful(res.message);
		setTimeout(() => {
			setIsSuccessful(null)
			router.push('/user/posts')
		}, 1000);
	} catch (err) {
		setHasError('Sorry! Something went wrong while uploading');
		M.toast({text: err.message})
		setUploadLoading(false)
	}
	}

	// Function to extract address components
	function getAddressComponents(locationData) {
	return locationData[0]?.address_components || [];
	}

	// Function to get a component's value by its type
	function getComponentValue(components, type) {
	const component = components.find(el => el.types[0] === type);
	return component?.long_name || null;
	}

	// Function to create a GeoPoint object
	async function getGeoPointAndWeather(coordinates) {
		if (coordinates.length > 0) {
			const { lat, lng } = coordinates[0];

			const weatherData = await fetchWeatherByCoords({ latitude: lat, longitude: lng })
			const geoPoint = new firebase.firestore.GeoPoint(lat, lng)
			
			return { weatherData, geoPoint };
		}
		return null;
	}

	function dataFromChild(dataFromChild){
		setPostLocation(dataFromChild)
	}

	function createSlug(title){
		const titleToSlug = title
		.replace(/å/g, 'a')
		.replace(/Å/g, 'A')
		.replace(/ä/g, 'a')
		.replace(/Ä/g, 'A')
		.replace(/ö/g, 'o')
		.replace(/Ö/g, 'o')
		.replace(/[.,!?/]/g, '')
		const slug = (titleToSlug.replace(/ /g, "-")) + (Math.floor((Math.random() * 10) + 1));
		return slug
	}
	function closeSideNav(){
		const instance = M.Sidenav.getInstance(document.querySelector(".sidenav"))
		instance.close()
	}
	
	return (
        <>
			<div id={styles.newPostForm} className={styles.main}>
				<div className={styles.navigation}>
					<SideNav dbUserData={currentUser}/>
				</div>
				<div className={styles.content}>
					<AddPostForm dbUserData={currentUser} />
				</div>
			</div>
		</>
    );
}
