import React, { useEffect, useState } from 'react'
import WeatherMaster from '../components/WeatherMaster'
import OpenWeather from '../components/OpenWeather'
import { useAuth } from '../contexts/AuthContext'
import { fetchWeatherByCoords, fetchWeatherByQuery } from '../components/utility/WeatherHandler'
import { getGeolocation } from '../components/utility/GetGeolocation'
import { getSs, setSs } from '../components/utility/StateHandler'
import SkeletonWeather from 'components/loaders/skeletons/SkeletonWeather'

const weather = () => {
	const { currentUser } = useAuth()
	const isOnline = currentUser ? true : false
	
	const [weatherObj, setWeatherObj] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [apiErr, setApiErr] = useState(null)

	useEffect(() => {
		const getInitialWeather = async () => {
			setIsLoading(true)
			const geoLocation = await getGeolocation()
			const coords = geoLocation && {latitude: geoLocation.data.latitude, longitude: geoLocation.data.longitude}
			coords && await fetchWeatherByCoords(coords).then(data => {
				console.log('fetch initial');
				setWeatherObj(data)
				setSs('userGeoLatest', data)
				setIsLoading(false)
			})
		}
		getSs('userGeoLatest') ? (setWeatherObj(getSs('userGeoLatest')), setIsLoading(false)) : getInitialWeather()
	
	  return () => {
		
	  }
	}, [])
	
	async function handleFetchWeather(location){
		//setIsLoading(true)
		console.log(location);
		setApiErr(null)
		await fetchWeatherByQuery(location).then(res => {
			console.log(res);
			setWeatherObj(res)
			//setIsLoading(false)
		})
		.catch(err => {
			console.log('there was an error', err);
			setApiErr(err)
		})
	}

	return (
		<>
			<WeatherMaster isOnline={isOnline} />
			<div className='dashboard-main weather'>
				<h2>Weather</h2>
				{(weatherObj && !isLoading) && <OpenWeather isOnline={isOnline} fetchWeather={handleFetchWeather} weatherObj={weatherObj.data} apiError={apiErr} />}
				{isLoading && (
					<div className='skeleton-container'>
						<SkeletonWeather />
						<SkeletonWeather />
						<SkeletonWeather />
					</div>
				) }
			</div>
		</>
	)
}

export default weather
