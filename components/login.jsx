import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
// import { useFirestore } from '../contexts/DatabaseContext'
import Googleicon from '../public/assets/icons8-google.svg'
import { verifyEmail } from "../components/utility/verifyEmail";
import useMessageCenter from 'store/messageTransmitter'
import styles from 'styles/useGateway.module.css'

//TODO gör Autocompleat för alla inputfält 

function login() {
	const notify = useMessageCenter(state => state.message)
	const router = useRouter()
	const [email, setEmail] = useState(null)
	const [password, setPassword] = useState(null)
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	// currentUser can be removed, just for testing!
	const {login, loginWithGoogle, currentUser} = useAuth();
	// const {getUserDocument, userDatabaseData} = useFirestore();

	async function handleSubmit(e){
		e.preventDefault()
		
		try {
			setIsLoading(true)
			if(email && password && verifyEmail(email)){
				setError('')
				login(email, password)
				.then(result => {
					router.push('/user/dashboard')
					setIsLoading(false)
				})
				.catch(err => {
					setError(err.message)
					setIsLoading(false)
				})
			}else{
				setError('Please check email and password')
				setIsLoading(false)
			}
		}
		catch(err){
			console.error(err)
			setError(err.message)
			setIsLoading(false)
		}
	}

	function accessWithGoogle(e) {
		e.preventDefault()
		setError('')
		setIsLoading(true)
		loginWithGoogle().then(result => {
			setIsLoading(false)
			router.push('/user/dashboard')
		}).catch(err => {
			setIsLoading(false)
			setError(err.message ?? 'something went wrong')
		})
	}
	
	return (
		<>
			<div className={`row valign-wrapper ${styles.formWrapper}`}>					
				<form className={`col xl4 l4 m8 offset-xl4 offset-l4 offset-m2 s8 offset-s1 center-align z-depth-5 ${styles.myForm}`} 
				onSubmit={handleSubmit}>
					<h2 className="white-text">Sign in</h2>
					{error && <div className={styles.customError} >{error}</div>}
					<div className="row">
						<div className="input-field col offset-s2 s10">
							<input autoComplete="email" type="email" name="" className="validate white-text" id="email" onChange={(e) => setEmail(e.target.value)} placeholder=' '/>
							<label htmlFor="email">
								Email
							</label>
						</div>
					</div>
					<div className="row ">
						<div className="input-field col offset-s2 s10">
							<input autoComplete="current-password" type="password" name="" placeholder=' ' className="validate white-text" id="password" onChange={(e) => setPassword(e.target.value)}/>
							<label htmlFor="password">
								Password
							</label>
						</div>
					</div>					
					<button className="btn waves-effect waves-light outline" type="submit" name="action" disabled={isLoading}>
						Sign in
						<i className="material-icons right">send</i>
					</button>
					<div className="section">
					<div className="divider"></div>
					</div>
					<div className={styles.googleRow}>
						<a onClick={accessWithGoogle} href='#' className="btn-floating btn waves-effect waves-light blue outline">
							<Googleicon/>
						</a>
					</div>
					<Link href="/signup">
						<a className="white-text"><b>No account? Click here!</b></a>
					</Link>
				</form>
			</div>
		</>
	)
	
}

export default login
