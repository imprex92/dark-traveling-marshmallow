import React, { useState } from 'react'
import { getGeolocation } from './utility/GetGeolocation'
import useSiteSettings from 'store/siteSettings';
import { projectTimestampNow } from 'firebase/config';
import styles from 'styles/dashboard.module.css'

const Geolocator = () => {
	const updateLocationState = useSiteSettings(state => state.setLatestLocation)
	
	const [reversedGeolocation, setReversedGeolocation] = useState(null)
	const [locationLoading, setLocationLoading] = useState(false)
	const [userLocation, setUserLocation] = useState(null)
	const [locationError, setLocationError] = useState(null)

	async function fetchGeolocation() {
		setLocationLoading(true)
		if(navigator.geolocation){
			setLocationError(null)
			navigator.permissions.query({ name: 'geolocation' }).then(async res => {
				if(res.state === 'granted' || res.state === 'prompt'){
					await getGeolocation()
					.then(position => {
						setReversedGeolocation(position)
						position.data.timestamp = projectTimestampNow;
						updateLocationState(position)
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
	function printLocation(positionData){
		if(positionData){
			let {locality, city, countryName, countryCode} = positionData.data;
			const print = `${locality ? locality + ',' : ' '}${city ? city + ',' : ' '}${countryName ? countryName : countryCode ?? ''}`

			return print.split(',').join(', ');
		}
		else
		return null
	}

  return (
	<>
		<div className={styles.geoLocator}>
			<div className={styles.geoLocationSection}>
				<span onClick={fetchGeolocation}>
					<p>
						<i className="material-icons">place</i>
						{locationError && <b style={{color: "red"}}>{locationError}</b>}
						<b>
							{!locationError && (reversedGeolocation && !locationLoading) ? printLocation(reversedGeolocation) : locationLoading ? 'Looking up position...' : locationError ? '' : 'Press to get location...'}
						</b>
					</p>
				</span>
			</div>					
		</div>
	</>
  )
}

export default Geolocator