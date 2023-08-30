import { projectAuth, projectFirestore, projectStorage } from "firebase/config";

// File handles operations regarding user accounts
const user = projectAuth.currentUser;
const refToAccountDoc = user && projectFirestore
	.collection('testUserCollection')
	.doc(user.uid);
const availableProviders = ['google.com']


async function accountRemoval (reauthCallback) {
	try {
		const deletion = await user.delete()
		.then(data => {return {code: 200, message: 'Account deleted'}})
		.catch(err => {return err})
		
		if(deletion.code === "auth/requires-recent-login"){
			await reauthCallback(deletion)
		}
		return deletion
	} catch (error) {
		return error
	}
}

function reAuthenticate(params) {
	return new Promise((resolve, reject) => {
		if(availableProviders.includes(params.providerId))
			user.reauthenticateWithPopup(params).then(data => resolve(data)).catch(err => reject(err))
		else if(params.providerId === 'password')
			user.reauthenticateWithCredential(params).then(data => resolve(data)).catch(err => reject(err))
		else
			reject({code: 500, message: 'Something went wrong authenticating the user'})
	})
}

function verifyUserEmail() {
	return new Promise((resolve, reject) => {
		projectAuth.useDeviceLanguage()
		user.sendEmailVerification()
		.then((data) => {
			console.log("email sent")
			resolve(data)
		}).catch((err) => reject(err))
	})
}
function updateEmail(email) {
	return new Promise((resolve, reject) => {
		user.updateEmail(email).then(data => resolve(data)).catch(error =>  reject(error))
	})
}
function updatePassword(password) {
	return new Promise((resolve, reject) => {
		user.updatePassword(password).then((data)=> resolve(data)).catch(error => reject(error))
	})
}

/* START update account, delete existing profile picture + upload new + update account data accordingly */

async function deleteExistingFile(user) {
	const listRef = projectStorage.app
		.storage('gs://dark-traveling-marshmallow.appspot.com')
		.ref(`userData/${user.uid}/profileData/profilePicture`)

	try {
		const fileList = await listRef.list()
		if(fileList.items.length > 0){
			await fileList.items[0].delete();
		}
	} catch (error) {
		console.error('Error deleting existing file', error);
		throw error;
	}
}
async function uploadNewPic(data){
	const refToAccountBucket = projectStorage.app
        .storage('gs://dark-traveling-marshmallow.appspot.com')
        .ref(`userData/${user.uid}/profileData/profilePicture/${data.file.name}`);

	try {
		await refToAccountBucket.put(data.file);

		const url = await refToAccountBucket.getDownloadURL();
		await user.updateProfile({
			displayName: data.name.value,
			phoneNumber: data.number.value,
			photoURL: url,
		})

		await refToAccountDoc.update({
			photoURL: url,
			displayName: data.name.value,
			phoneNumber: data.number.value,
		});

		return {
			status: 200,
			message: 'Storage upload and profile update: OK',
			url
		}
	} catch (error) {
		throw Error(`Error uploading new file or updating profile:\n${error}`);
	}
}

async function updateAccountData(data){
	try {
		await deleteExistingFile(user)
		const result = await uploadNewPic(data)
		return result;
	} catch (error) {
		return {status: 406, message: error.message}
	}
}

/* END */

async function updateAddress(addressData) {
	try {
		await refToAccountDoc.set(addressData, {merge: true});
		return {status: 200, message: 'Address update successful'};
	} catch (error) {
		throw {status: 500, message: `An error occurred while updating the address, ${error}`};
	}
}

export {
	accountRemoval,
	reAuthenticate,
	verifyUserEmail,
	updateEmail,
	updatePassword,
	updateAccountData,
	updateAddress,
}
