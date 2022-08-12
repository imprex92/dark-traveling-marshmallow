import axios from 'axios'

export function getGeolocation(){
	return new Promise((resolve, reject) => {
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(position => {
				const userLanguage = navigator.language || navigator.userLanguage;
				const lang = userLanguage.split('-')[0]
				let latitude = position.coords.latitude;
				let longitude = position.coords.longitude;
				const baseURL = "https://api.bigdatacloud.net/data/reverse-geocode-client"
				let fullURL = baseURL + `?latitude=${latitude}&longitude=${longitude}&localityLanguage=${lang}`
				axios.get(fullURL)
				.then(result => {
					console.log("reverse OK", result);
					const reversedGeoData = result;
					console.log('result', reversedGeoData);
					resolve(reversedGeoData)
				})
				.catch(err => {
					reject({isSuccess: false, message: err})
				})
			})
		}
	})
}
