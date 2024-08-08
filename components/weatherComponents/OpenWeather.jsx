import React, { useState, useRef, useEffect } from 'react'
import { fetchUserWeatherChips } from 'components/utility/subscriptions'
import UnitSelectorDropdown from './UnitSelectorDropdown'
import MainTemp from './MainTemp'
import AdditionalWeatherInfoDesktop from './AdditionalWeatherInfoDesktop'
import AdditionalWeatherInfoMobile from './AdditionalWeatherInfoMobile'
import CurrentWeatherLocationInfo from './CurrentWeatherLocationInfo'
import styles from 'styles/weatherComponents.module.css'

const OpenWeather = ({ fetchWeather, currentWeather, apiError, currentUser }) => {
  const fallback = '--'

  const [isMetric, setIsMetric] = useState(true)
  const searchBox = useRef(null)

  async function fetchTags() {
    await fetchUserWeatherChips(currentUser.uid)
      .then(data => { initializeChips(data[0].tags) })
      .catch(err => { console.error('Error while loading tags', err); M.toast({ text: `Error loading tags, ${err}` }) })
  }

  function initializeChips(chipsData) {
    let chips = document.querySelectorAll("#chips")
    M.Chips.init(chips, {
      data: chipsData,
      placeholder: 'Enter city to save shortcuts',
      limit: 7,
      secondaryPlaceholder: '+City',
      onChipSelect: (data, i) => { fetchWeather(i.firstChild.textContent.toString()) },
      onChipAdd: (data, i) => { },
      onChipDelete: (data, i) => { }
    })
  }

  useEffect(() => {
    currentUser && fetchTags()
  }, [currentUser])

  const handleSearch = (e) => {
    e.key === 'Enter' && e.preventDefault()
    e.key === 'Enter' && e.target.value.trim() ? fetchWeather(e.target.value) : fetchWeather(e)
  };

  return (
    <>
      <div className={styles.weatherContainersContainer}>
        <div className={`${styles.mainTempContainer} z-depth-4`}>
          <div className={styles.currentWrapper}>
            <UnitSelectorDropdown isMetric={isMetric} setIsMetric={setIsMetric} />
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
          <div className={`${styles.chipsContainer} z-depth-4`}>
            <div id='chips' className={`${styles.chips}chips-placeholder`}></div>
          </div>
          <AdditionalWeatherInfoMobile currentWeather={currentWeather} isMetric={isMetric} fallback={fallback} />
          <div className={`${styles.historyContainer} z-depth-4`}>
            <span className='white-text'>To be Search history soon...</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default OpenWeather