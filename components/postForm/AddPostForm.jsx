import React, {useState, useEffect, useRef, lazy, Suspense} from 'react'
import styles from 'styles/newPost.module.css'
import countriesByContinent from '../utility/countries_new'
import PlacesAutocomplete from '../utility/GooglePlacesAutocomplete'
import CircularLoader from 'components/loaders/preloaders/CircularLoader'
import { handleSaveNewPost } from 'components/utility/subscriptions'
import { createSlug, getAddressComponents, getComponentValue, getGeoPointAndWeather } from 'components/utility/preparePostObject'
import useSiteSettings from 'store/siteSettings';
import { projectTimestampNow } from 'firebase/config'
import { useRouter } from 'next/router';

const FileInput = lazy(() => import('../inputs/fileInput/FileInput'));
const PostSummary = lazy(() => import('./PostSummary'));

const AddPostForm = ({ dbUserData }) => {
  const router = useRouter()
  const { latestWeather } = useSiteSettings(state => state.data) ?? { latestWeather: {} } 
  const [activeTab, setActiveTab] = useState('content')
  const [countries, setCountries] = useState(countriesByContinent)
  const [countryCode, setCountryCode] = useState(null)
  const [countryName, setCountryName] = useState(null)
  const [mood, setMood] = useState(null)
  const [weather, setWeather] = useState(null)
  const [postContent, setPostContent] = useState('')
  const [files, setFiles] = useState(null)
	const [datePicker, setDatePicker] = useState(new Date())
	const [postLocation, setPostLocation] = useState([])
  const [postTitle, setPostTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formRef = useRef(null)
  const placesInputValue = useRef('')
  const selectRef = useRef(null)
  const childRef = useRef(null);
  let postLocationData;
  let postWeatherData;

  const inputs = {countryCode, mood, weather, postContent}

  const isButtonDisabled = !useInputValidation(inputs);

  const formData = {
    user_uid: dbUserData.uid,
    createdByUser: dbUserData.displayName,
    postTitle: postTitle || null,
    postContent: postContent|| null,
    postMood: mood || null,
    postWeather: weather,
    postWeatherData: postWeatherData,
    postLocationData: postLocationData,
    countryCode,
    timestamp: projectTimestampNow,
    pickedDateForPost: datePicker,
    slug: '',
    mediaURLs: [],
  };

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
    setCountryName(selectedValue.name)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if(Object.keys(postLocation).length > 0){
      const addressComponents = getAddressComponents(postLocation.locationData);
      const { weatherData, geoPoint } = await getGeoPointAndWeather(postLocation.coordinates)

      postLocationData = {
        country: countryName || getComponentValue(addressComponents, 'country') || null,
        state: getComponentValue(addressComponents, 'administrative_area_level_1') || postLocation.locationData[0].vicinity,
        city: getComponentValue(addressComponents, 'postal_town') || getComponentValue(addressComponents, 'locality') || postLocation.locationData[0].name,
        geopoint: geoPoint || postLocation.coordinates || 'Coordinates not found',
        plusCode: postLocation.locationData[0]?.plus_code || null,
        offlineAddress: null,
        wasApiOffline: false
    };

    postWeatherData = {
        weatherUser: weather || null,
        weatherAPI: weatherData.data || latestWeather || null,
        wasApiOffline: false
    };
    }
    else{
      postLocationData = {
        country: countryName,
        state: null,
        city: null,
        geopoint: 'Coordinates not found',
        plusCode:  null,
        offlineAddress: placesInputValue.current,
        wasApiOffline: true
      };

      postWeatherData = {
        weatherUser: weather || null,
        weatherAPI: latestWeather || null,
        wasApiOffline: true
      }
    }

    const slug = createSlug(postTitle)
    formData.slug = slug;
    formData.postWeatherData = postWeatherData;
    formData.postLocationData = postLocationData;

    handleSaveNewPost({userID: dbUserData.uid, dataToSave: formData, media: files})
    .then((message) => {
      setIsSubmitting(false);
      M.toast({text: message, completeCallback: function(){
        window.history.replaceState(null, '', '/user/posts')
        router.replace('/user/posts');
      }})
    })
    .catch((err) => {
      console.log(err.message);
      setIsSubmitting(false);
      M.toast({text: `${err.message}. Try posing it again later.`});
    })
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
            <span className={`material-symbols-outlined ${styles.label}`}>line_start_circle</span>
            <span className={styles.tabDescription}>Content</span>
          </div>
          <div 
            onClick={(e) => {
              if(!isButtonDisabled){
                handleTabClick('images', e)
              }
            }}  
            className={`${activeTab === 'images' ? styles.tab_active : styles.tab} ${isButtonDisabled ? styles.tab_disabled : ''}`}>
            <span className={`material-symbols-outlined ${styles.label}`}>attach_file_add</span>
            <span className={styles.tabDescription}>Images</span>
          </div>
          <div 
            onClick={(e) => {
              if(!isButtonDisabled && files){
                handleTabClick('submit', e)}} 
              }
            className={`${activeTab === 'submit' ? styles.tab_active : styles.tab} ${!files || isButtonDisabled ? styles.tab_disabled : ''}`}>
            <span className={`material-symbols-outlined ${styles.label}`}>task_alt</span>
            <span className={styles.tabDescription}>Submit</span>
          </div>
        </div>

        <form ref={formRef} id='postForm' onSubmit={handleFormSubmit} className={`${styles.postForm}`}>
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
                  <textarea onChange={(e) => setPostContent(e.target.value)} id="postContent" className={`materialize-textarea ${styles.postTextarea}`} placeholder=" "></textarea>
                  <label htmlFor="postContent">Write something for your  post...</label>
                </div>
              </div>
              <div className={`${styles.buttons}`}>
                <button type='button' className={`${styles.resetForm} btn waves-effect waves-light`} onClick={clearForm}>Clear</button>
                <button type='button' disabled={isButtonDisabled} className={`${styles.moveOnBtn} btn waves-effect waves-light`} onClick={(e) => handleTabClick('images', e)}>Add images</button>
              </div>
            </div>
            <div id='imgSectionTab' className={`${styles.tabContent} ${activeTab === 'images' ? `${styles.tabPanel_active} ${styles.imageTab_active}` : styles.tabPanel}`}>
              <h5 className={styles.contentDescription}>Add one or more pictures.</h5>
              <Suspense fallback={<CircularLoader loaderSize='big' loaderColor='default' />}>
                <FileInput returnFiles={(f) => {setFiles(f), handleTabClick('submit')}} />
              </Suspense>
            </div>
            <div className={`${styles.tabContent} ${activeTab === 'submit' ? `${styles.tabPanel_active} ${styles.submitTab_active}` : styles.tabPanel}`}>
              <h5 className={styles.contentDescription}>submit if all OK</h5>
              <Suspense fallback={<CircularLoader loaderSize='big' loaderColor='default' />}>
                <PostSummary formData={{ ...formData, placesInputValue: placesInputValue.current, files, postLocation }} />
              </Suspense>
              <div className={styles.buttons}>
                <button 
                  disabled={isButtonDisabled || !files || isSubmitting}
                  form='postForm'
                  className={`${styles.submitBtn} btn waves-effect waves-light`} 
                  type="submit">
                    Submit
                </button>
                    { isSubmitting ? <CircularLoader loaderSize='small' loaderColor='spinner-red-only' wrapperMargins='0 1rem 0.5rem 0' /> : null}
              </div>
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
