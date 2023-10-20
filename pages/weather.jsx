import React, { useEffect, useState } from 'react'
import WeatherMaster from '../components/WeatherMaster'
import OpenWeather from '../components/OpenWeather'
import { useAuth } from '../contexts/AuthContext'
import { fetchWeatherByCoords, fetchWeatherByQuery } from '../components/utility/WeatherHandler'
import { getGeolocation } from '../components/utility/GetGeolocation'
import { getSs, setSs } from '../components/utility/StateHandler'
import SkeletonWeather from 'components/loaders/skeletons/SkeletonWeather'
import useSiteSettings from 'store/siteSettings';

const weather = () => {
	const { currentUser } = useAuth()
	const isOnline = currentUser ? true : false
	const updateInitialWeather = useSiteSettings(state => state.setLatestLocation)
	
	const [weatherObj, setWeatherObj] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [apiErr, setApiErr] = useState(null)

	useEffect(() => {
		const getInitialWeather = async () => {
			setIsLoading(true)
			const geoLocation = await getGeolocation()
			const coords = geoLocation && {latitude: geoLocation.data.latitude, longitude: geoLocation.data.longitude}
			coords && (await fetchWeatherByCoords(coords).then(data => {
				setWeatherObj(data)
				updateInitialWeather(data)
				setSs('userGeoLatest', data)
				setIsLoading(false)
			}))
		}
		getSs('userGeoLatest') ? (setWeatherObj(getSs('userGeoLatest')), setIsLoading(false)) : getInitialWeather()
	
	  return () => {
		
	  }
	}, [])
	
	async function handleFetchWeather(location){
		//setIsLoading(true)
		setApiErr(null)
		await fetchWeatherByQuery(location).then(res => {
			setWeatherObj(res)
			//setIsLoading(false)
		})
		.catch(err => {
			setApiErr(err)
		})
	}

	return (
		<>
			<div className='dashboard-main weather'>
				<WeatherMaster isOnline={isOnline} />
				{(weatherObj && !isLoading) && <OpenWeather isOnline={isOnline} fetchWeather={handleFetchWeather} weatherObj={weatherObj.data} apiError={apiErr} currentUser={currentUser} />}
				{isLoading && (
					<div className='skeleton-container weather-skeleton'>
						<SkeletonWeather position={'main'} />
						<SkeletonWeather position={'tags'} />
						<SkeletonWeather position={'additionalInfo'} />
						<SkeletonWeather position={'history'} />
					</div>
				) }
			</div>
		</>
	)
}

export default weather
