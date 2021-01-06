import React, {createContext, useState, useEffect, useContext} from 'react'
// import nookies from "nookies"
import { projectAuth } from "../firebase/config.js"
// import { auth } from 'firebase-admin';

const AuthContext = createContext();

export function useAuth(){
	return useContext(AuthContext)
}

export function AuthProvider({children}) {
	const [currentUser, setCurrentUser] = useState()

	useEffect(() => {
		const unsubscribe = projectAuth.onAuthStateChanged( user => {
			setCurrentUser(user)
		})
		return unsubscribe
	}, [])

	function signup(email, password){
		return projectAuth.createUserWithEmailAndPassword(email, password)
	}

	
	const value = {
		currentUser,
		signup
	}

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	)
}

