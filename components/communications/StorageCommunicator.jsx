import { useEffect, useState, useRef } from 'react'
import firebase from 'firebase/app'
import {projectTimestampNow} from '../../firebase/config'
import { handleSaveNewPost } from '../utility/subscriptions'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/AuthContext'
import Typewriter from 'typewriter-effect';
import countries from '../utility/countries.json'
import PlacesAutocomplete from '../utility/GooglePlacesAutocomplete'
import countryList from 'country-list'
import ProgressBar from '../ProgressBar'
if(typeof window !== 'undefined'){
	M = require( '@materializecss/materialize/dist/js/materialize.min.js')
}
require('dotenv').config()

export default function StorageCommunicator({userAuth}) {
	const router = useRouter()
	const [error, setError] = useState(null)
	const { logout, currentUser } = useAuth()
	const [formCountry, setFormCountry] = useState('')
	const [countryCode, setCountryCode] = useState(null)
	const [isSuccessful, setIsSuccessful] = useState(null)
	const [hasError, setHasError] = useState(null)
	const [init, setInit] = useState(false)
	
	//* TAB 1 inputs
	let postCountry = useRef(null)
	const [datePicker, setDatePicker] = useState(new Date())
	const [postLocation, setPostLocation] = useState([])

	//* TAB 2 inputs
	let postTitle = useRef(null)
	let postMainContent = useRef(null)
	let postMood = useRef(null)
	let postWeather = useRef(null)

	//* TAB 3 inputs
	const [postMainImage, setPostMainImage] = useState(null)
	const [postAdditionalFiles, setPostAdditionalFiles] = useState(null)

	const fileTypeImage = ['image/jpeg', 'image/gif', 'image/png', 'image/raw', 'image/heif', 'image/webp', 'image/heic']
	const filetypeVideo = ["video/mp4", "video/mov", "video/wmv", "video/avi", "video/avchd", "video/webm", "video/mkv", "video/flv", "video/3gp"]
	const maxSize = 209715200;

	//* onUpload finish
	const [uploadedURL, setUploadedURL] = useState(null)

	useEffect(() => {

		let sidenav = document.querySelectorAll(".sidenav");
		let tabs = document.querySelectorAll(".tabs");
		let datepicker = document.querySelectorAll(".datepicker")
		let autocomplete = document.querySelectorAll('.autocomplete');
		if(!init){
			let instances = M.Autocomplete.init(autocomplete, {
				data: countries,
				minLength: 1,
				onAutocomplete: (selected) => getCountryCode(selected)
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
			console.log(error);
			M.toast({text: "We couldn't log you out!", error, classes: 'rounded'});
		}
	}
	function getCountryCode(country){
		setCountryCode(countryList.getCode(country).toLowerCase())
		console.log(countryCode);
	}

	function goToTab(tabId) {
		let instance = M.Tabs.getInstance(document.querySelector(".tabs"));
		instance.select(tabId);
		instance.updateTabIndicator();
	}

	function handleMainImage(e){
		
		let selectedImage = e.target.files[0]
		console.log(selectedImage)
		if(selectedImage && fileTypeImage.includes(selectedImage.type)){
			setHasError(null)
			let element = document.getElementById('main-image-upload')
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
		
		let selectedFiles = e.target.files
		console.log(selectedFiles)
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

	async function handlePostSubmit(e){
		e.preventDefault();
		const addressDetails = postLocation.locationData[0].address_components;
		let getCountry = addressDetails.find(el => el.types[0] === 'country')
		let getState = addressDetails.find(el => el.types[0] === 'administrative_area_level_1')
		let getCity = addressDetails.find(el => el.types[0] === 'postal_town')
		let getCity2 = addressDetails.find(el => el.types[0] === 'locality')

		let formData = {
			createdByUser: currentUser.displayName,
			imgURL: uploadedURL ||'No image selected',
			postTitle: postTitle.current.value || null,
			postContent: postMainContent.current.value || null,
			postMood: postMood.current.value || null,
			postWeather: { // TODO weather
				weatherUser: postWeather.current.value || null,
				weatherAPI: '' //! koppla med väder API
				// degrees:
			},			
			postLocationData: {
				country: getCountry?.long_name || null,
				state: getState?.long_name || postLocation.locationData[0].vicinity,
				city: getCity?.long_name || getCity2?.long_name || postLocation?.locationData[0].name,
				geopoint: new firebase.firestore.GeoPoint(postLocation.coordinates[0].lat, postLocation.coordinates[0].lng) || 'Coordinates not found',
				plusCode: postLocation?.locationData[0].plus_code || null 
			},
			timestamp: projectTimestampNow,
			pickedDateForPost: datePicker,
			slug: createSlug(postTitle.current.value),
		}
		handleSaveNewPost({
			userID: currentUser.uid, 
			dataToSave: formData
		})
		.then(res => {
			console.log('Success! ID: ', res);
			setIsSuccessful('Success! Post saved!')
		})
		.catch(err => {
			console.log('Something went wrong! ', err);
			setHasError('Sorry! Something went wrong while uploading')
		})

	}

	function dataFromChild(dataFromChild){
		// console.log('this is data from child' ,dataFromChild);
		setPostLocation(dataFromChild)
		// console.log(postLocation);
	}

	function createSlug(title){
		let titleToSlug = title
		.replace(/å/g, 'a')
		.replace(/Å/g, 'A')
		.replace(/ä/g, 'a')
		.replace(/Ä/g, 'A')
		.replace(/ö/g, 'o')
		.replace(/Ö/g, 'o')
		.replace(/[.,!?/]/g, '')
		let slug = (titleToSlug.replace(/ /g, "-")) + (Math.floor((Math.random() * 10) + 1));
		return slug
	}
	function closeSideNav(){
		let instance = M.Sidenav.getInstance(document.querySelector(".sidenav"))
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
									.pauseFor(350)
									.deleteChars(9)
									.pauseFor(200)
									.typeString("<span style=color:lightgray;font-size:1.5em;font-weight:bold;margin-block-start:0.83em;margin-block-end:0.83em;margin-inline-start:0px;margin-inline-end:0px;>or...</span>")
									.pauseFor(350)
									.deleteChars(5)
									.pauseFor(200)
									.typeString(`<span style=color:lightgray;font-size:1.5em;font-weight:bold;margin-block-start:0.83em;margin-block-end:0.83em;margin-inline-start:0px;margin-inline-end:0px;>${currentUser.displayName ? currentUser.displayName : 'traveler'}!</span>`)
									.pauseFor(2000)
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
										<PlacesAutocomplete countryCode={countryCode} dataFromChild={dataFromChild}/>						
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
