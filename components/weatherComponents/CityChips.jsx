import React, { useEffect } from 'react';
import {
  addWeatherChip,
  fetchUserWeatherChips,
  removeWeatherChip,
} from 'components/utility/subscriptions';
import styles from 'styles/weatherComponents.module.css';
import useSiteSettings from 'store/siteSettings';

const CityChips = ({ currentUser, fetchWeather }) => {
  const { weatherChips } = useSiteSettings((state) => state.data);
  const updateWeatherChips = useSiteSettings((state) => state.setWeatherChips);

  useEffect(() => {
    currentUser && fetchTags();
  }, [currentUser]);

  async function fetchTags() {
    await fetchUserWeatherChips(currentUser.uid)
      .then((data) => {
        {
          initializeChips(data[0].tags), updateWeatherChips(data[0].tags);
        }
      })
      .catch((err) => {
        console.error('Error while loading tags', err);
        M.toast({ text: `Error loading tags, ${err}` });
      });
  }

  function initializeChips(chipsData) {
    let chips = document.querySelectorAll('#chips');
    M.Chips.init(chips, {
      data: chipsData,
      placeholder: 'Enter city to save shortcuts',
      limit: 12,
      secondaryPlaceholder: '+City',
      onChipSelect: (data, i) =>
        fetchWeather(i.firstChild.textContent.toString()),
      onChipAdd: async (data, i) => {
        const chipText = i.firstChild.textContent.trim();
        if (chipText === '') {
          M.toast({ text: 'Please enter a city name' });
          i.remove();
        } else {
          try {
            const response = await addWeatherChip({
              userID: currentUser.uid,
              payload: chipText,
              currentChips: weatherChips,
            });
            if (response.error) {
              M.toast({ text: response.error });
              i.remove();
            } else {
              M.toast({ text: 'City saved.' });
              updateWeatherChips([...weatherChips, response.data]);
            }
          } catch (error) {
            console.error('Error adding chip:', error);
            M.toast({ text: 'Something went worng saving city.' });
            i.remove();
          }
        }
      },
      onChipDelete: async (data, i) => {
        try {
          const selectedTag = i.firstChild.textContent.toString();
          const response = await removeWeatherChip({
            userID: currentUser.uid,
            payload: weatherChips.find((chip) => chip.text === selectedTag),
            currentChips: weatherChips,
          });
          if (response.error) {
            M.toast({ text: response.error });
          } else {
            M.toast({ text: 'City removed.' });
          }
        } catch (error) {
          console.error('Error removing city:', error);
          M.toast({ text: 'Something went wrong removing city.' });
        }
      },
    });
  }

  return (
    <div className={`${styles.chipsContainer} z-depth-4`}>
      <div id="chips" className={`${styles.chips} chips-placeholder`} />
    </div>
  );
};

export default CityChips;
