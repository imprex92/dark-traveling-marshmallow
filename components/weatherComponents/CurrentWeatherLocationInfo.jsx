import React from "react";
import { unixFormatter } from "components/formatters/DateFormatter";
import Flag from 'react-world-flags'

const CurrentWeatherLocationInfo = ({ icon, name, country, error, date }) => {

    return (
        <div className="location-info">
            <img 
            className='weather-icon' 
            src={`${process.env.NEXT_PUBLIC_OPENWEATHER_ICON_URL}${icon}@2x.png`} 
            alt="Weather icon" 
            onError={(e) => e.target.src = '/assets/icons/unknown.png'}
            />
            <div className='name-date'>
                <span className='name'>{name}, {country} <Flag fallback={ <Flag code="US" height="16" /> } code={country} height="16" /></span>
                <span className='date'>{error ? new Date().toLocaleDateString() : unixFormatter(date)}</span>
            </div>
        </div>
    );
}

export default CurrentWeatherLocationInfo;