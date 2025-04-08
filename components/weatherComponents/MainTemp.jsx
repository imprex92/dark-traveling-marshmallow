import React from 'react';
import { toImperial } from 'components/utility/UnitConverter';
import styles from 'styles/weatherComponents.module.css';

const MainTemp = ({ isMetric, fallback, currentWeather }) => {
  const { main = {}, error = null } = currentWeather.data;

  if (error) {
    return (
      <div className={styles.mainTemp}>
        <span className={styles.temp}>{fallback}</span>
        <span className={styles.unit}>{isMetric ? '°C' : '°F'}</span>
      </div>
    );
  }

  return (
    <div className={styles.mainTemp}>
      <span className={styles.temp}>
        {isMetric
          ? main?.temp?.toFixed(1)
          : toImperial(main?.temp?.toFixed(1), 'degrees')}
      </span>
      <span className={styles.unit}>{isMetric ? '°C' : '°F'}</span>
    </div>
  );
};

export default MainTemp;
