import React, {createContext, useState, useEffect, useContext} from 'react'
import { projectAuth, projectFirestore, projectGoogleAuthProvider, projectTimestampNow } from "../firebase/config.js"
import { setCookie, removeCookie } from "../components/utility/CookieHandler";
// import { useFirestore } from '../contexts/DatabaseContext'
// import { auth } from 'firebase-admin';

const AuthContext = createContext();

export function useAuth(){
	return useContext(AuthContext)
}

export function AuthProvider({children, userAuth}) {
	const [currentUser, setCurrentUser] = useState()
	const [isLoading, setIsLoading] = useState(true)
	const [dbUserDocument, setDbUserData] = useState([])
	const [error, setError] = useState('')

	useEffect(() => {
		const unsubscribe = projectAuth.onAuthStateChanged( user => {
			setCurrentUser(user)
			setIsLoading(false)
		})
		return unsubscribe
	}, [])

	async function signup(email, password){
		await projectAuth.createUserWithEmailAndPassword(email, password)
		.then(async (cred) => {
			// console.log(cred);
			try {
				await projectFirestore.collection('testUserCollection').doc(cred.user.uid).set({
					displayName: cred.user.displayName || 'null',
					photoURL: cred.user.photoURL || 'null',
					email: cred.user.email || 'null',
					emailVerified: cred.user.emailVerified || 'null',
					phoneNumber: cred.user.phoneNumber || 'null',
					providerId: cred.additionalUserInfo.providerId,
					created: projectTimestampNow
				}, { merge: true });
				// console.log("Document successfully written!");
			} catch (error) {
				return console.error("Error writing document: ", error);
			}
		})
		.catch((err) => {
			setError(err)
		})
	}

	async function login(email, password){
		await projectAuth.signInWithEmailAndPassword(email, password)
		.then(async(cred) => {
			let token = await projectAuth.currentUser.getIdToken(true).then((idToken) => { return idToken });
			setCookie('idToken', token, 7)
			let userData = await projectFirestore.collection('testUserCollection').doc(result.user.uid).get()
			setDbUserData(userData)
		})
		.catch((err) => {
			setError(err)
		})
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
			const result = await projectAuth
				.signInWithPopup(projectGoogleAuthProvider)
				.then( async (result) => {
					// console.log(result);
					if(result.additionalUserInfo.isNewUser){
						await projectFirestore.collection('testUserCollection').doc(result.user.uid).set({
							displayName: result.user.displayName || 'null',
							photoURL: result.user.photoURL || 'null',
							email: result.user.email || 'null',
							emailVerified: result.user.emailVerified || 'null',
							phoneNumber: result.user.phoneNumber || 'null',
							providerId: result.additionalUserInfo.providerId,
							created: projectTimestampNow
						}, { merge: true })
						.then(async(doc) => {
							// console.log('New userDoc created', doc);
							let token = await projectAuth.currentUser.getIdToken(true).then((idToken) => { return idToken });
							setCookie('idToken', token, 7)
							setDbUserDocument(doc)
						})
						.catch((err) => {
							setError(err)
						})
					}
					else if(!result.additionalUserInfo.isNewUser){
						let token = await projectAuth.currentUser.getIdToken(true).then((idToken) => { return idToken });
						setCookie('idToken', token, 7)
						let userData = await projectFirestore.collection('testUserCollection').doc(result.user.uid).get()
						setDbUserData(userData)
					}
				})
				.catch((err) => {
					console.log('this is the error',err);
					setError(err)
					let errorCode = err.code;
					let errorMessage = err.message;
					let email = err.email;
					let credential_1 = err.credential;
					console.error(errorCode);
					console.error(errorMessage);
					console.error(email);
					console.error(credential_1);
				})	
	}

	function logout(){
		removeCookie(idToken)
		return projectAuth.signOut()
	}
	
	const value = {
		currentUser,
		dbUserDocument,
		error,
		signup,
		login,
		logout,
		loginWithGoogle,
		updateUserInfo,
	}

	return (
		<AuthContext.Provider value={value}>
			{!isLoading && children}
		</AuthContext.Provider>
	)
}

AuthProvider.getInitialProps = async props => {
	return {};
};