import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
// import { useFirestore } from '../contexts/DatabaseContext'
import Googleicon from '../public/assets/icons8-google.svg'

//TODO gör Autocompleat för alla inputfält 

function login() {
	useEffect(() => {
		setShowContent(false)
		if(currentUser && currentUser.uid){
			router.push('/user/dashboard')
		}else if(!currentUser){
			setShowContent(true)
		}
		router.prefetch('/user/dashboard')
	}, [])
	const router = useRouter()
	const [showContent, setShowContent] = useState(false)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	// currentUser can be removed, just for testing!
	const {login, loginWithGoogle, currentUser} = useAuth();
	// const {getUserDocument, userDatabaseData} = useFirestore();

	async function handleSubmit(e){
		e.preventDefault()
		//TODO signUp validation
		try {
			setError('')
			setIsLoading(true)
			await login(email, password)
			await getUserDocument()
			router.push('/user/dashboard')
		}
		catch(err){
			console.error(err)
			setError(err.message)
			setIsLoading(false)
		}
	}
	//TODO felkoder!
	async function handleGoogleSignup(e) {
		e.preventDefault()
		try{
			setError('')
			setIsLoading(true)
			await loginWithGoogle()
			router.push('/user/dashboard')
		}
		catch(err){
			setIsLoading(false)
			setError(err)
			console.error(err);
		}
	}
	if(!showContent){
		return(
			<>
			</>
		)
	}
	else{
		return (
			<>
					{/* {JSON.stringify(currentUser)} */}
					{currentUser && currentUser.email}
				<div className="row valign-wrapper ">					
					<form className="col s10 pull-s1 m6 pull-m3 xl4 pull-xl4 l4 pull-l4  center-align z-depth-5 lighten-2 myForm" onSubmit={handleSubmit}>
						<h2 className="white-text">Sign in</h2>
						{error && <div className="customError">{error}</div>}
						<div className="row">
							<div className="input-field col s10 push-s1 m10 push-m1">
								<input type="email" name="" className="validate white-text" id="email" onChange={(e) => setEmail(e.target.value)}/>
								<label htmlFor="email">
									Email
								</label>
							</div>
						</div>
						<div className="row ">
							<div className="input-field col s10 push-s1 m10 push-m1">
								<input type="password" name="" className="validate white-text" id="password" onChange={(e) => setPassword(e.target.value)}/>
								<label htmlFor="password">
									Password
								</label>
							</div>
						</div>					
						<button className="btn waves-effect waves-light blue" type="submit" name="action" disabled={isLoading}>Signin
							<i className="material-icons right">send</i>
						</button>
						<div className="section">
						<div className="divider"></div>
						</div>
						<div className="row">
						<a onClick={handleGoogleSignup} className="btn-floating btn waves-effect waves-light blue"><Googleicon/></a>
						</div>
						<Link href="/signup">
							<a className="white-text"><b>No account? Click here!</b></a>
						</Link>
					</form>			
				</div>
			</>
		)
	}
}

export default login
