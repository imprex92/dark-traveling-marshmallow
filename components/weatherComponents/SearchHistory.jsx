import { clearWeatherSearchHistory, deleteOneHistoryItem } from 'components/utility/subscriptions';
import React, { useEffect, useState } from 'react'
import useSiteSettings from 'store/siteSettings';
import styles from 'styles/weatherComponents.module.css'

const SearchHistory = ({ fetchWeather, currentUser }) => {
  const { weatherSearchHistory = [] } = useSiteSettings(state => state.data)
  const updateSearchHistory = useSiteSettings(state => state.setWeatherSearchHistory)
  const [displayHistory, setDisplayHistory] = useState(weatherSearchHistory);

  useEffect(() => {
    const unsubscribe = useSiteSettings.subscribe(
      (state) => state.data.weatherSearchHistory,
      (newHistory) => {
        setDisplayHistory(newHistory);
        console.log('Weather search history updated:', newHistory);
      }
    );

    return () => unsubscribe();
  }, []);

  const clearHistory = async () => await clearWeatherSearchHistory({ userID: currentUser.uid });

  const getWeatherForClickedCity = (city) => {
    fetchWeather(city)
  }

  const removeHistoryItem = async (city) => {
    deleteOneHistoryItem({ userID: currentUser.uid, payload: city });
  }

  return (
    <>
      <div className={`${styles.historyContainer} z-depth-4`}>
        {displayHistory.length === 0 ? (
          <>
            <p className={styles.noHistory}>No search history yet.</p>
          </>) : (
          <>
            <span onClick={clearHistory} className={`${styles.clearHistory} material-symbols-outlined`}>
              delete_history
            </span>
            <div className={displayHistory.length < 6 ? styles.historyItems : styles.historyItems_multi}>
              {displayHistory.map((city, index) => (
                <div key={index} onClick={() => getWeatherForClickedCity(city)} className={styles.item}>
                  <span className={styles.text}>{city}</span>
                  <span onClick={() => removeHistoryItem(city)} className={`${styles.removeItem} material-symbols-outlined`}>
                    close
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default SearchHistory

//! Add remove one hisory item
