import React, { useState, useRef, useEffect } from 'react'
import { unixConverter, mToKm, toImperial } from './utility/UnitConverter'
if (typeof window !== 'undefined') {
  M = require('@materializecss/materialize/dist/js/materialize.min.js')
}
import Flag from 'react-world-flags'
import useBearStore from 'store/teststore'

const OpenWeather = ({ fetchWeather, weatherObj, apiError }) => {
  console.log('OpenWeather object from parent', weatherObj, 'error? : ', apiError);
  const { dt = '', main = {}, name = '', sys = {}, weather = [], wind = {}, visibility } = weatherObj
  const [searchText, setSearchText] = useState('')
  const [isMetric, setIsMetric] = useState(true)
  const searchBox = useRef(null)
  const count = useBearStore(state => state.bears)
  const inc = useBearStore(state => state.increasePopulation)
  const dec = useBearStore(state => state.decreasePopulation)
  const ext = useBearStore(state => state.exterminatePopulation)


  useEffect(() => {
    let triggerEl = document.querySelectorAll('.dropdown-trigger')
    M.Dropdown.init(triggerEl, {
      constrainWidth: false,
      hover: true,
      closeOnClick: false
    })

    let chips = document.querySelectorAll(".chips")
    M.Chips.init(chips, {
      data: [{
        tag: 'Gothenburg',
      }, {
        tag: 'Shanghai',
      }, {
        tag: 'Paris',
      }],
      placeholder: 'Enter city to save',
      limit: 7,
      secondaryPlaceholder: '+City',
      onChipSelect: (data, i) => { chipSelected(i.firstChild.textContent.toString()) }
    })

    return () => {
    }
  }, [])
  
  const chipSelected = (data) => {
    fetchWeather(data)
  }

  const handleSearch = (e) => {
    e.key === 'Enter' && e.preventDefault()
    e.key === 'Enter' && e.target.value.trim() ? fetchWeather(e.target.value) : fetchWeather(e)
  };

  return (
    <>
      <div className='weather-container'>
        <div className='container-1 z-depth-4'>
          <div className='current-wrapper'>

            {/* <!-- Dropdown Trigger --> */}
            <div className='light-settings dropdown-trigger' href='#' data-target='weather-settings-dropdown'>
              <span></span>
              <span></span>
              <span></span>
            </div>
            {/* <!-- Dropdown Structure --> */}
            <ul id='weather-settings-dropdown' className='dropdown-content'>
              <li><a href="#!"><div className="switch">
                <label className='black-text'>
                  Imperial
                  <input defaultChecked={isMetric} type="checkbox" onClick={(e) => setIsMetric(e.target.checked)} />
                  <span className="lever"></span>
                  Metric
                </label>
              </div></a></li>
            </ul>


            <div className="row valign-wrapper">
              <form className="col s12 searchbar-section">
                <div className="row">
                  <div className="input-field col s8 push-s2 m6 push-m3 searchBox">
                    <i className="material-icons suffix" onClick={() => handleSearch(searchBox.current.value)}>search</i>
                    <input type="search" className={`white-text validate ${apiError ? 'invalid' : 'valid'}`} onKeyDownCapture={(e) => e.key === "Enter" && handleSearch(e)} ref={searchBox} name="" id="search-field" />
                    <label className="white-text" htmlFor="search-field">Enter location for weather</label>
                    <span className='helper-text' data-error="Something went wrong. Did you spell correctly?"></span>
                  </div>
                </div>
              </form>
            </div>
            <div className='weather-info-container'>
              <div className="location-info">
                <img className='weather-icon' src={`${process.env.OPENWEATHER_ICON_URL}${weather[0]?.icon}@2x.png`} alt="Weather icon" />
                <div className='name-date'>
                  <span className='name'>{name}, {sys?.country} <Flag code={sys?.country} height="16" /></span>
                  <span className='date'>{unixConverter(dt)}</span>
                </div>
              </div>
              <div className="main-temp">
                <span>{isMetric ? main.temp.toFixed(1) : !isMetric && toImperial(main.temp.toFixed(1), 'degrees') ? toImperial(main.temp.toFixed(1), 'degrees') : '??'}
                </span>
                <span>
                  {isMetric ? '°C' : '°F'}
                </span>
              </div>
              <div className="additional-info">
                <div className='info-container-1'>
                  <div>
                    <img src="https://img.icons8.com/ios/50/FFFFFF/thermometer-down.png" />
                    <span>Min Temp</span>
                    <span>{isMetric ? main.temp_min.toFixed(1) : !isMetric && toImperial(main.temp_min.toFixed(1), 'degrees') ? toImperial(main.temp_min.toFixed(1), 'degrees') : '??'} {isMetric ? '°C' : '°F'}</span>
                  </div>
                  <div className='vertical-line'></div>
                  <div>
                    <img src="https://img.icons8.com/ios/50/FFFFFF/thermometer-up.png" />
                    <span>Max Temp</span>
                    <span>{isMetric ? main.temp_max.toFixed(1) : !isMetric && toImperial(main.temp_max.toFixed(1), 'degrees') ? toImperial(main.temp_max.toFixed(1), 'degrees') : '??'} {isMetric ? '°C' : '°F'}</span>
                  </div>
                </div>
                <div className='info-container-1'>
                  <div>
                    <img src="https://img.icons8.com/ios/50/FFFFFF/visible--v2.png" />
                    <span>Visibility</span>
                    <span>{isMetric && mToKm(visibility) ? `${mToKm(visibility)}` : !isMetric && toImperial(visibility, 'length') ? toImperial(visibility, 'length') : 'Unknown'} {isMetric ? 'Km' : 'mi'}</span>
                  </div>
                  <div className='vertical-line'></div>
                  <div>
                    <img src="https://img.icons8.com/ios/50/FFFFFF/temperature--v2.png" />
                    <span>Feels like</span>
                    <span>{isMetric ? main.feels_like.toFixed(1) : !isMetric && toImperial(main.feels_like.toFixed(1), 'degrees') ? toImperial(main.feels_like.toFixed(1), 'degrees') : '??'} {isMetric ? '°C' : '°F'}</span>
                  </div>
                </div>
                <div className='info-container-2'>
                  <div>
                    <img src="https://img.icons8.com/external-line-adri-ansyah/64/FFFFFF/external-humidity-world-ozone-day-line-adri-ansyah.png" />
                    <span>Humidity</span>
                    <span>{main?.humidity ?? 'Unknow'} %</span>
                  </div>
                  <div className='vertical-line'></div>
                  <div>
                    <img src="https://img.icons8.com/ios-glyphs/30/FFFFFF/wind--v1.png" />
                    <span>Wind</span>
                    <span>{isMetric && wind?.speed ? wind.speed : !isMetric && wind?.speed ? toImperial(wind.speed, 'speed') : 'Unknown'} {isMetric ? 'm/s' : 'f/s'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container-2'>
          <div className="additional-wrapper z-depth-4">
            <div className="chips chips-initial"></div>
          </div>
          <div className="history-wrapper z-depth-4">
            {count}
            <button onClick={inc}>Increase</button>
            <button onClick={dec}>Decrease</button>
            <button onClick={ext}>Exterminate</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default OpenWeather