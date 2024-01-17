import React, {useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import styles from 'styles/newPost.module.css'
import countriesByContinent from './utility/countries_new'
import PlacesAutocomplete from './utility/GooglePlacesAutocomplete'

const AddPostForm = props => {
  const [activeTab, setActiveTab] = useState('start')
  const [countries, setCountries] = useState(countriesByContinent)
  const [countryCode, setCountryCode] = useState(null)
  const placesInputValue = useRef('')
  const postCountry = useRef(null)
  const selectRef = useRef(null)

	const [datePicker, setDatePicker] = useState(new Date())
	const [postLocation, setPostLocation] = useState([])

  useEffect(() => {
    const selectEl = document.getElementById('countrySelect')
    const dateEl = document.getElementById('datepicker')
    M.FormSelect.init(selectEl, {classes: styles.selectField})
    selectRef.current = M.FormSelect.getInstance(selectEl);
    M.Datepicker.init(dateEl, {
      autoClose: true,
      format: 'mmmm d, yyyy',
      defaultDate: new Date(),
      setDefaultDate: true,
      firstDay: 1,
      maxDate: new Date(),
      onSelect: (date) => {setDatePicker(date)},
    })
  }, [])

  const handleTabClick = (tab, e) => {
    e.preventDefault()
    setActiveTab(tab)
  }
  const handleCountryChange = () => {
    const selectedValue = JSON.parse(selectRef.current.el.value);
    setCountryCode(selectedValue.code)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
  }
  function dataFromChild({ coordinates, locationData, additionalData }){
		setPostLocation({ coordinates, locationData, additionalData })
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

      <form onSubmit={handleFormSubmit} className={`${styles.postForm}`}>
        <div className={`${styles.tabContent}`}>
          <div className={`${activeTab === 'start' ? styles.tabPanel_active : styles.tabPanel}`}>
            <h2 className="">Start of post</h2>
            <div className={styles.fieldGroup}>
              <div className={`input-field ${styles.selectRow}`}>
                <i className="material-icons white-text">public</i>
                <select defaultValue="" id="countrySelect" onChange={handleCountryChange} ref={selectRef}>
                  <option value="" disabled></option>
                  {Object.entries(countries).map(([continent, countriesList]) => (
                    <optgroup key={continent} label={continent}>
                      {countriesList.map((country) => (
                        <option value={JSON.stringify(country)} key={country.code}>{country.code} : &nbsp;&nbsp;{country.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <label htmlFor="countrySelect">Select Country</label>
              </div>
              <fieldset className={styles.fieldset} style={{ border: 'none' }} disabled={!countryCode}>
                <PlacesAutocomplete inputValue={e => placesInputValue.current = e} countryCode={countryCode} dataFromChild={dataFromChild}/>
              </fieldset>
            </div>
            <div className={styles.fieldGroup}>
              <div className="input-field col s11 l6 datepicker-section">
                <i className="material-icons prefix white-text">event</i>
                <input id="datepicker" type="text" className="datepicker"/>
                <label htmlFor="datepicker">Select date</label>
              </div>
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