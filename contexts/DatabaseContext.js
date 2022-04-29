// //  currentUser från authContext
// //  projectAuth + projectDatabas från ../firebase/config
// //  kolla om currentUser är inloggad
// // currentUser.uid ska läggas till för varje användare och vara namnet på "collection"
// import React, {createContext, useState, useEffect, useContext} from 'react'
// import { projectFirestore, projectTimestampNow } from "../firebase/config.js"
// import { useAuth } from './AuthContext'

// const FirestoreContext = createContext();

// export function useFirestore(){
// 	return useContext(FirestoreContext)
// }

// export function DatabaseProvider({children}) {
// 	const { currentUser } = useAuth();
// 	const [userDatabaseData, setUserDatabaseData] = useState([])
// 	const [isLoading, setIsLoading] = useState(true)

// 	useEffect( ()=> {
// 		console.log('dbContext running');
// 		const fetchData = async () => {

// 		}
// 		if(currentUser && currentUser.uid){
// 			const unsubscribe = projectFirestore.collection(`testUserCollection/${currentUser.uid}/countriesVisited`)
// 			.onSnapshot((snapshot) => { 
// 				console.log(snapshot);
// 				const userData = []
				
// 				setIsLoading(false)
// 			})
// 			console.log(userDatabaseData);
// 			return unsubscribe




// 			const fetchData = async () => {
// 				setLoading(true);
// 				const db = firebase.firestore()
// 				const peopleData = await db.collection('peopleResults').get()
// 				const planetData = await db.collection('planetResults').get()			
	
// 				setPeopleResults(peopleData.docs.map(doc => ({...doc.data(), id: doc.id}))) //! ...doc.data(), id: doc.id gör att man får med ID't som firestore assignade detta objektet. (SNAPSHOT) VIKTIGT!
// 				setPlanetResults(planetData.docs.map(doc => ({...doc.data(), id: doc.id})))
// 				setLoading(false)
// 			}
// 			fetchData()
// 		}
// 		console.log('data from database', userDatabaseData);
// 	}, [])

// // 	const ref = firebase.firestore().collection(`testUserCollection/${currentUser.uid}/countriesVisited`);
// // ref.onSnapshot((snapshot) => {
// //   snapshot.forEach((doc) => {
// //     const data = doc.data();
// //     // ...
// //   });
// // });


// 	// async function createUserDocument(){
		
// 	// 	console.log('running createUserDocument');
		
// 	// 	try {
// 	// 		await projectFirestore.collection('testUserCollection').doc(cred.user.uid).set({
// 	// 			displayName: (cred.user.displayName) || 'null',
// 	// 			photoURL: (cred.user.photoURL) || 'null',
// 	// 			email: (cred.user.email) || 'null',
// 	// 			emailVerified: (cred.user.emailVerified) || 'null',
// 	// 			phoneNumber: (cred.user.phoneNumber) || 'null',
// 	// 			providerId: cred.user.providerData.providerId,
// 	// 			created: projectTimestampNow
// 	// 		}, { merge: true });
// 	// 		console.log("Document successfully written!");
// 	// 	} catch (error) {
// 	// 		console.error("Error writing document: ", error);
// 	// 	}
// 	// 	projectFirestore.collection(`testUserCollection/${currentUser.uid}/countriesVisited`)
		
		
// 	// 	let dickhead = 'dick dick'
// 	// 	return [dickhead, currentUser]
// 	// }

// 	function getUserDocument(){
// 		if(currentUser){
// 			projectFirestore.collection('testUserCollection').doc(currentUser.uid)
// 			.onSnapshot(function (doc) {
// 				// console.log('you got this userData!', doc.data());
// 				setUserDatabaseData(doc.data());
// 			})
// 		}
// 		console.log('data from database', userDatabaseData);
// 	}

// 	const values = {
// 		// createUserDocument,
// 		getUserDocument,
// 		userDatabaseData,
// 	}

// 	return (
// 		<FirestoreContext.Provider value={values}>
// 			{!isLoading && children}
// 		</FirestoreContext.Provider>
// 	)
// }


