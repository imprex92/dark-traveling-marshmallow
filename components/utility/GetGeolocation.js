export const getGeolocation = () => {
	let status = {message: '', latitude: '', longitude: ''}
	if(navigator.geolocation){
		console.log("Geolocation is avaliable");
		status.message = "locating you..."
		navigator.geolocation.getCurrentPosition(position => {
			console.log(position);
			return position
		})
	}
	else{
		status.message = "Your browser doesn't support Geolocation"
		return status
	}
}


export const reverstGeolocation = () => {

}