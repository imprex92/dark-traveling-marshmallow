import React, { useEffect, useState } from 'react';
import useSiteSettings from 'store/siteSettings';
import styles from 'styles/weatherComponents.module.css';

const SaveWeatherLocation = ({ currentWeather }) => {
  const { weatherChips } = useSiteSettings((state) => state.data);
  const cityName = currentWeather?.data?.name || null;
  const [isWeatherChipsInitialized, setIsWeatherChipsInitialized] =
    useState(false);

  const addBookmark = () => {
    M.Chips.getInstance(document.getElementById('chips')).addChip({
      id: 1337,
      text: cityName,
      image: null,
    });
  };

  const removeBookmark = () => {
    const index = weatherChips.findIndex(
      (chip) =>
        chip.text.toLowerCase() === currentWeather?.data?.name.toLowerCase()
    );
    if (index === -1) {
      M.toast({ text: 'Error removing bookmark.' });
      return;
    }
    M.Chips.getInstance(document.getElementById('chips')).deleteChip(index);
  };

  useEffect(() => {
    if (weatherChips instanceof Array) {
      setIsWeatherChipsInitialized(true);
    }
  }, [weatherChips]);

  if (!isWeatherChipsInitialized) {
    return (
      <span className={`${styles.rotateIcon} material-symbols-outlined`}>
        progress_activity
      </span>
    );
  }
  return weatherChips?.some(
    (chip) => chip.text === currentWeather?.data?.name
  ) ? (
    <span
      onClick={() => removeBookmark()}
      className={`${styles.bookmarkIcon} ${styles.saved} material-symbols-outlined`}
    >
      bookmark_added
    </span>
  ) : (
    <span
      onClick={() => addBookmark()}
      className={`${styles.bookmarkIcon} material-symbols-outlined`}
    >
      bookmark_add
    </span>
  );
};

export default SaveWeatherLocation;
