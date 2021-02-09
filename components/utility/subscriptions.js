import { projectFirestore } from '../../firebase/config'

function fetchDbUserData(userID){
	return new Promise((resolve, reject) => {
		projectFirestore.collection('testUserCollection').doc('FP5M7soIZIbxLOFOCOEtkjtiUm53').get()
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

function fetchUserblog(userID) {
	const userDbRef = projectFirestore.collection('testUserCollection').doc('FP5M7soIZIbxLOFOCOEtkjtiUm53')
	let data = [];
	return new Promise((resolve, reject) => {
		userDbRef.collection('blogPosts').get()
		.then(docSet => {
			if(docSet !== null){
				docSet.forEach(doc => data.push(({...doc.data(), id: doc.id})))
			}
		})
		resolve(data)
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
		})
		resolve(data)
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

export { fetchDbUserData, fetchUserblog, fetchUserHotels, fetchOneDocument }