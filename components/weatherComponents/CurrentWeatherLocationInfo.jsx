import React, { useEffect, useState } from "react";
import { unixFormatter } from "components/formatters/DateFormatter";
import Flag from 'react-world-flags'
import styles from 'styles/weatherComponents.module.css'
import Tooltip from "components/utility/tooltip/Tooltip";

const CurrentWeatherLocationInfo = ({ currentWeather, fallback }) => {
  const { error = null, weather = [], sys = {}, dt, name } = currentWeather.data
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [currentWeather]);

  return (
    <div className={styles.locationInfo}>
      {imgError ? (
        <Tooltip position="left" text="City not found. Please try again.">
          <span className={`material-symbols-outlined ${styles.errorIcon} ${styles.weatherIcon}`}>
            warning
          </span>
        </Tooltip>
      ) : (
        <img
          key={weather[0]?.icon}
          className={styles.weatherIcon}
          src={`${process.env.NEXT_PUBLIC_OPENWEATHER_ICON_URL}${weather[0]?.icon}@2x.png`}
          alt="Weather icon"
          onError={() => setImgError(true)}
        />
      )}
      <div className={styles.nameDate}>
        <span className={styles.name}>
          {error ? fallback : name}, {error ? fallback : sys?.country}
          <Flag
            fallback={
              <Flag code="US" height="16" />
            }
            code={sys?.country}
            height="16"
          />
        </span>
        <span className={styles.date}>{error ? new Date().toLocaleDateString() : unixFormatter(dt)}</span>
      </div>
    </div>
  );
}

export default CurrentWeatherLocationInfo;
