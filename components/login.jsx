import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
// import { useFirestore } from '../contexts/DatabaseContext'
import Googleicon from '../public/assets/icons8-google.svg'
import { verifyEmail } from "../components/utility/verifyEmail";
import useMessageCenter from 'store/messageTransmitter'

//TODO gör Autocompleat för alla inputfält 

function login(props) {
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
		return <>
                {/* {JSON.stringify(currentUser)} */}
                {currentUser && currentUser.email}
            <div className="row valign-wrapper ">					
                <form className="col s10 pull-s1 m6 pull-m3 xl4 pull-xl4 l4 pull-l4  center-align z-depth-5 lighten-2 myForm" onSubmit={handleSubmit}>
                    <h2 className="white-text">Sign in</h2>
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
                            <input autoComplete="current-password" type="password" name="" className="validate white-text" id="password" onChange={(e) => setPassword(e.target.value)}/>
                            <label htmlFor="password">
                                Password
                            </label>
                        </div>
                    </div>					
                    <button className="btn waves-effect waves-light outline" type="submit" name="action" disabled={isLoading}>Sign in
                        <i className="material-icons right">send</i>
                    </button>
                    <div className="section">
                    <div className="divider"></div>
                    </div>
                    <div className="row">
                        <a onClick={accessWithGoogle} href='#' className="btn-floating btn waves-effect waves-light blue googleIcon outline"><Googleicon/></a>
                    </div>
                    <Link href="/signup" className="white-text">
                        <b>No account? Click here!</b>
                    </Link>
                </form>
            </div>
        </>;
	
}

export default login
