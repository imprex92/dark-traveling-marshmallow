export function getTime(){
	
	let offset = new Date().getTimezoneOffset() / 60;
	console.log(offset);
	let hours = new Date().getHours()
	let minutes = new Date().getMinutes()
	let timeNow = `${hours}:${minutes}`
	console.log(hours);
	console.log(timeNow);

	return timeNow, hours, minutes
	
}