import React, {createContext, useState, useEffect, useContext} from 'react'
import { projectAuth, projectFirestore, projectGoogleAuthProvider, projectTimestampNow } from "../firebase/config.js"
import useMessageCenter from 'store/messageTransmitter'

const AuthContext = createContext();

export function useAuth(){
	return useContext(AuthContext)
}

export function AuthProvider({children, userAuth}) {
	const hasError = useMessageCenter((state) => state.setError)
	const [currentUser, setCurrentUser] = useState()
	const [isLoading, setIsLoading] = useState(true)
	const [dbUserDocument, setDbUserDocument] = useState([])
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
			let userData = await projectFirestore.collection('testUserCollection').doc(result.user.uid).get()
			setDbUserDocument(userData)
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

	function loginWithGoogle(){
		projectAuth.useDeviceLanguage();
		return new Promise((resolve, reject) => {
			projectAuth
			.signInWithPopup(projectGoogleAuthProvider)
			.then( async (result) => {
				console.log('result',result);
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
						.then((doc) => {
							setDbUserDocument(doc)
							resolve('Login OK, new user', result)
						})
						.catch((err) => {
							reject('Error new user: ', err)
						})
					}
					else if(!result.additionalUserInfo.isNewUser){
						let userData = await projectFirestore.collection('testUserCollection').doc(result.user.uid).get()
						setDbUserDocument(userData)
						resolve('Login OK, existing user and result', result)
					}
				})
				.catch((err) => {
					hasError(err)
					reject({
						code: err.code ?? 'Unknown',
						message: err.message ?? 'Unknown',
						email: err.email ?? 'Unknown',
						credential: err.credential_1 ?? 'Unknown'
					})
				})
		})
	}

	function logout(){
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