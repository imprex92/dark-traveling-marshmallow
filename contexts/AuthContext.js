import React, {createContext, useState, useEffect, useContext} from 'react'
import { projectAuth, projectGoogleAuthProvider } from "../firebase/config.js"
// import nookies from "nookies"
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

	//TODO Lägg try, catch i login/signup filen istället för här och få tillgång till felkoder.
	async function loginWithGoogle() {
		//? When login with google. Sets popup language to Devicelanguage
		projectAuth.useDeviceLanguage();

		//TODO Lägg till "usePersistence()" för att automatiskt logga ut användare
		try {
			const result = await projectAuth
				.signInWithPopup(projectGoogleAuthProvider);
			if (result.credential) {
				/** @type {firebase.auth.OAuthCredential} */
				let credential = result.credential;

				// This gives you a Google Access Token. You can use it to access the Google API.
				let token = credential.accessToken;

			}
			// The signed-in user info.
			let user = result.user;
			console.log('user', user);
			console.log('token', token);
		} catch (error) {
			// Handle Errors here.
			let errorCode = error.code;
			let errorMessage = error.message;
			// The email of the user's account used.
			let email = error.email;
			// The firebase.auth.AuthCredential type that was used.
			let credential_1 = error.credential;
			let errors = [errorCode, errorMessage, email, credentials_1];
			console.error(errorCode);
			console.error(errorMessage);
			console.error(email);
			console.error(credential_1);
		}

		
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

