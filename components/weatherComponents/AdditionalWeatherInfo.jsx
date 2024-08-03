import React, { useEffect } from "react";
import { mToKm, toImperial } from "components/utility/UnitConverter";


const AdditionalWeatherInfo = ({ isMetric, fallback, main, visibility, wind }) => {
    useEffect(() => {
    
    }, []);

    return (
        <div className="additional-info desktop-only">
                <div className='info-container-1'>
                  <div>
                    <img src="/assets/icons/thermometer-down.png" />
                    <span>Min Temp</span>
                    <span>{isMetric ? main?.temp_min?.toFixed(1) : !isMetric && toImperial(main?.temp_min?.toFixed(1), 'degrees') ? toImperial(main?.temp_min?.toFixed(1), 'degrees') : fallback} {isMetric ? '°C' : '°F'}</span>
                  </div>
                  <div className='vertical-line'></div>
                  <div>
                    <img src="/assets/icons/thermometer-up.png" />
                    <span>Max Temp</span>
                    <span>{isMetric ? main?.temp_max?.toFixed(1) : !isMetric && toImperial(main?.temp_max?.toFixed(1), 'degrees') ? toImperial(main?.temp_max?.toFixed(1), 'degrees') : fallback} {isMetric ? '°C' : '°F'}</span>
                  </div>
                </div>
                <div className='info-container-1'>
                  <div>
                    <img src="/assets/icons/visible--v2.png" />
                    <span>Visibility</span>
                    <span>{isMetric && mToKm(visibility) ? `${mToKm(visibility)}` : !isMetric && toImperial(visibility, 'length') ? toImperial(visibility, 'length') : fallback} {isMetric ? 'Km' : 'mi'}</span>
                  </div>
                  <div className='vertical-line'></div>
                  <div>
                    <img src="/assets/icons/temperature--v2.png" />
                    <span>Feels like</span>
                    <span>{isMetric ? main?.feels_like?.toFixed(1) : !isMetric && toImperial(main?.feels_like?.toFixed(1), 'degrees') ? toImperial(main?.feels_like?.toFixed(1), 'degrees') : fallback} {isMetric ? '°C' : '°F'}</span>
                  </div>
                </div>
                <div className='info-container-2'>
                  <div>
                    <img src="/assets/icons/humidity.png" />
                    <span>Humidity</span>
                    <span>{main?.humidity ?? fallback} %</span>
                  </div>
                  <div className='vertical-line'></div>
                  <div>
                    <img src="/assets/icons/wind--v1.png" />
                    <span>Wind</span>
                    <span>{isMetric && wind?.speed ? wind?.speed : !isMetric && wind?.speed ? toImperial(wind?.speed, 'speed') : fallback} {isMetric ? 'm/s' : 'f/s'}</span>
                  </div>
                </div>
              </div>
    );
}

export default AdditionalWeatherInfo;