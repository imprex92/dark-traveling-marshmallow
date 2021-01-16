//  currentUser från authContext
//  projectAuth + projectDatabas från ../firebase/config
//  kolla om currentUser är inloggad
// currentUser.uid ska läggas till för varje användare och vara namnet på "collection"
import React, {createContext, useState, useEffect, useContext} from 'react'
import { projectFirestore, projectTimestampNow } from "../firebase/config.js"
import { useAuth } from './AuthContext'

const FirestoreContext = createContext();

export function useFirestore(){
	return useContext(FirestoreContext)
}

export function DatabaseProvider({children}) {
	const { currentUser } = useAuth();
	const [userDatabaseData, setUserDatabaseData] = useState(null)


	// async function createUserDocument(){
		
	// 	console.log('running createUserDocument');
		
	// 	try {
	// 		await projectFirestore.collection('userCollection').doc(cred.user.uid).set({
	// 			displayName: (cred.user.displayName) || 'null',
	// 			photoURL: (cred.user.photoURL) || 'null',
	// 			email: (cred.user.email) || 'null',
	// 			emailVerified: (cred.user.emailVerified) || 'null',
	// 			phoneNumber: (cred.user.phoneNumber) || 'null',
	// 			providerId: cred.user.providerData.providerId,
	// 			created: projectTimestampNow
	// 		}, { merge: true });
	// 		console.log("Document successfully written!");
	// 	} catch (error) {
	// 		console.error("Error writing document: ", error);
	// 	}
	// 	projectFirestore.collection(`userCollection/${currentUser.uid}/countriesVisited`)
		
		
	// 	let dickhead = 'dick dick'
	// 	return [dickhead, currentUser]
	// }

	function getUserDocument(){
		return projectFirestore.collection('userCollection').doc(`${currentUser.uid}`)
			.onSnapshot(function(doc){
				console.log('you got this userData!', doc.data());
				setUserDatabaseData([doc.data(), 'hello'])
			})
	}

	const value = {
		createUserDocument,
		getUserDocument,
		userDatabaseData
	}

	return (
		<FirestoreContext.Provider value={value}>
			{children}
		</FirestoreContext.Provider>
	)
}


