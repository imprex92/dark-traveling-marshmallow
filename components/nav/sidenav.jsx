import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/AuthContext'
import Image from 'next/image'
if(typeof window !== 'undefined'){
	M = require( 'materialize-css/dist/js/materialize.js')
}
// import { getTime } from '../utility/GetTime'

//TODO make sure siddenav closes after pagechange (instance.close())

export default function SideNav ({dbUserData, dataFromChildToParent}) {
	const router = useRouter()
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(true)
	const [countriesVisited, setCountriesVisited] = useState([])
	const { logout, currentUser } = useAuth()
	useEffect(() => {
		setCountriesVisited(dbUserData.countriesVisited)
		// console.log(dbUserData);
		let sidenav = document.querySelectorAll(".sidenav");
		M.Sidenav.init(sidenav, {});
		// console.log(dbUserData);
		// console.log(countriesVisited);
		setLoading(false)
	})

	async function handleLogout() {
		setError('')
		try{
			let instance = M.Sidenav.getInstance(document.querySelector(".sidenav"))
			instance.close()
			await logout()
			router.push('/login')
		}
		catch{
			setError("couldn't log you out")
			console.log(error);
			M.toast({html: "We couldn't log you out!", error, classes: 'rounded'});
		}
	}
	function handleNewPost(){
		let instance = M.Sidenav.getInstance(document.querySelector(".sidenav"))
		instance.close()
		router.push('/user/newpost')
	}
	//! vid click, skickas textContent vidare till parent dashboard vidare till Slides componenten
	function handleFilter(e){
		let countryToFilter = e.currentTarget.textContent
		console.log(e.currentTarget.textContent);
		dataFromChildToParent(countryToFilter)
	}

	return (
		<div>
			<div id="vertical-nav">
				<div className="wrapper">
				<a href="#" data-target="slide-out" className="sidenav-trigger vertical-menu-btn">
					<i className="material-icons">menu</i>
				</a>
				<Link href="/user/newpost">
					<a href="#"><i className="material-icons">add_circle_outline</i></a>
				</Link>
				<a onClick={handleFilter} defaultValue="All" className="contact" href="#">All</a>
				{countriesVisited?.map((country, i) => {
					return <a onClick={handleFilter} key={i} defaultValue={country} className="contact" href="#">{country}</a>
				})}
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
				<li><a className="sidenav-close waves-effect" href="#!"><i className="material-icons">skip_previous</i>Close menu</a></li>
				<li><a onClick={handleNewPost} className="" href="#!"><i className="material-icons">edit</i>Write new post</a></li>
			</ul>		
		</div>
	)
}
