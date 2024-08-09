import React, { useEffect } from "react";
import styles from 'styles/weatherComponents.module.css'

const UnitSelectorDropdown = ({ isMetric, setIsMetric }) => {
    useEffect(() => {
        const triggerEl = document.querySelectorAll('#dropdown-trigger');
        M.Dropdown.init(triggerEl, {
          constrainWidth: false,
          hover: true,
          closeOnClick: false,
        });
      }, []);

    return (
        <>
            <div id="dropdown-trigger" className={styles.lightSettings} href='#' data-target='weather-settings-dropdown'>
              <span className="material-icons">settings</span>
            </div>
            <ul id='weather-settings-dropdown' className={`${styles.customDropdownContent} dropdown-content`} style={{overflow: 'hidden', width: 'max-content', height: 'fit-content'}}>
              <li>
                <a href="#!">
                  <div className="switch">
                    <label className='black-text'>
                      Imperial
                      <input defaultChecked={isMetric} type="checkbox" onClick={(e) => setIsMetric(e.target.checked)} />
                      <span className="lever"></span>
                      Metric
                    </label>
                  </div>
                </a>
              </li>
            </ul>
        </>
    );
}

export default UnitSelectorDropdown;