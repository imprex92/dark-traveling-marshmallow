import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/AuthContext'
if(typeof window !== 'undefined'){
	M = require( '@materializecss/materialize/dist/js/materialize.min.js')
}

//TODO make sure siddenav closes after pagechange (instance.close())

export default function SideNav ({dbUserData, dataFromChildToParent}) {
	const router = useRouter()
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(true)
	const [countriesVisited, setCountriesVisited] = useState([])
	const [currentFilter, setCurrentFilter] = useState('All')
	const { logout, currentUser } = useAuth()
	const show_in = 'posts'
	const route = router.route;
	
	useEffect(() => {
		setCountriesVisited(dbUserData.countriesVisited)
		
		const sidenav = document.querySelectorAll(".sidenav");
		M.Sidenav.init(sidenav, {
			onOpenEnd: (el) => { el.classList.toggle('nav-open') },
			onCloseEnd: (el) => { el.classList.toggle('nav-open') }
		});
		setLoading(false)

	}, [dbUserData])
	
	async function handleLogout() {
		setError('')
		try{
			const instance = M.Sidenav.getInstance(document.querySelector(".sidenav"))
			instance.close()
			await logout()
		}
		catch{
			setError("Couldn't log you out")
			console.log(error);
			M.toast({text: "We couldn't log you out!", error, classes: 'rounded'});
		}
	}
	function handleNewPost(){
		const instance = M.Sidenav.getInstance(document.querySelector(".sidenav"))
		instance.close()
		router.push('/user/newpost')
	}
	//! vid click, skickas textContent vidare till parent dashboard vidare till Slides componenten
	function handleFilter(e){
		let countryToFilter = e.currentTarget.textContent
		console.log(e.currentTarget.textContent);
		if(e.currentTarget.textContent === 'All'){
			countryToFilter = ' '
			dataFromChildToParent(countryToFilter)
			setCurrentFilter(countryToFilter)
		}
		dataFromChildToParent(countryToFilter)
		setCurrentFilter(countryToFilter)
	}
	function closeSideNav(){
		const instance = M.Sidenav.getInstance(document.querySelector(".sidenav"))
		instance.close()
	}

	return <>
        <div id="vertical-nav">
            <div className="wrapper">
                <a href="#" data-target="slide-out" className="sidenav-trigger vertical-menu-btn">
                    <i className="material-icons">menu</i>
                </a>
                <Link href="/user/newpost" onClick={closeSideNav}>
                    <i className="material-icons">add_box</i>
                </Link>
                <a onClick={handleFilter} defaultValue="All" className={`contact ${currentFilter === 'All' ? 'filterActive' : ''}`} href="#">All</a>
                {countriesVisited?.map((country, i) => {
                    return <a onClick={handleFilter} key={i} defaultValue={country} className={`contact ${country === currentFilter ? 'filterActive' : ''}`} href="#">{country}</a>
                })}
            </div>
        </div>
        <ul id="slide-out" className="sidenav">
            <li>
                <div className="user-view">
                    <div className="background">
                        <img src='/assets/lighthouse-sidenav.jpg' alt="side navigation background image" height="211" width="300" quality={60} />
                    </div>
                    <a href="#user"><img style={{objectFit: 'cover'}} className="circle" src={(currentUser && currentUser.photoURL) || "/assets/icons8-test-account.png"} alt="User profile picture" width="96" height="96" quality={60}/></a>
                    <a href="#name"><span className="white-text name">{(currentUser && currentUser.displayName) ? currentUser.displayName : 'No Name'}</span></a>
                    <a href="#email"><span className="white-text email">{currentUser && currentUser.email}</span></a>
                </div>
            </li>
            <li onClick={closeSideNav}>
                <Link href="/user/dashboard">
                    <i className="material-icons">home</i>Dashboard
                </Link>
            </li>
            <li>
                <a href="#!" onClick={handleLogout}>
                    <i className="material-icons">power_settings_new</i>Log out
                </a>
            </li>
            <li onClick={closeSideNav}>
                <Link href="/user/settings">
                    <i className="material-icons">manage_accounts</i>Account settings
                </Link>
            </li>
            <li>
                <div className="divider"></div>
            </li>
            <li>
                <a className="subheader">Submenu</a>
            </li>
            <li>
                <a className="sidenav-close waves-effect" href="#!">
                    <i className="material-icons material-symbols-outlined">chevron_left</i>Close menu
                </a>
            </li>
            <li onClick={closeSideNav}>
                <a onClick={handleNewPost} className="" href="#!">
                    <i className="material-icons">edit</i>Write new post
                </a>
            </li>
            <li style={route.includes(show_in) ? {display: 'none'} : {display: 'block'}} onClick={closeSideNav}>
                <Link href="/user/posts">

                    <i className="material-icons">grid_on</i>View gallery
                </Link>
            </li>
            <li onClick={closeSideNav}>
                <Link href="/user/receipts/home">
                    <i className="material-icons">receipt_long</i>Receipts
                </Link> 
            </li>
            <li onClick={closeSideNav}>
                <Link href="/weather">
                    <i className="material-icons material-symbols-outlined">partly_cloudy_day</i>Weather
                </Link> 
            </li>
        </ul>		
    </>;
}
