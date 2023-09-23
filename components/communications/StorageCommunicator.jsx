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
if(typeof window !== 'undefined'){
	M = require( '@materializecss/materialize/dist/js/materialize.min.js')
}
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

export default function StorageCommunicator() {
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

	useEffect(() => {

		const sidenav = document.querySelectorAll(".sidenav");
		const tabs = document.querySelectorAll(".tabs");
		const datepicker = document.querySelectorAll(".datepicker")
		const autocomplete = document.querySelectorAll('.autocomplete');
		if(!init){
			const instances = M.Autocomplete.init(autocomplete, {
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
			M.Tabs.init(tabs, {
				swipeable: true,
			});
			M.Sidenav.init(sidenav, {
				onOpenEnd: (el) => { el.classList.toggle('nav-open') },
				onCloseEnd: (el) => { el.classList.toggle('nav-open') }
			});
			setInit(true)
			}
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
		offlineAddress: placesInputValue.current
	};
	let postWeatherData = {
		weatherUser: postWeather.current.value || null,
		weatherAPI: latestWeather || null,
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
			offlineAddress: null
		};
		postWeatherData = {
			weatherUser: postWeather.current.value || null,
			weatherAPI: weatherData.data || latestWeather || null,
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
		<div>
			{/* //! vertical navigation area! */}
			<div id="vertical-nav">
				<a href="#" data-target="slide-out" className="sidenav-trigger vertical-menu-btn">
					<i id="newpost-menu-btn" className="material-icons">menu</i>
				</a>
					<ul id="tabs" className="tabs center-align tabs">
						<li className="tab active"><a href="#tab1">Step 1</a></li>
						<li className="tab"><a href="#tab2">Step 2</a></li>
						<li className="tab"><a href="#tab3">Step 3</a></li>
					</ul>					
			</div>



			{/* 
				//TODO Kolla validering
				//TODO Kolla @media på formulär
				//TODO Fixa handleSubmit så allt sparas i fireStore
				//TODO Möjligen lägga till mer fält i TAB3 
				//TODO create onsuccess and on fail message on submit
			*/} 

			
		<div className="add-form-post-section">
			<div className="container row">
      			<div id="tab1" className="valign-wrapper">
        			<div className="col s12 tab-content">
						<h5 className="center-align white-text">Step 1</h5>			
						<div>
							<Typewriter 
								onInit={(typewriter) => {
									typewriter.changeDelay(50)
									.typeString("<span style=color:lightgray;font-size:1.5em;font-weight:bold;margin-block-start:0.83em;margin-block-end:0.83em;margin-inline-start:0px;margin-inline-end:0px;>Greetings traveler!</span>")
									.pauseFor(1000)
									.typeString("<br/> <span style=font-size:1.17em;font-weight:bold;margin-block-start:1em;margin-block-end:1em;margin-inline-start:0px;margin-inline-end:0px;color:lightgray;>Start your journey by completing this 3-step form...</span>")
									.start()
								}}
							/>
						</div>
						<div className="row new-post-form-wrapper">
							<form className="col s12 center-align" autoComplete="off">
								<div className="row">
									<div className="input-field col s11 l6">
										<i className="material-icons prefix white-text">public</i>
										<input ref={postCountry} onChange={(e) => setFormCountry(e.target.value)} type="text" id="autocomplete-input" className="autocomplete"/>
										<label htmlFor="autocomplete-input">Enter country</label>
										<span className="helper-text yellow-text">Enter country first to filter addresses below</span>
									</div>
										<PlacesAutocomplete inputValue={e => placesInputValue.current = e} countryCode={countryCode} dataFromChild={dataFromChild}/>						
								</div>
								<div className="row">
									<div className="input-field col s11 l6 datepicker-section">
										<i className="material-icons prefix white-text">event</i>
										<input id="datepicker" type="text" className="datepicker"/>
										<label htmlFor="datepicker">Select date</label>
									</div>
								</div>
							</form>
						</div>       
          				<a onClick={() => goToTab('tab2')} className="btn waves-effect waves-light right"><i className="material-icons right">chevron_right</i>Step 2</a>
        			</div>
      			</div>
      <div id="tab2" className="valign-wrapper">
        <div className="col s12 tab-content">
        	<h5 className="center-align white-text">Step 2</h5>
          	<div className="row new-post-form-wrapper">
				<form className="col s12 center-align" autoComplete="off">
					<div className="row">
						<div className="input-field col s8 l6">
							<i className="material-icons prefix white-text">create</i>
							<input ref={postTitle} id="postTitle" type="text" className="validate"/>
							<label htmlFor="postTitle">Title</label>
						</div>
					</div>
					<div className="row">
						<div className="input-field col s12">
							<i className="material-icons prefix white-text">comment</i>
							<textarea ref={postMainContent} id="textarea1" className="materialize-textarea white-text"></textarea>
							<label htmlFor="textarea1">Main content</label>
						</div>
					</div>
					<div className="row">
						<div className="input-field col s11 l6">
							<i className="material-icons prefix white-text">mood</i>
							<input ref={postMood} type="text" id="postMood" className="validate"/>
							<label htmlFor="postMood">How do you feel right now?</label>
						</div>
						<div className="input-field col s11 l6">
							<i className="material-icons prefix white-text">nights_stay</i>
							<input ref={postWeather} type="text" id="postWeather" className="validate"/>
							<label htmlFor="postWeather">How's the weather today?</label>
						</div>
					</div>
			  </form>
		  </div>
          <a onClick={() => goToTab('tab1')} className="btn waves-effect waves-light left"><i className="material-icons left">chevron_left</i>Step 1</a>
          <a onClick={() => goToTab('tab3')} className="btn waves-effect waves-light right"><i className="material-icons right">chevron_right</i>Step 3</a>
        </div>
      </div>
      <div id="tab3" className="valign-wrapper">
        <div className="col s12 tab-content">
			<h5 className="center-align white-text">Step 3</h5>
			<div className="row new-post-form-wrapper">
				<form className="col s12 center-align" autoComplete="off">
					<div className="row">
						<div className="file-field input-field col s11 l6">
							<div className="btn">
								<i className="material-icons left file-input-icon">attach_file</i>
								<span>File</span>
								<input onChange={handleMainImage} accept="image/*" type="file" id="file-selector"/>
							</div>
							<div className="file-path-wrapper">
								<input id="main-image-upload" type="text" className="file-path validate" placeholder="Upload Main-Image"/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="file-field input-field col s11 l6">
							<div className="btn">
								<i className="material-icons left file-input-icon">attach_file</i>
								<span>File</span>
								<input disabled={true} onChange={handleAdditionalFiles} accept={["image/*", "video/*"]} type="file" id="file-selector" multiple/>
							</div>
							<div className="file-path-wrapper">
								<input disabled={true} id="additional-file-upload" type="text" className="file-path validate" placeholder="(DISABLED) Upload additional images"/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col s6 push-s3">
							{isSuccessful && <div className="white-text green fileinput-error"><strong>{isSuccessful}</strong></div>}
							{isUploadLoading ? <CircularLoader loaderColor='spinner-green-only' loaderSize='small' /> : null}
							{hasError && <div className="white-text red darken-4 fileinput-error"><strong>{hasError}</strong></div>}
							{postMainImage && <ProgressBar initiator='POST_UPLOAD' mainImage={postMainImage} isUploading={setPostMainImage} setUploadedURL={setUploadedURL} fireError={setHasError} />}
							{/* {postAdditionalFiles && <ProgressBar additionalFiles={postAdditionalFiles}/>} */}
						</div>
					</div>
				</form>
			</div>
          <a onClick={() => goToTab('tab2')} className="btn waves-effect waves-light left"><i className="material-icons left">chevron_left</i>Step 2</a>
		  <button disabled={uploadedURL === null} onClick={handlePostSubmit} className="btn waves-effect waves-light right"><i className="material-icons right">send</i>Submit</button>
        </div>
      </div>
    </div>
	</div>
			
			
			
			{/* //! Slide-out menu Area! */}
			<ul id="slide-out" className="sidenav">
				<li><div className="user-view">
					<div className="background">
						<img src='/assets/lighthouse-sidenav.jpg' alt="side navigation background image" height="211" width="300" quality={60} />
					</div>
					<a href="#user"><img style={{objectFit: 'cover'}} className="circle" src={(currentUser && currentUser.photoURL) || "/assets/icons8-test-account.png"} alt="User profile picture" width="96" height="96" quality={60}/></a>
					<a href="#name"><span className="white-text name">{(currentUser && currentUser.displayName) ? currentUser.displayName : 'No Name'}</span></a>
					<a href="#email"><span className="white-text email">{currentUser && currentUser.email}</span></a>
				</div></li>
				<li onClick={closeSideNav}><Link href="/user/dashboard"><a href="#"><i className="material-icons">home</i>Home</a></Link></li>
				<li><a href="#!" onClick={handleLogout}><i className="material-icons">power_settings_new</i>Log out</a></li>
				<li onClick={closeSideNav}><Link href="/user/settings"><a href="#!"><i className="material-icons">settings</i>Settings</a></Link></li>
				<li><div className="divider"></div></li>
				<li><a className="subheader">Submenu</a></li>
				<li><a className="sidenav-close waves-effect" href="#!"><i className="material-icons">skip_previous</i>Close menu</a></li>
				<li onClick={closeSideNav}><Link href="/user/posts"><a href="/user/posts"><i className="material-icons">grid_on</i>View all posts</a></Link></li>
				<li onClick={closeSideNav}>
					<Link href="/user/receipts/home">
						<a href="#" ><i className="material-icons">receipt_long</i>Receipts</a>
					</Link>
				</li>
				<li onClick={closeSideNav}>
					<Link href="/weather">
						<a href="#" ><i className="material-icons">sunny</i>Weather</a>
					</Link> 
				</li>
			</ul>		
		</div>
	)
}
