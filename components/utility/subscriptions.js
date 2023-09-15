import { projectFirestore, projectFirebase } from '../../firebase/config'

function fetchDbUserData(userID){
	return new Promise((resolve, reject) => {
		projectFirestore.collection('testUserCollection').doc(userID).get()
		.then(doc => {
			// console.log(doc.data());
			if(doc.exists){
				resolve({
					id: doc.id,
					...doc.data()
				})
			} else resolve({})
		})
	})
}

function fetchUserblog(userID) {
	const userDbRef = projectFirestore.collection('testUserCollection').doc(userID)
	let data = [];
	return new Promise((resolve, reject) => {
		userDbRef.collection('blogPosts').get()
		.then(docSet => {
			if(docSet !== null){
				docSet.forEach(doc => data.push(({...doc.data(), id: doc.id})))
			}
			resolve(data)
		})
	})
}

function fetchUserHotels(userID){
	const userDbRef = projectFirestore.collection('testUserCollection').doc(userID)
	let data = [];
	return new Promise((resolve, reject) => {
		userDbRef.collection('stayingHotel').get()
		.then(docSet => {
			if(docSet !== null){
				docSet.forEach(doc => {
					data.push({
						id: doc.id,
						...doc.data()
					})
				})
			}
			resolve(data)
		})
	})
}

function fetchUserReceipts(userID){
	const userDbRef = projectFirestore.collection('testUserCollection').doc(userID)
	let data = []
	return new Promise((resolve, reject) => {
		userDbRef.collection('userReceipts').get()
		.then(docSet => {
			if(docSet !== null){
				docSet.forEach(doc => {
					data.push({
						id: doc.id,
						...doc.data()
					})
				})
			}
			resolve(data)
		})
	})
}

function fetchOneDocument({userID, docID}){
	const userDbRef = projectFirestore.collection('testUserCollection').doc(userID)
	return new Promise((resolve, reject) => {
		userDbRef.collection('blogPosts').doc(docID).get()
		.then(doc => {
			if(doc.exists){
				resolve({
					id: doc.id,
					...doc.data()
				})
			} else resolve({})
		})
	})
}

function fetchDocumentByFieldName({fieldName, value, userID, docID}){
	const userDbRef = projectFirestore.collection('testUserCollection').doc(userID)
	return new Promise((resolve, reject) => {
		userDbRef
		.collection('blogPosts')
		.where(fieldName, '==', value)
		.limit(1)
		.get()
		.then(snapshot => {
			console.log(snapshot);
			if(snapshot.docs.length == 1){
				const doc = snapshot.docs[0]
				console.log(doc);
				if(doc.exists){
					resolve({
						id: doc.id,
						...doc.data()
					})
				} else resolve({})
			}
			else{
				resolve({empty: true})
			}
		})
	})
}

function handleSaveNewPost({userID, dataToSave}){
	console.log('userID: ', userID, 'Supplied data to save: ', dataToSave);
	let country = dataToSave.postLocationData.country
	console.log(country);
	const userDbRef = projectFirestore.collection('testUserCollection').doc(userID)
	return new Promise((resolve, reject) => {
		userDbRef
		.collection('blogPosts')
		.doc()
		.set(dataToSave)
		.then(docRef => {
			userDbRef.update({
				countriesVisited: projectFirebase.firestore.FieldValue.arrayUnion(country)
			}).then(res => {
				console.log(res);
			}).catch(err => {console.log(err);})
			// console.log("Document written with ID: ", docRef);
			resolve({docRef})
		})
		.catch(err => {
			console.log('Error during upload to DB: ', err);
			reject(err)
		})	
	})
}

function handleSaveRecipt ({ userID, dataToSave }){
	console.log('userID: ', userID, 'Supplied data to save: ', dataToSave);
	const userDbRef = projectFirestore.collection('testUserCollection').doc(userID)

	return new Promise((resolve, reject) => {
		userDbRef
		.collection('userReceipts')
		.add(dataToSave)
		.then((docRef) => {
			console.log('Ref to written document', docRef);
			resolve({docRef})
		})
		.catch(err => {
			console.error('Error writing receipt', err);
			reject(err)
		})
	})
}

function fetchUserWeatherData(userID){
	const userDbRef = projectFirestore.collection('testUserCollection').doc(userID)
	let data = []
	return new Promise((resolve, reject) => {
		userDbRef.collection('weatherData').get()
		.then(docSet => {
			if(docSet !== null){
				docSet.forEach(doc => {
					data.push({
						id: doc.id,
						...doc.data()
					})
				})
			}
			resolve(data)
		})
	})
}

export {
	fetchDbUserData, 
	fetchUserblog,
	fetchUserHotels,
	fetchDocumentByFieldName,
	fetchOneDocument,
	fetchUserReceipts,
	handleSaveNewPost, 
	handleSaveRecipt,
	fetchUserWeatherData
}