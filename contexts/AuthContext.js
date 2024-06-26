import React, {createContext, useState, useEffect, useContext} from 'react'
import { useRouter } from 'next/router'
import { projectFirebase, projectAuth, projectFirestore, projectGoogleAuthProvider, projectTimestampNow } from "../firebase/config.js"
import useMessageCenter from 'store/messageTransmitter'

import nookies  from 'nookies'

const AuthContext = createContext({user: null});

export function AuthProvider({children}) {
	const router = useRouter()
	const hasError = useMessageCenter((state) => state.setError)
	const [user, setUser] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [dbUserDocument, setDbUserDocument] = useState([])
	const [error, setError] = useState('')

	useEffect(() => {
		return projectAuth.onIdTokenChanged(async (user) => {
			if (!user) {
				setUser(null)
				nookies.set(undefined, 'token', '', {path: '/'})
			} else {
				const token = await user.getIdToken()
				setUser(user)
				nookies.set(undefined, 'token', token, { path: '/'})
			}
		})
	}, [])

	//* force refresh the user ID token every 10min
	useEffect(() => {
		const handle = setInterval(async () => {
			const user = projectAuth.currentUser
			if(user) await user.getIdToken(true)
		}, 10 * 60 * 1000);

		return () => clearInterval(handle)
	}, [])

/*	
	useEffect(() => {
		const unsubscribe = projectAuth.onAuthStateChanged( user => {
				setUser(user)
			setIsLoading(false)
		})
		return unsubscribe
	}, [])
*/
	
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
					created: projectTimestampNow,
					uid: cred.user.uid,
				}, { merge: true });
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
							email: result.user.email || null,
							emailVerified: result.user.emailVerified || null,
							phoneNumber: result.user.phoneNumber || null,
							providerId: result.additionalUserInfo.providerId,
							created: projectTimestampNow,
							uid: result.user.uid,
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

	async function logout(){
		await projectAuth.signOut();
		return await router.push('/login');
	}
	
	const value = {
		currentUser: user,
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
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth(){
	return useContext(AuthContext)
}
