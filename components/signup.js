import React from 'react'
import {useAuth} from '../contexts/AuthContext'


function signup() {
	const {signup, currentUser} = useAuth();

	async function handleSubmit(e){
		e.preventDefault()
		//TODO signUp validation
		// if(password === passwordConfirm){
		// 	return setError('Password are not matching')
		// }
		// TODO lägg till input-value för email + password när du anropar "signup()"
		try {
			//TODO set Loading... useState here whille signing up
			// setError('')
			await signup()
		}
		catch{
			// setError('Signup went wrong', error)
		}
	}

	return (
		<div className="container">
			<form onSubmit={handleSubmit}>
				<button className="waves-effect waves-light btn" type="submit">submit</button>
				<a className="waves-effect waves-light btn">button</a>
				<a className="waves-effect waves-light btn">buttonghghg</a>
          <a className="waves-effect waves-light btn"><i className="material-icons left">cloud</i>buttohghghn</a>
			</form>
		</div>
	)
}

export default signup
