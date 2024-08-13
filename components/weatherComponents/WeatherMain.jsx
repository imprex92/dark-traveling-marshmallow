import React, { useState, useRef } from 'react'
import MainTemp from './MainTemp'
import AdditionalWeatherInfoDesktop from './AdditionalWeatherInfoDesktop'
import AdditionalWeatherInfoMobile from './AdditionalWeatherInfoMobile'
import CurrentWeatherLocationInfo from './CurrentWeatherLocationInfo'
import styles from 'styles/weatherComponents.module.css'
import CityChips from './CityChips'
import SearchHistory from './SearchHistory'
import Toolbox from './Toolbox'

const WeatherMain = ({ fetchWeather, currentWeather, apiError, currentUser }) => {
  const fallback = '--'

  const [isMetric, setIsMetric] = useState(true)
  const searchBox = useRef(null)

  const handleSearch = (e) => {
    e.key === 'Enter' && e.preventDefault()
    e.key === 'Enter' && e.target.value.trim() ? fetchWeather(e.target.value) : fetchWeather(e)
  };

  return (
    <>
      <div className={styles.weatherContainersContainer}>
        <div className={`${styles.mainTempContainer} z-depth-4`}>
          <div className={styles.currentWrapper}>
            <Toolbox isMetric={isMetric} setIsMetric={setIsMetric} currentWeather={currentWeather} />
            <div className="row valign-wrapper">
              <form className="col s11 offset-s1 m12 searchbar-section">
                <div className="row">
                  <div className={`${styles.searchBox} input-field col s11 m8 offset-m2`}>
                    <i className="material-icons suffix" onClick={() => handleSearch(searchBox.current.value)}>search</i>
                    <input type="search" className={`white-text validate ${apiError ? 'invalid' : 'valid'}`} onKeyDownCapture={(e) => e.key === "Enter" && handleSearch(e)} ref={searchBox} name="" id="search-field" placeholder=' ' />
                    <label className="white-text" htmlFor="search-field">Search location</label>
                    <span className='helper-text' data-error="Something went wrong. Did you spell correctly?"></span>
                  </div>
                </div>
              </form>
            </div>
            <div className={styles.weatherMainInfoContainer}>
              <CurrentWeatherLocationInfo currentWeather={currentWeather} fallback={fallback} />
              <MainTemp currentWeather={currentWeather} isMetric={isMetric} fallback={fallback} />
              <AdditionalWeatherInfoDesktop currentWeather={currentWeather} isMetric={isMetric} fallback={fallback} />
            </div>
          </div>
        </div>
        <div className={styles.chipsHistoryContainer}>
          <CityChips currentUser={currentUser} fetchWeather={fetchWeather} />
          <AdditionalWeatherInfoMobile currentWeather={currentWeather} isMetric={isMetric} fallback={fallback} />
          <SearchHistory fetchWeather={fetchWeather} currentUser={currentUser} />
        </div>
      </div>
    </>
  )
}

export default WeatherMain