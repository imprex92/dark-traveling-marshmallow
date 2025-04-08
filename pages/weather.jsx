import React, { useEffect, useState } from 'react'
import styles from 'styles/weatherComponents.module.css'
import WeatherMain from 'components/weatherComponents/WeatherMain'
import {
  fetchWeatherByCoords,
  fetchWeatherByQuery,
  fetchFallbackWeather,
} from 'components/utility/WeatherHandler'
import { getGeolocation } from 'components/utility/GetGeolocation'
import { getSs, setSs } from 'components/utility/StorageHandler'
import SkeletonWeather from 'components/loaders/skeletons/SkeletonWeather'
import useSiteSettings from 'store/siteSettings'
import { updateWeatherSearchHistory } from 'components/utility/subscriptions'
import SidebarNavigation from 'components/nav/SidebarNavigation'

import nookies from 'nookies'
import { firebaseAdminVerifyToken } from 'firebase/firebaseAdmin'

const weather = ({userAuth}) => {
  const isOnline = userAuth ? true : false
  const { weatherSearchHistory = [] } = useSiteSettings((state) => state.data)
  const updateSearchHistory = useSiteSettings(
    (state) => state.setWeatherSearchHistory,
  )
  const updateInitialWeather = useSiteSettings(
    (state) => state.setLatestLocation,
  )

  const [weatherObj, setWeatherObj] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [apiErr, setApiErr] = useState(null)
  const [historyArray, setHistoryArray] = useState(weatherSearchHistory)

  useEffect(() => {
    const unsubscribe = useSiteSettings.subscribe(
      (state) => state.data.weatherSearchHistory,
      (newHistory) => setHistoryArray(newHistory),
    )

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const permissionAndInitialWeather = async () => {
      try {
        if (navigator.permissions) {
          const res = await navigator.permissions.query({ name: 'geolocation' })
          if (res.state === 'denied') {
            setWeatherObj({ data: { error: 'Geolocation denied' } })
            M.toast({ text: 'Geolocation denied', classes: 'error' })
            try {
              const data = await fetchFallbackWeather()
              setWeatherObj(data)
            } catch (error) {
              console.error('Error fetching fallback weather', error)
              setWeatherObj({ data: { error } })
            }
          } else if (res.state === 'granted' || res.state === 'prompt') {
            await fetchWeather()
          }
          const handlePermissionChange = async () => {
            if (res.state === 'granted' || res.state === 'prompt') {
              await fetchWeather()
            }
          }
          res.addEventListener('change', handlePermissionChange)
          return () => {
            res.removeEventListener('change', handlePermissionChange)
          }
        } else {
          setWeatherObj({ data: { error: 'Permissions API not supported' } })
          M.toast({ text: 'Permissions API not supported', classes: 'error' })
        }
      } catch (error) {
        setWeatherObj({ data: { error } })
        console.error('Error in permissionAndInitialWeather', error)
      } finally {
        setIsLoading(false)
      }
    }

    const userGeoLatest = getSs('userGeoLatest')
    if (userGeoLatest) {
      setWeatherObj(userGeoLatest)
      setIsLoading(false)
    } else {
      permissionAndInitialWeather()
    }
  }, [])

  const handleSearchAndFetchWeather = async (location) => {
    setApiErr(null)
    try {
      const data = await fetchWeatherByQuery(location)
      setWeatherObj(data)
      const result = await updateWeatherSearchHistory({
        userID: userAuth.uid,
        payload: location,
      })
      if (result.error) {
        console.error('Error updating search history:', result.error)
        return
      }

      const updatedHistory = result.data

      updateSearchHistory(updatedHistory)
    } catch (error) {
      setApiErr(error)
      setWeatherObj({ data: { error } })
      M.toast({
        text: error?.message.includes('404')
          ? 'City does not exists. Try Again.'
          : error,
        classes: 'error',
      })
    }
  }

  const fetchWeather = async () => {
    console.log('Fetching weather');
    
    try {
      const geoLocation = await getGeolocation()
      if (!geoLocation) {
        throw new Error('Geolocation not available')
      }

      const coords = {
        latitude: geoLocation?.data?.latitude || null,
        longitude: geoLocation?.data?.longitude || null,
      }
      try {
        const data = await fetchWeatherByCoords(coords)
        if (data?.data?.name){
          try {
            const result = await updateWeatherSearchHistory({
              userID: userAuth.uid,
              payload: data.data?.name,
            })

            const updatedHistory = result.data

            updateSearchHistory(updatedHistory)

            setWeatherObj(data)
            updateInitialWeather(data)
            setSs('userGeoLatest', data)
          } catch (error) {
            console.error('Error updating search history:', error)
            return
          }
        }
      } catch (error) {
        setWeatherObj({ data: { error } })
        console.error('Error fetching weather by coordinates', error)
      }
    } catch (error) {
      setWeatherObj({ data: { error } })
      console.error('Error fetching weather', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div id="mainContainer" className={styles.weather}>
        <SidebarNavigation />
        {weatherObj && !isLoading && (
          <WeatherMain
            isOnline={isOnline}
            fetchWeather={handleSearchAndFetchWeather}
            currentWeather={weatherObj}
            apiError={apiErr}
            currentUser={userAuth}
          />
        )}
        {isLoading && (
          <div className="skeleton-container weather-skeleton">
            <SkeletonWeather position={'main'} />
            <SkeletonWeather position={'tags'} />
            <SkeletonWeather position={'additionalInfo'} />
            <SkeletonWeather position={'history'} />
          </div>
        )}
      </div>
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  try {
    const cookies = nookies.get(ctx)
    const token = await firebaseAdminVerifyToken(cookies.token)
    const { uid, email, name = null, picture = null } = token

    return {
      props: {
        userAuth: { uid, email, name, picture },
      },
    }
  } catch (err) {
    console.error(err)
    ctx.res.writeHead(302, {
      Location:
        err.code === 'auth/id-token-expired' ? '/login#tokenExpired' : '/login',
    })
    ctx.res.end()

    return { props: {} }
  }
}

export default weather
