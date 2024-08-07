import firebase from 'firebase/app'
import { fetchWeatherByCoords } from "./WeatherHandler";
import { v4 as uuidv4 } from 'uuid';

export function createSlug(title){
	if (!title) return uuidv4();

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
	try {
		if (coordinates.length > 0) {
			const { lat, lng } = coordinates[0];
			try {
				const weatherData = await fetchWeatherByCoords({ latitude: lat, longitude: lng })
				const geoPoint = new firebase.firestore.GeoPoint(lat, lng)
			
				return { weatherData, geoPoint, error: null};
			} catch (error) {
				console.error('Error fetching weather:', error)
				return { weatherData: null, geoPoint: null, error: error };
			}
		}
		return { weatherData: null, geoPoint: null, error: 'No coordinates provided' };
	} catch (error) {
		console.error('Error fetching weather:', error)
		return { weatherData: null, geoPoint: null, error: error };
	}
}
