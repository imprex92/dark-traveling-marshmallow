import { projectFirestore, projectFirebase, projectStorage } from '../../firebase/config'
import { dateMMDDYY } from '../formatters/DateFormatter'

const baseQuery = projectFirestore.collection('testUserCollection')

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

function handleSaveNewPost({userID, dataToSave, media}){
	return new Promise(async (resolve, reject) => {
		let country = dataToSave.postLocationData.country
		const postDate = dateMMDDYY(dataToSave.pickedDateForPost)
	
		const userDbRef = projectFirestore.collection('testUserCollection').doc(userID)
		const fileUploadPromises = media.map((file) => {
			const filePath = `userData/${userID}/${country}/${postDate}/${file.name}`.replace(/\s/g, '_')
			const storageRef = projectStorage.ref().child(filePath)

			return storageRef.put(file).then((snapshot) => {
				return snapshot.ref.getDownloadURL()
			})
		})

		try {
			const urls = await Promise.all(fileUploadPromises)
			dataToSave.mediaURLs = urls
			await userDbRef.collection('blogPosts').doc().set(dataToSave)
			await userDbRef.update({
				countriesVisited: projectFirebase.firestore.FieldValue.arrayUnion(country)
			})
			
			resolve('Post saved successfully!')
		} catch (err) {
			console.error('Error saving post:', err)
			reject(err)
		}
	})
}

function handleSaveRecipt ({ userID, dataToSave }){
	const userDbRef = projectFirestore.collection('testUserCollection').doc(userID)

	return new Promise((resolve, reject) => {
		userDbRef
		.collection('userReceipts')
		.add(dataToSave)
		.then((docRef) => {
			resolve({docRef})
		})
		.catch(err => {
			console.error('Error writing receipt', err);
			reject(err)
		})
	})
}

function fetchUserWeatherChips(userID){
	const userDbRef = projectFirestore.collection('testUserCollection').doc(userID)
	let data = []
	return new Promise((resolve, reject) => {
		userDbRef.collection('weatherData').doc('WeatherChips').get()
		.then(docSet => {
			if(!docSet.exists){ resolve([{id: 'WeatherChips', tags: []}])}
			else if(docSet.exists && docSet !== null){
				data.push({
					id: docSet.id,
					...docSet.data()
				})
			}
			resolve(data)
		})
	})
}
//TODO handle add and remove chips from firestore
const addWeatherChip = () => {}
const removeWeatherChip = () => {}

export {
	fetchDbUserData, 
	fetchUserblog,
	fetchUserHotels,
	fetchDocumentByFieldName,
	fetchUserReceipts,
	handleSaveNewPost, 
	handleSaveRecipt,
	fetchUserWeatherChips,
	addWeatherChip,
	removeWeatherChip,
}