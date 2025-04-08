import React from 'react';
import { mToKm, toImperial } from 'components/utility/UnitConverter';
import styles from 'styles/weatherComponents.module.css';

const AdditionalWeatherInfoDesktop = ({
  currentWeather,
  isMetric,
  fallback,
}) => {
  const { error = null, main = {}, visibility, wind } = currentWeather.data;

  const formatTemperature = (temp) => {
    if (error) {
      return `${fallback} ${isMetric ? '°C' : '°F'}`;
    }
    const temValue = temp?.toFixed(1);
    return isMetric
      ? `${temValue} °C`
      : `${toImperial(temValue, 'degrees')} °F`;
  };

  const formatVisibility = (visibility) => {
    if (error) {
      return `${fallback} ${isMetric ? 'Km' : 'mi'}`;
    }
    return isMetric
      ? `${mToKm(visibility)} Km`
      : `${toImperial(visibility, 'length')} mi`;
  };

  const formatWind = (wind) => {
    if (error) {
      return `${fallback} ${isMetric ? 'm/s' : 'mph'}`;
    }
    return isMetric ? `${wind} m/s` : `${toImperial(wind, 'speed')} mph`;
  };

  return (
    <div className={`${styles.additionalInfo} ${styles.desktopOnly}`}>
      <div className={styles.infoContainerTop}>
        <div>
          <img src="/assets/icons/thermometer-down.png" alt="Min Temp" />
          <span>Min Temp</span>
          <span>{formatTemperature(main?.temp_min)}</span>
        </div>
        <div className={styles.verticalLine} />
        <div>
          <img src="/assets/icons/thermometer-up.png" alt="Max Temp" />
          <span>Max Temp</span>
          <span>{formatTemperature(main?.temp_max)}</span>
        </div>
      </div>
      <div className={styles.infoContainerMiddle}>
        <div>
          <img src="/assets/icons/visible--v2.png" alt="Visibility" />
          <span>Visibility</span>
          <span>{formatVisibility(visibility)}</span>
        </div>
        <div className={styles.verticalLine} />
        <div>
          <img src="/assets/icons/temperature--v2.png" alt="Feels like" />
          <span>Feels like</span>
          <span>{formatTemperature(main?.feels_like)}</span>
        </div>
      </div>
      <div className={styles.infoContainerBottom}>
        <div>
          <img src="/assets/icons/humidity.png" alt="Humidity" />
          <span>Humidity</span>
          <span>{main?.humidity ?? fallback} %</span>
        </div>
        <div className={styles.verticalLine} />
        <div>
          <img src="/assets/icons/wind--v1.png" alt="Wind" />
          <span>Wind</span>
          <span>{formatWind(wind?.speed)}</span>
        </div>
      </div>
    </div>
  );
};

export default AdditionalWeatherInfoDesktop;
