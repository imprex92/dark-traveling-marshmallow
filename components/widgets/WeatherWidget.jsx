import React, { useState, useEffect } from 'react'
import { getGeolocation } from 'components/utility/GetGeolocation'
import styles from 'styles/weatherWidget.module.css'
import { fetchWeatherByCoords } from 'components/utility/WeatherHandler'
import useSiteSettings from 'store/siteSettings';
import SkeletonWeatherWidget from 'components/loaders/skeletons/SkeletonWeatherWidget';
import { toImperial } from 'components/utility/UnitConverter';
import { projectTimestampNow } from 'firebase/config';

const WeatherWidget = () => {
	const updateWeatherState = useSiteSettings(state => state.setLatestWeather)

	const [reversedGeolocation, setReversedGeolocation] = useState(null)
	const [locationLoading, setLocationLoading] = useState(false)
	const [userLocation, setUserLocation] = useState(null)
	const [locationError, setLocationError] = useState(null)
	const [weatherObj, setWeatherObj] = useState(null)
	const { units } = useSiteSettings(state => state.data)
	const isMetric = units === 'celsius' ? true : false

	useEffect(() => { fetchGeolocation() }, [])

	async function fetchGeolocation() {
		setLocationLoading(true)
		if(navigator.geolocation){
			setLocationError(null)
			navigator.permissions.query({ name: 'geolocation' }).then(async res => {
				if(res.state === 'granted' || res.state === 'prompt'){
					await getGeolocation()
					.then(async position => {
						const coords = {latitude: position.data.latitude, longitude: position.data.longitude}
						setReversedGeolocation(position)
						await fetchWeatherByCoords(coords).then(weather => {
							weather.data.timestamp = projectTimestampNow;
							updateWeatherState(weather.data)
							setWeatherObj(weather.data)
						})
						setLocationLoading(false)
					})
					.catch(err => {
						setLocationError(err)
					})
				}
				else if(res.state === 'denied'){
					setLocationLoading(false)
					setLocationError('Your browser is not allowing geolocation')
					await getGeolocation()
				}
			})
		}
		else{
			setLocationLoading(false)
			setLocationError('Browser does not support Geolocation')
		}
		
	}

  return (
	<div className={styles.widgetWrapper}>
		<div className={styles.widgetContainer}>
			<div className={styles.degrees}>
				{weatherObj ? (<><span>{isMetric ? weatherObj.main.temp.toFixed(1) : !isMetric && toImperial(weatherObj.main.temp.toFixed(1), 'degrees') ? toImperial(weatherObj.main.temp.toFixed(1), 'degrees') : '??'}
                </span>
                <span>
                  {isMetric ? '°C' : '°F'}
                </span></> ) : <span>Just a sec...</span>}
			</div>
			{weatherObj ? <img width={90} className={styles.weatherIcon} src={`${process.env.OPENWEATHER_ICON_URL}${weatherObj?.weather[0]?.icon}@2x.png`} alt="Weather icon" /> : <SkeletonWeatherWidget />}
			<span onClick={() => fetchGeolocation()} className={`${locationLoading ? styles.reload_loading : styles.reload} material-icons`}>autorenew</span>
		</div>
	</div>
  )
}

export default WeatherWidget