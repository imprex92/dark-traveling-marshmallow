import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/AuthContext'
if(typeof window !== 'undefined'){
	M = require( '@materializecss/materialize/dist/js/materialize.min.js')
}

//TODO make sure siddenav closes after pagechange (instance.close())

export default function SideNavLight ({}) {
	const router = useRouter()
	const [error, setError] = useState(null)
	const { logout, currentUser } = useAuth()
	useEffect(() => {
		let sidenav = document.querySelectorAll(".sidenav");
		M.Sidenav.init(sidenav, {});
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
			M.toast({html: "We couldn't log you out!", error, classes: 'rounded'});
		}
	}
	function handleNewPost(){
		let instance = M.Sidenav.getInstance(document.querySelector(".sidenav"))
		instance.close()
		router.push('/user/newpost')
	}
	function closeSideNav(){
		let instance = M.Sidenav.getInstance(document.querySelector(".sidenav"))
		instance.close()
	}

	return (
		<div>
			<div id="vertical-nav-light">
				<div className="wrapper">
					<a href="#" data-target="slide-out" className="sidenav-trigger vertical-menu-btn">
						<i className="material-icons">menu</i>
					</a>
					<Link href="/user/newpost">
						<a onClick={closeSideNav} href="#"><i className="material-icons">add_circle_outline</i></a>
					</Link>
					<Link href="/user/posts">
						<a onClick={closeSideNav} href="#"><i className="material-icons white-text">arrow_upward</i></a>
					</Link>
				</div>
			</div>


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
				<li onClick={closeSideNav}>
					<Link href="/user/settings"><a href="#!"><i className="material-icons">settings</i>Settings</a>
					</Link>
				</li>
				<li>
					<div className="divider"></div>
				</li>
				<li>
					<a className="subheader">Submenu</a>
				</li>
				<li>
					<a className="sidenav-close waves-effect" href="#!"><i className="material-icons">skip_previous</i>Close menu</a>
				</li>
				<li onClick={closeSideNav}>
					<a onClick={handleNewPost} className="" href="/user/newpost"><i className="material-icons">edit</i>Write new post</a>
				</li>
				<li>
					<Link href="/user/posts"><a href="/user/posts">
						<i className="material-icons">arrow_back</i>Back to all posts</a>
					</Link>
				</li>
				<li onClick={closeSideNav}>
					<Link href="/user/receipts/home">
						<a href="#" ><i className="material-icons">receipt_long</i>Receipts</a>
					</Link>
				</li>
			</ul>		
		</div>
	)
}
