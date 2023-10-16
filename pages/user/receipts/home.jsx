import React, { useEffect, useState, useRef } from 'react'
import withPrivateRoute from 'components/HOC/withPrivateRoute'
import SideNavLight from 'components/nav/SideNavLight'
import ProgressBar from 'components/ProgressBar'
import countries from 'components/utility/countries.json'
import { useAuth } from 'contexts/AuthContext'
import Deleteicon from 'public/assets/delete-forever.svg'
import Image from 'next/image'
import { fetchUserReceipts, handleSaveRecipt } from 'components/utility/subscriptions'
import { projectFirestore } from 'firebase/config'
import OutputGallery from 'components/gallery/OutputGallery'

const receiptHome = () => {
  const { logout, currentUser } = useAuth()
  const DbRef = projectFirestore.collection('testUserCollection').doc(currentUser?.uid).collection('userReceipts')
  const [userDefinedFile, setUserDefinedFile] = useState(null)
  const [userDefinedCameraFile, setUserDefinedCameraFile] = useState(null)
  const [hasError, setHasError] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [isUploading, setisUploading] = useState(null)
  const [datePicker, setDatePicker] = useState(new Date())
  const [formCountry, setFormCountry] = useState('')
  const [isSuccessful, setIsSuccessful] = useState(null)
  const postTitle = useRef(null)
  const postStore = useRef(null)
  const postCountry = useRef(null)
  const [userReceitps, setUserReceitps] = useState([])
  //* onUpload finish
	const [uploadedURL, setUploadedURL] = useState(null)
  const fileTypeImage = ['image/jpeg', 'image/png', 'image/raw', 'image/heif', 'image/webp', 'image/heic']

  useEffect(() => {
      let elems = document.querySelectorAll('.collapsible');
      let datepicker = document.querySelectorAll(".datepicker")
      let autocomplete = document.querySelectorAll('.autocomplete');
      let instances = M.Collapsible.init(elems, {});
      M.Datepicker.init(datepicker, {
				autoClose: true,
				format: 'mmmm d, yyyy',
				defaultDate: new Date(),
				setDefaultDate: true,
				firstDay: 1,
				maxDate: new Date(),
				onSelect: (date) => {setDatePicker(date)},			
			})
      M.Autocomplete.init(autocomplete, {
				data: countries,
				minLength: 1,
				onAutocomplete: (selected) => setFormCountry(selected)
			});

    return () => {
      imgPreview && URL.revokeObjectURL(imgPreview)
    }
  }, [])
  useEffect(() => {
    onImgSuccess()
  
    return () => {
      
    }
  }, [uploadedURL])
  useEffect(() => {

    const unsubscribeReceipts = DbRef.onSnapshot((querySnapshot) => {
      let data = [];
        querySnapshot.forEach(doc => data.push(({...doc.data(), id: doc.id})))
        setUserReceitps(data)
    }, (err) => { console.error('error with snapshot', err);})
  
    return () => {
      unsubscribeReceipts()
    }
  }, [])
  
  const handleimageUpload = (e, type) => {
    const selectedImage = e.target.files[0]
    console.log(e, type);
    type === 'ATTACH_FILE' && fileTypeImage.includes(selectedImage.type) 
    ? (setUserDefinedFile(selectedImage), setImgPreview(URL.createObjectURL(selectedImage))) 
    : type === 'CAMERA_FILE' && fileTypeImage.includes(selectedImage.type) 
    ? (setUserDefinedCameraFile(selectedImage), setImgPreview(URL.createObjectURL(selectedImage)))
    : setHasError("You either didn't add a picture or file is not an image.")
    console.log(URL.createObjectURL(selectedImage), selectedImage);
  }

  const onSubmit = (e) => {
    e.preventDefault()
    console.log('location', formCountry);
    setisUploading(true)
    //! MOVING THEN ON TO onImgSuccess()!
  }
  const onImgSuccess = () => {
    if(uploadedURL){
      const formData = {
        title: postTitle.current.value,
        pickedDateForPost: datePicker,
        imgURL: uploadedURL,
        locationData: {
          countryOfPurchase: postCountry.current.value,
          storeOfPurchase: postStore.current.value
        }
      }
      handleSaveRecipt({
        userID: currentUser.uid,
        dataToSave: formData
      })
      .then(res => {
        console.log('Success! ID: ', res);  
        setIsSuccessful('Success! Post saved!')
        document.getElementById('receipt-form').reset()
        setUserDefinedCameraFile(null)
        setUserDefinedFile(null)
        setImgPreview(null)
        setFormCountry(null)
        postTitle.current.value = null
      })
      .catch(err => {
        console.log('Something went wrong! ', err);
			  setHasError('Sorry! Something went wrong while uploading')
      })
    }
  }

  function handleClick({event, trigger, additional}){
    console.log(event, trigger, additional);
  }

  return (
	<div className='recipt-container'>
    <SideNavLight />
    <div className='recipt-wrapper container'>
      <ul className="collapsible">
        <li className={`collapsible-upload active ${userDefinedFile ? 'hasDefinedFile' : ''} ${userDefinedCameraFile ? 'hasDefinedCameraFile' : ''}`}>
          <div className="collapsible-header">
            <i className="material-icons">cloud_upload</i>
            Upload new Recipt
            <i className={`material-icons chevron`}>chevron_left</i>
          </div>
          <div className="collapsible-body">
            <div className="row">
              <div className="input-field col l6 s11">
                <i className="material-icons prefix white-text">title</i>
                <input placeholder=' ' ref={postTitle} id="title" type="text" className="validate" />
                <label htmlFor="title">Title</label>
              </div>
                <div className="input-field col s11 l6">
                  <i className="material-icons prefix white-text">public</i>
                  <input placeholder=' ' ref={postCountry} onChange={(e) => setFormCountry(e.target.value)} type="text" id="autocomplete-input" className="autocomplete"/>
                  <label htmlFor="autocomplete-input">Enter country</label>
                </div>
            </div>
            <div className="row">
              <form id='receipt-form' action="#" className="col s12">
                <div className="row">
                  <div className="input-field col m6 s11">
                    <i className="material-icons prefix white-text">store</i>
                    <input placeholder=' ' ref={postStore} id="store" type="text" className="validate" />
                    <label htmlFor="store">Store of Purchase</label>
                  </div>
                  <div className="input-field col m6 s11">
                    <i className="material-icons prefix white-text">calendar_month</i>
                    <input type="text" className="datepicker" />
                    <label htmlFor="datepicker">Date of Purchase</label>
                  </div>
                </div>
                <div className="row">
                  <div className="file-field input-field col s12 cameraFile">
                    <div className={`btn-small ${userDefinedFile && 'disabled'}`}>
                      <span>Camera</span>
                      <i className="material-icons left">photo_camera</i>
                      <input capture type="file" accept="image/*" onClick={() => console.log('click')} onChange={(e) => handleimageUpload(e, 'CAMERA_FILE')} />
                    </div>
                    <div className="file-path-wrapper">
                      <input  className="file-path validate" type="text" />
                      <div onClick={() => {setUserDefinedCameraFile(null), setImgPreview(null)}}><Deleteicon/></div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="file-field input-field col s12 localeFile">
                    <div className={`btn-small ${userDefinedCameraFile && 'disabled'}`}>
                      <span>File</span>
                      <i className="material-icons left">attach_file</i>
                      <input disabled={userDefinedCameraFile} type="file" accept="image/*" onChange={(e) => handleimageUpload(e, 'ATTACH_FILE')} />
                    </div>
                    <div className="file-path-wrapper">
                      <input className="file-path validate" type="text" />
                      <div onClick={() => {setUserDefinedFile(null), setImgPreview(null)}}><Deleteicon/></div>
                    </div>
                  </div>
                  <div className="col submit-btn">
                    <button className="btn-small waves-effect waves-light" type="submit" onClick={(e) => onSubmit(e)} name="action">Save
                      <i className="material-icons right">backup</i>
                    </button>
                  </div>
                </div>
                {imgPreview ? <Image src={imgPreview} style={{marginTop: '1rem'}} quality={50} width={150} height={150}/> : null}
                {isUploading ? <ProgressBar isUploading={setisUploading} fireError={setHasError} setUploadedURL={setUploadedURL} initiator='RECIPE_UPLOAD' reciptFile={userDefinedCameraFile || userDefinedFile} /> : null}
              </form>
            </div>
            {hasError ? <div className="white-text red darken-4 fileinput-error"><strong>{hasError}</strong></div> : null}
            {isSuccessful && <div className="white-text green fileinput-error"><strong>{isSuccessful}</strong></div>}
          </div>
        </li>
      </ul>
      <div className='collapsible-header gallery' style={{ cursor: 'default' }}>
        <i className="material-icons">perm_media</i>
        <div className='view-layout'>
          <i className="material-icons" style={{ cursor: 'pointer' }}>grid_view</i>
          <i className="material-icons" style={{ cursor: 'pointer' }}>view_list</i>
        </div>
      </div>
      <div className='gallery-content'>
      {userReceitps.map((elm, index) => {
        return (
          <div key={elm.id} className={`item-wrapper item-${index}`}>
            <OutputGallery data={{elm, index}} />
          </div>
        )
      })}
      </div>
    </div>
    <style jsx scoped>{`
      .recipt-container{
        display: grid;
        background: var(--primaryBackground);
        grid-template-columns: 50px 1fr;
	      grid-template-areas: "nav wrap";
      }
      .view-layout{
        margin-left: auto;
      }
      .view-layout i:last-child{
        margin-right: 0;
      }
      .collapsible-body{
        background-color: rgba(0, 0, 0, 0.2);
      }

      .collapsible-upload .collapsible-header{
        border-radius: 5px 5px 20px 20px;
        transition: border-radius 0.3s linear;
      }
      .collapsible-upload.active .collapsible-header,
      .collapsible-header.gallery{
        border-radius: 5px;
      }
      .collapsible-header.gallery{
        height: 55px;
      }

      .collapsible, .collapsible-body{
        border: none;
        border-radius: 0 0 20px 20px;
      }
      .collapsible-body div.row{
        margin-bottom: 0;
        gap: 1rem;
      }
      .recipt-wrapper {
        margin-top: 8rem;
        grid-area: wrap
      }
      .collapsible-upload .chevron{
        margin: 0 0 0 auto;
        transform: rotate(0deg);
        transition: transform 0.3s linear;
      }
      .collapsible-upload.active .chevron{
        transform: rotate(-90deg);
        transition: transform 0.3s linear;
      }
      .collapsible-upload .file-field.input-field.col.s12.cameraFile input,
      .collapsible-upload .file-field.input-field.col.s12.localeFile input{
        width: 140px;
      }
      .collapsible-upload.hasDefinedCameraFile .file-field.input-field.col.s12.cameraFile input,
      .collapsible-upload.hasDefinedFile .file-field.input-field.col.s12.localeFile input{
        width: 100%;
      }
      .file-field .btn-small{
        height: 32.4px;
        line-height: 32.4px;
        width: max-content;
        margin-top: 1rem;
      }
      .btn-small{
        width: max-content;
      }
      .collapsible-upload .file-path-wrapper{
        position: relative;
        display: none;
      }
      .file-path-wrapper div{
        position: absolute;
        top: 1rem;
        bottom: 0;
        right: 0;
        width: 25px;
        height: 25px;
        margin-top: 0.7rem;
        cursor: pointer;
      }
      .collapsible-upload.hasDefinedCameraFile .file-field.input-field.col.s12.cameraFile .file-path-wrapper{
        display: block;
      }
      .collapsible-upload.hasDefinedFile .file-field.input-field.col.s12.localeFile .file-path-wrapper{
        display: block;
      }
      .submit-btn{
        display: flex;
        width: 100%;
        justify-content: flex-end;
      }

      .gallery-content{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1rem;
        padding: 1.5rem;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 0 0 20px 20px;
        margin-bottom: 1.5rem;
      }

      @media (max-width: 768px){
        .gallery-content{
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
      }
      @media (max-width: 600px){
        .gallery-content{
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
        }
      }
      
    `}</style>
  </div>
  )
}

export default receiptHome
