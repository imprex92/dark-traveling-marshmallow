import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import Googleicon from '../public/assets/icons8-google.svg'

//TODO gör Autocompleat för alla inputfält 

function signup() {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [verifyPassword, setVerifyPassword] = useState('')
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const {signup, loginWithGoogle} = useAuth();

	async function handleSubmit(e){
		e.preventDefault()
		
		if(password !== verifyPassword){
			return setError('Passwords are not matching')
		}	
			//TODO Toast messages
			setError('')
			setIsLoading(true)
			signup(email, password)
			.then(result => {
				console.log(result);
				router.push('/user/dashboard')
				setIsLoading(false)
			}).catch(err => {
				setError(err.message)
				setIsLoading(false)
			})		
	}

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
			console.error(err.message);
			setError(err)
		}
	}
	
	return (
		<>
			<div className="row valign-wrapper ">				
				<form className="col s10 pull-s1 m6 pull-m3 xl4 pull-xl4 l4 pull-l4  center-align z-depth-5 lighten-2 myForm" onSubmit={handleSubmit}>
					<h2 className="white-text">Sign up</h2>
					{error && <div className="customError">{error}</div>}
					<div className="row">
						<div className="input-field col s10 push-s1 m10 push-m1">
							<input autoComplete="email" type="email" name="" className="validate white-text" id="email" onChange={(e) => setEmail(e.target.value)}/>
							<label htmlFor="email">
								Email
							</label>
						</div>
					</div>
					<div className="row ">
						<div className="input-field col s10 push-s1 m10 push-m1">
							<input autoComplete="new-password" type="password" name="" className="validate white-text" id="password" onChange={(e) => setPassword(e.target.value)}/>
							<label htmlFor="password">
								Password
							</label>
						</div>
					</div>
					<div className="row">
						<div className="input-field col s10 push-s1 m10 push-m1">
							<input autoComplete="new-password" type="password" name="" className="validate white-text" id="verifyPassword" onChange={(e) => setVerifyPassword(e.target.value)}/>
							<label htmlFor="verifyPassword">
								Verify password
							</label>
						</div>
					</div>				
					<button className="btn waves-effect waves-light blue" type="submit" name="action" disabled={isLoading}>SignUp
						<i className="material-icons right">send</i>
					</button>
					<div className="section">
					<div className="divider"></div>
					</div>
					<div className="row">
						<a onClick={handleGoogleSignup} className="btn-floating btn waves-effect waves-light blue"><Googleicon/></a>
					</div>
					<Link href="/login">
						<a className="white-text"><b>Have an account? Click here!</b></a>
					</Link>
				</form>
			</div>
		</>
	)
}

export default signup
