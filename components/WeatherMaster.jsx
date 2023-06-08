import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import firebase from 'firebase/app'

if(typeof window !== 'undefined'){
	M = require( '@materializecss/materialize/dist/js/materialize.min.js')
}
require('dotenv').config()

const WeatherMaster = () => {
  const router = useRouter()
	const [error, setError] = useState(null)
	const { logout, currentUser } = useAuth()
	const [formCountry, setFormCountry] = useState('')
	const [countryCode, setCountryCode] = useState(null)
	const [isSuccessful, setIsSuccessful] = useState(null)
	const [hasError, setHasError] = useState(null)
	const [init, setInit] = useState(false)

  	useEffect(() => {

		let sidenav = document.querySelectorAll(".sidenav");
		let tabs = document.querySelectorAll(".tabs");
		let datepicker = document.querySelectorAll(".datepicker")
		let autocomplete = document.querySelectorAll('.autocomplete');
		if(!init){
			M.Sidenav.init(sidenav, {
				onOpenEnd: (el) => { el.classList.toggle('nav-open') },
				onCloseEnd: (el) => { el.classList.toggle('nav-open') }
			});
			setInit(true)
		}
	}, []) //! formCountry?

  	function closeSideNav(){
		let instance = M.Sidenav.getInstance(document.querySelector(".sidenav"))
		instance.close()
	}
  	async function handleLogout() {
		setError('')
		try{
			await logout()
			closeSideNav()
			router.push('/login')
		}
		catch{
			setError("Couldn't log you out")
			console.log(error);
			M.toast({html: "We couldn't log you out!", error, classes: 'rounded'});
		}
	}
  return (
	<>
    <div id="vertical-nav">
		<a href="#" data-target="slide-out" className="sidenav-trigger vertical-menu-btn">
			<i id="newpost-menu-btn" className="material-icons">menu</i>
		</a>
		<div className="new">
			<ul id="tabs" className="tabs center-align tabs">
				<li className="tab active"><a href="#tab1">Step 1</a></li>
				<li className="tab"><a href="#tab2">Step 2</a></li>
				<li className="tab"><a href="#tab3">Step 3</a></li>
			</ul>					
		</div>
	</div>
      {/* //! Slide-out menu Area! */}
	<ul id="slide-out" className="sidenav">
		<li><div className="user-view">
			<div className="background">
				<img src='/assets/lighthouse-sidenav.jpg' alt="side navigation background image" height="211" width="300" quality={60} />
			</div>
			<a href="#user"><img className="circle" src={(currentUser && currentUser.photoURL) || "/assets/icons8-test-account.png"} alt="User profile picture" width="96" height="96" quality={60}/></a>
			<a href="#name"><span className="white-text name">{(currentUser && currentUser.displayName) ? currentUser.displayName : 'No Name'}</span></a>
			<a href="#email"><span className="white-text email">{currentUser && currentUser.email}</span></a>
		</div></li>
		<li onClick={closeSideNav}><Link href="/user/dashboard"><a href="#"><i className="material-icons">home</i>Home</a></Link></li>
		<li><a href="#!" onClick={handleLogout}><i className="material-icons">power_settings_new</i>Log out</a></li>
		<li onClick={closeSideNav}><Link href="/user/settings"><a href="#!"><i className="material-icons">settings</i>Settings</a></Link></li>
		<li><div className="divider"></div></li>
		<li><a className="subheader">Submenu</a></li>
		<li><a className="sidenav-close waves-effect" href="#!"><i className="material-icons">skip_previous</i>Close menu</a></li>
		<li onClick={closeSideNav}><Link href="/user/posts"><a href="/user/posts"><i className="material-icons">arrow_back</i>View all posts</a></Link></li>
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
  </>
  )
}

export default WeatherMaster