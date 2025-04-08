import React from 'react';
import styles from 'styles/weatherComponents.module.css';

import UnitSelectorDropdown from './UnitSelectorDropdown';
import SaveWeatherLocation from './SaveWeatherLocation';

const Toolbox = ({ isMetric, setIsMetric, currentWeather }) => {
  return (
    <div className={styles.toolBox}>
      <UnitSelectorDropdown isMetric={isMetric} setIsMetric={setIsMetric} />
      <SaveWeatherLocation currentWeather={currentWeather} />
    </div>
  );
};

export default Toolbox;
