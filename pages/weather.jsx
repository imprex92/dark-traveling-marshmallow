import React, { useEffect, useState } from 'react'
import styles from 'styles/weatherComponents.module.css'
import OpenWeather from 'components/weatherComponents/OpenWeather'
import SideNavLight from 'components/nav/SideNavLight'
import { useAuth } from 'contexts/AuthContext'
import { fetchWeatherByCoords, fetchWeatherByQuery, fetchFallbackWeather } from 'components/utility/WeatherHandler'
import { getGeolocation } from 'components/utility/GetGeolocation'
import { getSs, setSs } from 'components/utility/StorageHandler'
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
		const permissionAndInitialWeather = async () => {
			try {
				if (navigator.permissions) {
					const res = await navigator.permissions.query({ name: 'geolocation' });
					if (res.state === 'denied') {
						setWeatherObj({ data: { error: 'Geolocation denied' } });
						M.toast({ text: 'Geolocation denied', classes: 'error' });
						try {
							const data = await fetchFallbackWeather();
							setWeatherObj(data);
						} catch (error) {
							console.error('Error fetching fallback weather', error);
							setWeatherObj({data: { error }});							
						}
					} else if (res.state === 'granted' || res.state === 'prompt') {
						await fetchWeather();
					}
					const handlePermissionChange = async () => {
						if (res.state === 'granted' || res.state === 'prompt') {
							await fetchWeather();
						}
					};
					res.addEventListener('change', handlePermissionChange);
					return () => {
						res.removeEventListener('change', handlePermissionChange);
					};
				} else {
					setWeatherObj({ data: { error: 'Permissions API not supported' } });
					M.toast({ text: 'Permissions API not supported', classes: 'error' });
				}
			} catch (error) {
				setWeatherObj({data: { error }});
				console.error('Error in permissionAndInitialWeather', error);
			} finally {
				setIsLoading(false);
			}
		};
	
		const userGeoLatest = getSs('userGeoLatest');
		if (userGeoLatest) {
			setWeatherObj(userGeoLatest);
			setIsLoading(false);
		} else {
			permissionAndInitialWeather();
		}
	}, []);
	
	const handleFetchWeather = async (location) => {
		setApiErr(null);
		try {
			const data = await fetchWeatherByQuery(location);
			setWeatherObj(data);
		} catch (error) {
			setApiErr(error);
			setWeatherObj({data: { error }});
			M.toast({ text: error?.message.includes('404') ? 'City does not exists. Try Again.' : error, classes: 'error' });
		}
	};

	const fetchWeather = async () => {
		try {
			const geoLocation = await getGeolocation();
			if (!geoLocation) {
				throw new Error('Geolocation not available');
			}
	
			const coords = {
				latitude: geoLocation.data.latitude,
				longitude: geoLocation.data.longitude,
			};
	
			try {
				const data = await fetchWeatherByCoords(coords);
				setWeatherObj(data);
				updateInitialWeather(data);
				setSs('userGeoLatest', data);
			} catch (error) {
				setWeatherObj({data: { error }});
				console.error('Error fetching weather by coordinates', error);
			}
		} catch (error) {
			setWeatherObj({data: { error }});
			console.error('Error fetching weather', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className='weather'>
				<div className={styles.navigation}>
					<SideNavLight/>
				</div>
				{(weatherObj && !isLoading) && <OpenWeather isOnline={isOnline} fetchWeather={handleFetchWeather} currentWeather={weatherObj} apiError={apiErr} currentUser={currentUser} />}
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
