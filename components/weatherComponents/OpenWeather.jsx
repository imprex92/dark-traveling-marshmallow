import React, { useState, useRef, useEffect } from 'react'
import { fetchUserWeatherChips } from 'components/utility/subscriptions'
import UnitSelectorDropdown from './UnitSelectorDropdown'
import MainTemp from './MainTemp'
import AdditionalWeatherInfoDesktop from './AdditionalWeatherInfoDesktop'
import AdditionalWeatherInfoMobile from './AdditionalWeatherInfoMobile'
import CurrentWeatherLocationInfo from './CurrentWeatherLocationInfo'

const OpenWeather = ({ fetchWeather, weatherObj, apiError, currentUser }) => {
  const { dt = '', main = {}, name = '', sys = {}, weather = [], wind = {}, visibility, error = null } = weatherObj
  const fallback = '--'

  console.log('weatherObj', weatherObj);

  const [searchText, setSearchText] = useState('')
  const [isMetric, setIsMetric] = useState(true)
  const fetchedData = useRef(null)
  const searchBox = useRef(null)

  async function fetchTags() {
    await fetchUserWeatherChips(currentUser.uid)
      .then(data => { initializeChips(data[0].tags) })
      .catch(err => { console.error('Error while loading tags', err); M.toast({ text: `Error loading tags, ${err}` }) })
  }

  function initializeChips(chipsData) {
    let chips = document.querySelectorAll(".chips")
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
      <h2>Weather</h2>
      <div className='weather-container'>
        <div className='container-1 z-depth-4'>
          <div className='current-wrapper'>
            <UnitSelectorDropdown isMetric={isMetric} setIsMetric={setIsMetric} />
            <div className="row valign-wrapper">
              <form className="col s11 offset-s1 m12 searchbar-section">
                <div className="row">
                  <div className="input-field col s11 m8 offset-m2 searchBox">
                    <i className="material-icons suffix" onClick={() => handleSearch(searchBox.current.value)}>search</i>
                    <input type="search" className={`white-text validate ${apiError ? 'invalid' : 'valid'}`} onKeyDownCapture={(e) => e.key === "Enter" && handleSearch(e)} ref={searchBox} name="" id="search-field" placeholder=' ' />
                    <label className="white-text" htmlFor="search-field">Search location</label>
                    <span className='helper-text' data-error="Something went wrong. Did you spell correctly?"></span>
                  </div>
                </div>
              </form>
            </div>
            <div className='weather-info-container'>
              <CurrentWeatherLocationInfo icon={weather[0]?.icon} name={name} country={sys?.country} error={error} date={dt} />
              <MainTemp isMetric={isMetric} fallback={fallback} main={main} error={error} />
              <AdditionalWeatherInfoDesktop isMetric={isMetric} fallback={fallback} main={main} visibility={visibility} wind={wind} error={error} />
            </div>
          </div>
        </div>
        <div className='container-2'>
          <div className="additional-wrapper z-depth-4">
            <div className="chips chips-placeholder"></div>
          </div>
          <AdditionalWeatherInfoMobile isMetric={isMetric} fallback={fallback} main={main} visibility={visibility} wind={wind} error={error} />
          <div className="history-wrapper z-depth-4">
            <span className='white-text'>To be Search history soon...</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default OpenWeather