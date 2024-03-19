import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import Googleicon from '../public/assets/icons8-google.svg'
import styles from 'styles/useGateway.module.css'

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
	
	return <>
        <div className={`row valign-wrapper ${styles.formWrapper}`}>				
            <form className={`col xl4 l4 m8 offset-xl4 offset-l4 offset-m2 s8 offset-s1 center-align z-depth-5 ${styles.myForm}`} 
            onSubmit={handleSubmit}>
                <h2 className="white-text">Sign up</h2>
                {error && <div className={styles.customError} >{error}</div>}
                <div className="row">
                    <div className="input-field col offset-s2 s10">
                        <input autoComplete="email" type="email" name="" className="validate white-text" placeholder=' ' id="email" onChange={(e) => setEmail(e.target.value)}/>
                        <label htmlFor="email">
                            Email
                        </label>
                    </div>
                </div>
                <div className="row ">
                    <div className="input-field col offset-s2 s10">
                        <input autoComplete="new-password" type="password" name="" className="validate white-text" placeholder=' ' id="password" onChange={(e) => setPassword(e.target.value)}/>
                        <label htmlFor="password">
                            Password
                        </label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col offset-s2 s10">
                        <input autoComplete="new-password" type="password" name="" className="validate white-text" placeholder=' ' id="verifyPassword" onChange={(e) => setVerifyPassword(e.target.value)}/>
                        <label htmlFor="verifyPassword">
                            Verify password
                        </label>
                    </div>
                </div>				
                <button className="btn waves-effect waves-light outline" type="submit" name="action" disabled={isLoading}>Sign Up
                    <i className="material-icons right">send</i>
                </button>
                <div className="section">
                <div className="divider"></div>
                </div>
                <div className={styles.googleRow}>
                    <a onClick={accessWithGoogle} href='#' className="btn-floating btn waves-effect waves-light blue outline"><Googleicon/></a>
                </div>
                <Link href="/login" className="white-text">
                    <b>Have an account? Click here!</b>
                </Link>
            </form>
        </div>
    </>;
}

export default signup
