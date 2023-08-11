import React, {createContext, useState, useEffect, useContext} from 'react'
import { useRouter } from 'next/router'
import { projectAuth, projectFirestore, projectGoogleAuthProvider, projectTimestampNow } from "../firebase/config.js"
import useMessageCenter from 'store/messageTransmitter'

const AuthContext = createContext();

export function useAuth(){
	return useContext(AuthContext)
}

export function AuthProvider({children, userAuth}) {
	const router = useRouter()
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

	function signup(email, password){
		return new Promise((resolve, reject) => {
			projectAuth.createUserWithEmailAndPassword(email, password)
			.then((cred) => {
				projectFirestore.collection('testUserCollection').doc(cred.user.uid).set({
					displayName: cred.user.displayName || null,
					photoURL: cred.user.photoURL || null,
					email: cred.user.email || null,
					emailVerified: cred.user.emailVerified || null,
					phoneNumber: cred.user.phoneNumber || null,
					providerId: cred.additionalUserInfo.providerId,
					created: projectTimestampNow
				}, { merge: true });
				console.log("Document successfully written!", cred);
				resolve({
					status: 'OK',
					type: cred.operationType,
					email: cred.user.email,
					emailVerified: cred.user.emailVerified,
					uid: cred.user.uid,
					additionalInfo: cred.additionalUserInfo,
				})
			}).catch((err) => {
				console.log(err);
				reject({
					status: 'ERROR',
					code: err.code,
					message: err.message,
				})
			})

		})
	}

	function login(email, password){
		return new Promise((resolve, reject) => {
			projectAuth.signInWithEmailAndPassword(email, password)
			.then((cred) => {
				resolve('Login OK')
				const userData = projectFirestore.collection('testUserCollection').doc(result.user.uid).get()
				setDbUserDocument(userData)
			})
			.catch(err => {
				reject(err)
			})
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
			.then((result) => {
				if(result.additionalUserInfo.isNewUser){
					projectFirestore.collection('testUserCollection').doc(result.user.uid).set({
						displayName: result.user.displayName || null,
						photoURL: result.user.photoURL || null,
						email: result.user.email || 'null',
						emailVerified: result.user.emailVerified || null,
						phoneNumber: result.user.phoneNumber || null,
						providerId: result.additionalUserInfo.providerId,
						created: projectTimestampNow
					}, { merge: true })
					.then((doc) => {
						setDbUserDocument(doc)
						resolve(result)
					})
					.catch((err) => {
						reject(err)
					})
				}
				else if(!result.additionalUserInfo.isNewUser){
					const userData = projectFirestore.collection('testUserCollection').doc(result.user.uid).get()
					setDbUserDocument(userData)
					resolve(result)
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
		return projectAuth.signOut().then((resp) => router.push('/login'))
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