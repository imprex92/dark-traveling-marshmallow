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
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const unsubscribe = projectAuth.onAuthStateChanged( user => {
			setCurrentUser(user)
			setIsLoading(false)
		})
		return unsubscribe
	}, [])

	function signup(email, password){
		return projectAuth.createUserWithEmailAndPassword(email, password)
	}

	function login(email, password){
		return projectAuth.signInWithEmailAndPassword(email, password)
	}

	function updateUserInfo(userName, userAvatarURL){
		return projectAuth.currentUser.updateProfile({
			displayName: projectAuth.currentUser.displayName || userName,
			photoURL: projectAuth.currentUser.photoURL || userAvatarURL
		})
	}


	function loginWithGoogle() {
		console.log('inside context googleauth');
		let provider = new firebase.auth.GoogleAuthProvider();
		

		projectAuth
			.useDeviceLanguage()
			.signInWithRedirect(provider)
			.getRedirectResult()
			.then((result) => {
				console.log('auth is running');
				if (result.credential) {
				/** @type {firebase.auth.OAuthCredential} */
				var credential = result.credential;

				// This gives you a Google Access Token. You can use it to access the Google API.
				var token = credential.accessToken;
				
				}
				// The signed-in user info.
				var user = result.user;
				console.log(user, token);
				
			}).catch((error) => {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				// The email of the user's account used.
				var email = error.email;
				// The firebase.auth.AuthCredential type that was used.
				var credential = error.credential;
				console.error(errorCode, errorMessage);
			});

		
	}

	function logout(){
		return projectAuth.signOut()
	}
	
	const value = {
		currentUser,
		signup,
		login,
		logout,
		loginWithGoogle,
		updateUserInfo
	}

	return (
		<AuthContext.Provider value={value}>
			{!isLoading && children}
		</AuthContext.Provider>
	)
}

