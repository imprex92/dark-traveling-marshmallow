import React, { useState, useEffect, useLayoutEffect } from 'react'
import { getGeolocation } from 'components/utility/GetGeolocation'
import styles from 'styles/weatherWidget.module.css'
import { fetchWeatherByCoords } from 'components/utility/WeatherHandler'
import useSiteSettings from 'store/siteSettings';
import SkeletonWeatherWidget from 'components/loaders/skeletons/SkeletonWeatherWidget';
import { toImperial } from 'components/utility/UnitConverter';
import { projectTimestampNow } from 'firebase/config';
import { getCurrentDate } from 'components/utility/getCurrentDate';
import { isSameHour } from 'date-fns';

const WeatherWidget = () => {
	const updateWeatherState = useSiteSettings(state => state.setLatestWeather)
	const setShowWidget = useSiteSettings(state => state.setShowWeatherWidget)
	
	const [isMaximized, setIsMaximized] = useState(false)
	const [reversedGeolocation, setReversedGeolocation] = useState(null)
	const [locationLoading, setLocationLoading] = useState(false)
	const [userLocation, setUserLocation] = useState(null)
	const [locationError, setLocationError] = useState({error: false, message: null})
	const [weatherObj, setWeatherObj] = useState(null)
	const { units, showWeatherWidget, latestWeather } = useSiteSettings(state => state.data)
	const isMetric = units === 'metric' ? true : false
	
	useEffect(() => {
	  const showWidget = useSiteSettings.getState().getShowWeatherWidget();
	  setIsMaximized(showWidget);
	}, [useSiteSettings]);

	const toggleWidget = (bool) => {
	  setShowWidget(bool);
	  setIsMaximized(bool);
	  bool && fetchGeolocation();
	};
	
	const fetchGeolocation = async (manual = false) => {
		setLocationLoading(true);
		if (!navigator.geolocation) {
			setLocationError({ error: true, message: 'Not supported' });
			setLocationLoading(false);
			return;
		} else if(!manual && (latestWeather && isSameHour(new Date(latestWeather.timestamp), new Date()))) {
			setWeatherObj(latestWeather.data);
			setLocationLoading(false);
		} else if (manual || (latestWeather && !isSameHour(new Date(latestWeather.timestamp), new Date()))) {
			try {
				const res = await navigator.permissions.query({ name: 'geolocation' });
				if (res.state === 'denied') {
					throw new Error('Geolocation denied');
				}
			
				if (res.state === 'granted' || res.state === 'prompt') {
					const position = await getGeolocation();
					const coords = { latitude: position.data.latitude, longitude: position.data.longitude };
					setReversedGeolocation(position);
					const weather = await fetchWeatherByCoords(coords);
					weather.data.timestamp = projectTimestampNow;
					updateWeatherState({timestamp: new Date(), data: weather.data});
					setWeatherObj(weather.data);
				}
			} catch (err) {
				setLocationError({ error: true, message: err.message });
			} finally {
				setLocationLoading(false);
			}
		}
	};

  return (
	<>
		{isMaximized ? (
			<div className={`${styles.widgetWrapper} ${isMaximized ? '' : styles.minimized}`}>
				<div className={styles.widgetContainer}>
					<div className={styles.degrees}>
						{weatherObj ? (
							<>
								<span>
									{isMetric 
									? 
									weatherObj.main.temp.toFixed(1) 
									: !isMetric && toImperial(weatherObj.main.temp.toFixed(1), 'degrees') 
									? toImperial(weatherObj.main.temp.toFixed(1), 'degrees') 
									: '??'
								}
						</span>
						<span>
						{isMetric ? '°C' : '°F'}
						</span></> ) 
						: locationError?.error ? <span>{locationError?.message}</span> : <span>Press refresh</span>}
					</div>
					{weatherObj ? 
						<img width={90} className={styles.weatherIcon} src={`${process.env.NEXT_PUBLIC_OPENWEATHER_ICON_URL}${weatherObj?.weather[0]?.icon}@2x.png`} alt="Weather icon" /> 
						: <SkeletonWeatherWidget />
					}
					<span onClick={() => fetchGeolocation(true)} className={`${locationLoading ? styles.reload_loading : styles.reload} material-icons`}>autorenew</span>
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