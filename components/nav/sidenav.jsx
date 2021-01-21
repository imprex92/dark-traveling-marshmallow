import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/AuthContext'
import { getTime } from '../hooks/GetTime'
import Image from 'next/image'

export default function sidenav() {
	const router = useRouter()

	const [error, setError] = useState(null)
	const { logout, currentUser } = useAuth()

	useEffect(() => {
		
			const M = require('../../js/materialize');
			let sidenav = document.querySelectorAll(".sidenav");
      		M.Sidenav.init(sidenav, {});
		
		getTime()
	})

	async function handleLogout() {
		setError('')
		try{
			console.log('inside handdeler');
			await logout()
			// M.Sidenav.close()
			router.push('/login')
		}
		catch{
			setError("couldn't log you out")
			console.log(error);
			M.toast({html: "We couldn't log you out!", error, classes: 'rounded'});
		}
	}

	return (
		<div>
			{/* {JSON.stringify(currentUser)} */}



			{/* <nav id="vertical-nav"><a href="#" data-target="slide-out" className="sidenav-trigger"><i className="material-icons">menu</i></a></nav> */}
			
			<div id="vertical-nav">
				<a href="#" data-target="slide-out" className="sidenav-trigger vertical-menu-btn">
					<i className="material-icons">menu</i>
				</a>
				<div className="wrapper">
					<a className="contact" href="#">Instagram</a>
					<a className="contact" href="#">Email</a>
					<a className="contact" href="#">Credits</a>
				</div>
			</div>

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
				<li><a className="waves-effect" href="#!">Third Link With Waves</a></li>
			</ul>
			
		</div>
	)
}
