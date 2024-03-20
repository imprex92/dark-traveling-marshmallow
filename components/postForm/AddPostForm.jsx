import React, {useState, useEffect, useRef, lazy, Suspense} from 'react'
import PropTypes from 'prop-types'
import styles from 'styles/newPost.module.css'
import countriesByContinent from '../utility/countries_new'
import PlacesAutocomplete from '../utility/GooglePlacesAutocomplete'
import CircularLoader from 'components/loaders/preloaders/CircularLoader'

const FileInput = lazy(() => import('../inputs/fileInput/FileInput'));
const PostSummary = lazy(() => import('./PostSummary'));

const AddPostForm = props => {
  const [activeTab, setActiveTab] = useState('content')
  const [countries, setCountries] = useState(countriesByContinent)
  const [countryCode, setCountryCode] = useState(null)
  const [mood, setMood] = useState(null)
  const [weather, setWeather] = useState(null)
  const [postContent, setPostContent] = useState('')
  const [files, setFiles] = useState(null)
	const [datePicker, setDatePicker] = useState(new Date())
	const [postLocation, setPostLocation] = useState([])
  const [postTitle, setPostTitle] = useState('')

  const formRef = useRef(null)
  const placesInputValue = useRef('')
  const selectRef = useRef(null)
  const childRef = useRef(null);
  //const formData = useRef({})

  const inputs = {countryCode, mood, weather, postContent}

  const isButtonDisabled = !useInputValidation(inputs);

  const formData = {
    mood, weather, postLocation, datePicker, countryCode, files, postContent, postTitle
  }

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
    e && e.preventDefault()
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
  const clearForm = () => {
    formRef.current.reset();
    document.getElementById('post_location').value = ' ';
    setMood(null)
    setWeather(null)
    setPostContent('')
    setDatePicker(new Date())
    setPostLocation([])
    setCountryCode(null)
  }


  return (
    <>
      <div className={`${styles.stepTabs}`}>
        <div className={styles.navList}>
          <div onClick={(e) => {handleTabClick('content', e)}} className={`${activeTab === 'content' ? styles.tab_active : styles.tab}`}>
            <span className={`material-symbols-outlined ${styles.label}`}>line_start_circle</span>Content
          </div>
          <div onClick={(e) => {handleTabClick('images', e)}}  className={`${activeTab === 'images' ? styles.tab_active : styles.tab}`}>
            <span className={`material-symbols-outlined ${styles.label}`}>attach_file_add</span>Images
          </div>
          <div onClick={(e) => {handleTabClick('submit', e)}} className={`${activeTab === 'submit' ? styles.tab_active : styles.tab}`}>
            <span className={`material-symbols-outlined ${styles.label}`}>task_alt</span>Submit
          </div>
        </div>

        <form ref={formRef} onSubmit={handleFormSubmit} className={`${styles.postForm}`}>
          <div className={`${styles.tabWrapper}`}>
            <div className={`${styles.tabContent} ${activeTab === 'content' ? styles.tabPanel_active : styles.tabPanel}`}>
              <h5 className={styles.contentDescription}>Start of post</h5>
              <div className={styles.fieldGroup}>
                <div className={`input-field ${styles.selectRow}`}>
                  <i className="material-icons white-text">public</i>
                  <select defaultValue="" id="countrySelect" onChange={handleCountryChange} ref={selectRef}>
                    <option value="" disabled>Select country</option>
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
                  <PlacesAutocomplete childRef={childRef} isDisabled={!countryCode ? true : false} inputValue={e => placesInputValue.current = e} countryCode={countryCode} dataFromChild={dataFromChild}/>
                </fieldset>
              </div>
              <div className={styles.fieldGroup}>
                <div className="input-field col s11 l6 datepicker-section">
                  <i className="material-icons prefix white-text">event</i>
                  <input id="datepicker" type="text" className={`datepicker ${styles.dateInput}`}/>
                  <label htmlFor="datepicker">Select journey date</label>
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <div className="input-field col s11 l6">
                  <i className="material-icons prefix white-text">mood</i>
                  <input onChange={(e) => setMood(e.target.value)} type="text" id="postMood" className="validate" placeholder=' ' />
                  <label htmlFor="postMood">How do you feel right now?</label>
                </div>
                <div className="input-field col s11 l6">
                  <i className="material-icons prefix white-text">nights_stay</i>
                  <input onChange={(e) => setWeather(e.target.value)} type="text" id="postWeather" className="validate" placeholder=' ' />
                  <label htmlFor="postWeather">How's the weather today?</label>
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <div className="input-field col s6">
                  <i className="material-icons prefix white-text">title</i>
                  <input id="postTitle" type="text" className={`validate ${styles.titleInput}`} placeholder=" " onChange={e => setPostTitle(e.target.value)} />
                  <label htmlFor="postTitle">Title</label>
                </div>
              </div>
              <div className={styles.fieldRow}>
                <div className="input-field col s12">
                  <i className="material-icons prefix white-text">mode_edit</i>
                  <textarea onChange={(e) => setPostContent(e.target.value)} id="postContent" className="materialize-textarea" placeholder=" "></textarea>
                  <label htmlFor="postContent">Write something for your  post...</label>
                </div>
              </div>
              <div className={`${styles.buttons}`}>
                <button className={`${styles.resetForm} btn waves-effect waves-light`} onClick={clearForm}>Clear</button>
                <button disabled={isButtonDisabled} className={`${styles.moveOnBtn} btn waves-effect waves-light`} onClick={() => handleTabClick('images')}>Add images</button>
              </div>
            </div>
            <div id='imgSectionTab' className={`${styles.tabContent} ${activeTab === 'images' ? `${styles.tabPanel_active} ${styles.imageTab_active}` : styles.tabPanel}`}>
              <h5 className={styles.contentDescription}>Add one or more pictures to make your post look better.</h5>
              <Suspense fallback={<CircularLoader size='big' color="#fff" />}>
                <FileInput returnFiles={(f) => {setFiles(f), handleTabClick('submit')}} />
              </Suspense>
            </div>
            <div className={`${styles.tabContent} ${activeTab === 'submit' ? `${styles.tabPanel_active} ${styles.submitTab_active}` : styles.tabPanel}`}>
              <h5 className={styles.contentDescription}>submit if all OK</h5>
              <Suspense fallback={<CircularLoader size='big' color="#fff" />}>
                <PostSummary formData={{ ...formData, placesInputValue: placesInputValue.current }} />
              </Suspense>
            </div>
          </div>
        </form>
      </div>
      <style>{`
          #imgSectionTab.hasPreview{
            grid-template-rows: 55px 1fr auto;
          }
        `}</style>
    </>
  )
}

const useInputValidation = (inputs) => {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const allInputsFilled = Object.values(inputs).every(input => input !== null && input.trim() !== '')
    setIsValid(allInputsFilled)
  }, [inputs])
  
  return isValid
}

AddPostForm.propTypes = {}

export default AddPostForm