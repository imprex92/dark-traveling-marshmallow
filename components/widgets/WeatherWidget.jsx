import React, { useState, useEffect, useLayoutEffect } from 'react'
import { getGeolocation } from 'components/utility/GetGeolocation'
import styles from 'styles/weatherWidget.module.css'
import { fetchWeatherByCoords } from 'components/utility/WeatherHandler'
import useSiteSettings from 'store/siteSettings';
import SkeletonWeatherWidget from 'components/loaders/skeletons/SkeletonWeatherWidget';
import { toImperial } from 'components/utility/UnitConverter';
import { projectTimestampNow } from 'firebase/config';

const WeatherWidget = () => {
	const updateWeatherState = useSiteSettings(state => state.setLatestWeather)
	const setShowWidget = useSiteSettings(state => state.setShowWeatherWidget)
	
	const [isMaximized, setIsMaximized] = useState(false)
	const [reversedGeolocation, setReversedGeolocation] = useState(null)
	const [locationLoading, setLocationLoading] = useState(false)
	const [userLocation, setUserLocation] = useState(null)
	const [locationError, setLocationError] = useState({error: false, message: null})
	const [weatherObj, setWeatherObj] = useState(null)
	const { units, showWeatherWidget } = useSiteSettings(state => state.data)
	const isMetric = units === 'metric' ? true : false
	
	useLayoutEffect(() => {
		const showWidget = useSiteSettings.getState().getShowWeatherWidget()
		setIsMaximized(showWidget)
	}, [])
	useEffect(() => { showWeatherWidget && fetchGeolocation() }, [])

	const toggleWidget = (bool) => {
		setShowWidget(bool)
		setIsMaximized(bool)
	}

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
						setLocationError({error: true, message: err.message})
					})
				}
				else if(res.state === 'denied'){
					setLocationLoading(false)
					setLocationError({error: true, message: 'Geolocation denied'})
					toggleWidget(false)
				}
			})
		}
		else{
			setLocationLoading(false)
			setLocationError({error: true, message: 'Not supported'})
			toggleWidget(false)
		}
	}

  return (
	<>
		{isMaximized ? (
			<div className={`${styles.widgetWrapper} ${isMaximized ? '' : styles.minimized}`}>
				<div className={styles.widgetContainer}>
					<div className={styles.degrees}>
						{weatherObj ? (<><span>{isMetric ? weatherObj.main.temp.toFixed(1) : !isMetric && toImperial(weatherObj.main.temp.toFixed(1), 'degrees') ? toImperial(weatherObj.main.temp.toFixed(1), 'degrees') : '??'}
						</span>
						<span>
						{isMetric ? '°C' : '°F'}
						</span></> ) : locationError?.error ? <span>{locationError?.message}</span> : <span>Just a sec...</span>}
					</div>
					{weatherObj ? <img width={90} className={styles.weatherIcon} src={`${process.env.NEXT_PUBLIC_OPENWEATHER_ICON_URL}${weatherObj?.weather[0]?.icon}@2x.png`} alt="Weather icon" /> : <SkeletonWeatherWidget />}
					<span onClick={() => fetchGeolocation()} className={`${locationLoading ? styles.reload_loading : styles.reload} material-icons`}>autorenew</span>
					<span onClick={() => toggleWidget(false)} className={`${styles.maximized} material-icons`}>chevron_right</span>
				</div>
			</div>
		) : (
			<span onClick={() => toggleWidget(true)} className={`${styles.minimized} material-icons`}>chevron_left</span>
		)}
	</>
  )
}

export default WeatherWidget