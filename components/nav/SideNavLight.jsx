import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/AuthContext'

export default function SideNavLight ({}) {
	const router = useRouter()
	const [error, setError] = useState(null)
	const { logout, currentUser } = useAuth()
	const show_in = 'posts'
	const route = router.route;

	useEffect(() => {
		const sidenav = document.querySelectorAll(".sidenav");
		M.Sidenav.init(sidenav, {
			onOpenEnd: (el) => { el.classList.toggle('nav-open')},
			onCloseEnd: (el) => { el.classList.toggle('nav-open') }
		});
	}, [])
	
	
	async function handleLogout() {
		setError('')
		try{
			const instance = M.Sidenav.getInstance(document.querySelector(".sidenav"))
			instance.close()
			await logout()
		}
		catch{
			setError("Couldn't log you out")
			M.toast({text: "We couldn't log you out!", error, classes: 'rounded'});
		}
	}
	function handleNewPost(){
		const instance = M.Sidenav.getInstance(document.querySelector(".sidenav"))
		instance.close()
		router.push('/user/newpost')
	}
	function closeSideNav(){
		const instance = M.Sidenav.getInstance(document.querySelector(".sidenav"))
		instance.close()
	}

	return <>
        <div id="vertical-nav-light">
            <div className="wrapper">
                <a href="#" data-target="slide-out" className="sidenav-trigger vertical-menu-btn">
                    <i className="material-icons">menu</i>
                </a>
                <Link href="/user/newpost" onClick={closeSideNav}>
                    <i className="material-icons">add_box</i>
                </Link>
                <Link href="/user/posts" onClick={closeSideNav}>
                    <i className="material-icons white-text">arrow_upward</i>
                </Link>
            </div>
        </div>


        <ul id="slide-out" className="sidenav">
            <li><div className="user-view">
                <div className="background">
                    <img src='/assets/lighthouse-sidenav.jpg' alt="side navigation background image" height="211" width="300" quality={60} />
                </div>
                <a href="#user"><img style={{objectFit: 'cover'}} className="circle" src={(currentUser && currentUser.photoURL) || "/assets/icons8-test-account.png"} alt="User profile picture" width="96" height="96" quality={60}/></a>
                <a href="#name"><span className="white-text name">{(currentUser && currentUser.displayName) ? currentUser.displayName : 'No Name'}</span></a>
                <a href="#email"><span className="white-text email">{currentUser && currentUser.email}</span></a>
            </div></li>
            <li onClick={closeSideNav}><Link href="/user/dashboard"><i className="material-icons">home</i>Home</Link></li>
            <li><a href="#!" onClick={handleLogout}><i className="material-icons">power_settings_new</i>Log out</a></li>
            <li onClick={closeSideNav}>
                <Link href="/user/settings"><i className="material-icons">manage_accounts</i>Account settings
                </Link>
            </li>
            <li>
                <div className="divider"></div>
            </li>
            <li>
                <a className="subheader">Submenu</a>
            </li>
            <li>
                <a className="sidenav-close waves-effect" href="#!"><i className="material-icons material-symbols-outlined">chevron_left</i>Close menu</a>
            </li>
            <li onClick={closeSideNav}>
                <a onClick={handleNewPost} className="" href="/user/newpost"><i className="material-icons">edit</i>Write new post</a>
            </li>
            <li onClick={closeSideNav} style={route.includes(show_in) ? {display: 'none'} : {display: 'block'}}>
                <Link href="/user/posts">
                    <i className="material-icons">grid_on</i>Back to gallery
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
