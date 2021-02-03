import { useEffect, useState, useRef } from 'react'
import { projectFirestore, projectTimestampNow, projectStorage } from '../../firebase/config'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/AuthContext'
import { getCurrentDate } from '../hooks/getCurrentDate'
import Image from 'next/image'
import Typewriter from 'typewriter-effect';
import countries from '../hooks/countries.json'
import PlacesAutocomplete from '../hooks/GooglePlacesAutocomplete'
import countryList from 'country-list'
if(typeof window !== 'undefined'){
	M = require( 'materialize-css/dist/js/materialize.js')
}
require('dotenv').config()




export default function StorageCommunicator() {
	const [gmapsLoaded, setGmapsLoaded] = useState(false)
	const router = useRouter()
	const [error, setError] = useState(null)
	const { logout, currentUser } = useAuth()
	const [formCountry, setFormCountry] = useState(null)
	const [countryCode, setCountryCode] = useState(null)
	const [datePicker, setDatePicker] = useState(null)
	// let formCountry = useRef(null)
	let postLocation = useRef(null)
	let postCity = useRef(null)

	useEffect(() => {
		if(formCountry){
			setCountryCode(countryList.getCode(formCountry))
		}
		console.log(countryCode);
		console.log(formCountry);

		let sidenav = document.querySelectorAll(".sidenav");
		let tabs = document.querySelectorAll(".tabs");
		let datepicker = document.querySelectorAll(".datepicker")
		M.Datepicker.init(datepicker, {
			autoClose: true,
			format: 'mmmm d, yyyy',
			defaultDate: new Date(),
			setDefaultDate: true,
			firstDay: 1,
			maxDate: new Date(),
			onSelect: (date) => {setDatePicker(date);},			
		})
		M.Tabs.init(tabs, {
			swipeable: true,
			});
		M.Sidenav.init(sidenav, {});			  
		var autocomplete = document.querySelectorAll('.autocomplete');
		var instances = M.Autocomplete.init(autocomplete, {data: countries, minLength: 1});
		})

	async function handleLogout() {
		setError('')
		try{
			console.log('inside handdeler');
			await logout()
			router.push('/login')
		}
		catch{
			setError("couldn't log you out")
			console.log(error);
			M.toast({html: "We couldn't log you out!", error, classes: 'rounded'});
		}
	}

	function goToTab(tabId) {
		let instance = M.Tabs.getInstance(document.querySelector(".tabs"));
		instance.select(tabId);
		instance.updateTabIndicator();
	}

	function setTodayDate(){
		let instance = M.Datepicker.getInstance(document.querySelector(".datepicker"))
		instance.setDate(new Date())
	}

	async function handlePostSubmit(e){
		e.preventDefault();

	}

	function dataFromChild(dataFromChild){
		console.log('this is data from child' ,dataFromChild);
	}

	return (
		<div>
			{/* //! vertical navigation area! */}
			<div id="vertical-nav">
				<a href="#" data-target="slide-out" className="sidenav-trigger vertical-menu-btn">
					<i className="material-icons">menu</i>
				</a>
				<div className="new">
					<ul id="tabs" className="tabs center-align tabs">
						<li className="tab active"><a href="#tab1">tab1</a></li>
						<li className="tab"><a href="#tab2">tab2</a></li>
						<li className="tab"><a href="#tab3">tab3</a></li>
					</ul>					
				</div>
			</div>



			{/* //TODO useRef() eller useState på alla input-fält
				//? Iconer på flesta knappar
				//TODO Kolla validering
				//TODO Kolla @media på formulär
				//TODO Fixa handleSubmit så allt sparas i fireStore
				//TODO Fixa så vald fil sparas i Storage och filens URL sparas i fireStore
				//TODO Möjligen lägga till mer fält i TAB3 */} 

			
		<div className="add-form-post-section">
			<div className="container row">
      			<div id="tab1" className="">
        			<div className="col s12 tab-content ">
						<h5 className="center-align">Tab1</h5>			
						<div>
							<Typewriter 
								onInit={(typewriter) => {
									typewriter.typeString("<span style=font-size:1.5em;font-weight:bold;margin-block-start:0.83em;margin-block-end:0.83em;margin-inline-start:0px;margin-inline-end:0px;>Greetings traveler!</span>")
									.pauseFor(350)
									.deleteChars(9)
									.pauseFor(200)
									.typeString("<span style=font-size:1.5em;font-weight:bold;margin-block-start:0.83em;margin-block-end:0.83em;margin-inline-start:0px;margin-inline-end:0px;>or...</span>")
									.pauseFor(350)
									.deleteChars(5)
									.pauseFor(200)
									.typeString(`<span style=font-size:1.5em;font-weight:bold;margin-block-start:0.83em;margin-block-end:0.83em;margin-inline-start:0px;margin-inline-end:0px;>${currentUser.displayName}!</span>`)
									.pauseFor(2000)
									.typeString("<br/> <span style=font-size:1.17em;font-weight:bold;margin-block-start:1em;margin-block-end:1em;margin-inline-start:0px;margin-inline-end:0px;color:lightgray;>Start your journey by completing this 3-step form...</span>")
									.start()
								}}
							/>
						</div>
						<div className="row new-post-form-wrapper">
							<form action="" className="col s12 center-align">
								<div className="row">
									<div className="input-field col s11 l5 push-l1">
										<i className="material-icons prefix white-text">public</i>
										<input onBlur={(e) => setFormCountry(e.target.value)} type="text" id="autocomplete-input" className="autocomplete"/>
										<label htmlFor="autocomplete-input">Enter destination country</label>
										<span className="helper-text yellow-text">Enter country first to filter addresses below</span>
									</div>
										<PlacesAutocomplete countryCodes={countryCode} dataFromChild={dataFromChild}/>						
								</div>
								<div className="row">
									<div className="input-field col s11 l6 datepicker-section">
										<i className="material-icons prefix white-text">event</i>
										<input id="datepicker" type="text" className="datepicker"/>
										<label htmlFor="datepicker">Select date</label>
										<i onClick={setTodayDate} className="material-icons prefix white-text">calendar_today</i>
									</div>
								</div>
							</form>
						</div>       
          				<a onClick={() => goToTab('tab2')} className="btn waves-effect waves-light right"><i className="material-icons right">chevron_right</i>Tab2</a>
        			</div>
      			</div>
      <div id="tab2">
        <div className="col s12 tab-content">
        	<h5 className="center-align">Tab2</h5>
          	<div className="row new-post-form-wrapper">
				<form action="" className="col s12 center-align">
					<div className="row">
						<div className="input-field col s8 l6">
							<i className="material-icons prefix white-text">create</i>
							<input id="postHeading" type="text" className="validate"/>
							<label htmlFor="postHeading">Heading</label>
						</div>
					</div>
					<div className="row">
						<div className="input-field col s11">
							<i className="material-icons prefix white-text">comment</i>
							<textarea id="textarea1" className="materialize-textarea"></textarea>
							<label htmlFor="textarea1">Main content</label>
						</div>
					</div>
					<div className="row">
						<div className="input-field col s11 l6">
							<i className="material-icons prefix white-text">mood</i>
							<input type="text" id="postMood" className="validate"/>
							<label htmlFor="postMood">How do you feel right now?</label>
						</div>
						<div className="input-field col s11 l6">
							<i className="material-icons prefix white-text">nights_stay</i>
							<input type="text" id="postWeather" className="validate"/>
							<label htmlFor="postWeather">How's the weather today?</label>
						</div>
					</div>
			  </form>
		  </div>
          <a onClick={() => goToTab('tab1')} className="btn waves-effect waves-light left"><i className="material-icons left">chevron_left</i>Tab1</a>
          <a onClick={() => goToTab('tab3')} className="btn waves-effect waves-light right"><i className="material-icons right">chevron_right</i>Tab3</a>
        </div>
      </div>
      <div id="tab3">
        <div className="col s12 tab-content">
			<h5 className="center-align">Tab3</h5>
			<div className="row new-post-form-wrapper">
				<form action="" className="col s12 center-align">
					<div className="row">
						<div className="file-field input-field col s11 l6">
							<div className="btn">
								<i className="material-icons left file-input-icon">attach_file</i>
								<span>File</span>
								<input type="file" id="file-selector" multiple/>
							</div>
							<div className="file-path-wrapper">
								<input type="text" className="file-path validate" placeholder="Upload one or more files"/>
							</div>
						</div>
					</div>
				</form>
			</div>
          <a onClick={() => goToTab('tab2')} className="btn waves-effect waves-light left"><i className="material-icons left">chevron_left</i>Tab2</a>
		  <a onClick={handlePostSubmit} className="btn waves-effect waves-light right"><i className="material-icons right">send</i>Create post</a>
        </div>
      </div>
    </div>
	</div>
			
			
			
			{/* //! Slide-out menu Area! */}
			<ul id="slide-out" className="sidenav">
				<li><div className="user-view">
					<div className="background">
						<Image src='/assets/lighthouse-sidenav.jpg' alt="side navigation background image" height="211" width="300" quality={60} />
					</div>
					<a href="#user"><Image className="circle" src={(currentUser && currentUser.photoURL) || "/assets/icons8-test-account.png"} alt="User profile picture" width="96" height="96" quality={60}/></a>
					<a href="#name"><span className="white-text name">{(currentUser && currentUser.displayName) ? currentUser.displayName : 'No Name'}</span></a>
					<a href="#email"><span className="white-text email">{currentUser && currentUser.email}</span></a>
				</div></li>
				<li><a href="#!" onClick={handleLogout}><i className="material-icons">power_settings_new</i>Log out</a></li>
				<li><Link href="/user/settings"><a href="#!"><i className="material-icons">settings</i>Settings</a></Link></li>
				<li><div className="divider"></div></li>
				<li><a className="subheader">Subheader</a></li>
				<li><a className="sidenav-close waves-effect" href="#!"><i className="material-icons">skip_previous</i>Close menu</a></li>
			</ul>		
		</div>
	)
}
