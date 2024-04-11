import firebase from 'firebase/app'
import { fetchWeatherByCoords } from "./WeatherHandler";

export function createSlug(title){
	const titleToSlug = title
	.replace(/å/g, 'a')
	.replace(/Å/g, 'A')
	.replace(/ä/g, 'a')
	.replace(/Ä/g, 'A')
	.replace(/ö/g, 'o')
	.replace(/Ö/g, 'o')
	.replace(/[.,!?/]/g, '')
	const slug = (titleToSlug.replace(/ /g, "-")) + (Math.floor((Math.random() * 10) + 1));
	return slug
}
// Function to extract address components
export function getAddressComponents(locationData) {
	return locationData[0]?.address_components || [];
}
// Function to get a component's value by its type
export function getComponentValue(components, type) {
	const component = components.find(el => el.types[0] === type);
	return component?.long_name || null;
}
// Function to create a GeoPoint object
export async function getGeoPointAndWeather(coordinates) {
	if (coordinates.length > 0) {
		const { lat, lng } = coordinates[0];

		const weatherData = await fetchWeatherByCoords({ latitude: lat, longitude: lng })
		const geoPoint = new firebase.firestore.GeoPoint(lat, lng)
		
		return { weatherData, geoPoint };
	}
	return null;
}
