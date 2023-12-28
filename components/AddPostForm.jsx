import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import styles from 'styles/newPost.module.css'
import countriesByContinent from './utility/countries_new'

const AddPostForm = props => {
  const [activeTab, setActiveTab] = useState('start')
  const [countries, setCountries] = useState(countriesByContinent)

  useEffect(() => {
    const selectEl = document.getElementById('countrySelect')
    M.FormSelect.init(selectEl)
  }, [])
  
  const handleTabClick = (tab, e) => {
    e.preventDefault()
    setActiveTab(tab)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <>
    <div className={`${styles.stepTabs}`}>
      <div className={styles.navList}>
        <div onClick={(e) => {handleTabClick('start', e)}} className={`${activeTab === 'start' ? styles.tab_active : styles.tab}`}>
          <span className={`material-symbols-outlined ${styles.label}`}>line_start_circle</span>Start
        </div>
        <div onClick={(e) => {handleTabClick('images', e)}}  className={`${activeTab === 'images' ? styles.tab_active : styles.tab}`}>
          <span className={`material-symbols-outlined ${styles.label}`}>attach_file_add</span>Image
        </div>
        <div onClick={(e) => {handleTabClick('content', e)}} className={`${activeTab === 'content' ? styles.tab_active : styles.tab}`}>
          <span className={`material-symbols-outlined ${styles.label}`}>edit_document</span>Content
        </div>
        <div onClick={(e) => {handleTabClick('submit', e)}} className={`${activeTab === 'submit' ? styles.tab_active : styles.tab}`}>
          <span className={`material-symbols-outlined ${styles.label}`}>task_alt</span>Submit
        </div>
      </div>

      <form className={`${styles.postForm}`}>
        <div className={`${styles.tabContent}`}>
          <div className={`${activeTab === 'start' ? styles.tabPanel_active : styles.tabPanel}`}>
            <h2 className="">Start of post</h2>
            <div className="input-field">
              <i className="material-icons prefix white-text">public</i>
              <select id="countrySelect">
                {Object.entries(countries).map(([continent, countriesList]) => (
                  <optgroup key={continent} label={continent}>
                    {countriesList.map((country) => (
                      <option value={country} key={country}>{country}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <label htmlFor="countrySelect">Select Country</label>
            </div>
          </div>
          <div className={`${activeTab === 'images' ? styles.tabPanel_active : styles.tabPanel}`}>
            <h2>Add pictures here</h2>
          </div>
          <div className={`${activeTab === 'content' ? styles.tabPanel_active : styles.tabPanel}`}>
            <h2>Add content here</h2>
          </div>
          <div className={`${activeTab === 'submit' ? styles.tabPanel_active : styles.tabPanel}`}>
            <h2>submit if all OK</h2>
          </div>
        </div>
      </form>
    </div>
    </>
  )
}

AddPostForm.propTypes = {}

export default AddPostForm