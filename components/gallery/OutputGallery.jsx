import React, {useState} from 'react'
import Image from "next/image"
import DateFormatter from 'components/utility/DateFormatter'
import Gallerypopup from 'components/popups/Gallerypopup'

const OutputGallery = ({data}) => {
  const {id, title, imgURL, pickedDateForPost, locationData} = data?.elm
  const [popupToOpen, setPopupToOpen] = useState(null)

  const toggleDropdown = ({event, trigger}) => {
    event.stopPropagation();
    if(trigger === 'dropdown'){
      const i = event.target.classList[1]
      const el = document.getElementsByClassName(`hidden-section-${i}`)
      const el2 = document.getElementsByClassName(`dropdown-${i}`) 
      el[0].classList.toggle('showing')
      el2[0].classList.toggle('active')
    }
  }
  

  const popupTrigger = ({event, trigger, additional}) =>{
    event.stopPropagation();
    document.getElementsByTagName('html')[0].style.overflow = 'hidden'
    if(trigger === 'popup'){
      setPopupToOpen(additional.index)
    }
  }
  function reset(e){
   setPopupToOpen(null)
   document.getElementsByTagName('html')[0].style.overflow = null
  }
 // TODO popup not finished
 // TODO Fix <Image /> tag
  return (
    <div className={`item-container`} onClick={(e) => {popupTrigger({
      event: e, 
      trigger:'popup',
      additional: {id: id, index: data.index}
      })}}>
      { popupToOpen !== null  ? <div onClick={(e) => {e.stopPropagation(),reset(e)}} className={`overlay ${popupToOpen ? 'open' : ''}`}>
        <Gallerypopup key={data.index}  data={data} resetPopup={() => reset()} popupToOpen={popupToOpen}/>
      </div> : null}
      <div className='item-image'>
        {/*<Image 
          src={imgURL} 
          quality={50} 
          layout="responsive"
          width={402}
          height={402}
          objectFit='cover'
        />*/}
        <img src={imgURL} width={402} height={402} style={{objectFit: 'cover'}} />
      </div>
      <div className='item-text'>
        <span className='title'>{title}</span>
        <span className="date">
          Date: 
          { pickedDateForPost?.seconds ? 
          <DateFormatter 
          timeFromNow={false} 
          timestamp={pickedDateForPost.seconds} /> : null }
        </span>
        <div className={`${data?.index} dropdown-${data?.index}`} onClick={(e) => toggleDropdown({event: e, trigger: 'dropdown'})}>
          Show more
          <i className={`${data?.index} material-icons chevron`}>chevron_left</i>
        </div>
        <div className={`hidden-section-${data?.index}`}>
          <span className="country">Country: {locationData?.countryOfPurchase}</span>
          <span className="store">Store: {locationData?.storeOfPurchase}</span>
        </div>
      </div>
      <style jsx scoped>{`
        .dropdown-${data?.index}{
          display: flex;
          cursor: pointer;
        }
        .dropdown-${data?.index} .chevron{
          margin: 0 0 0 auto;
          transform: rotate(0deg);
          transition: transform 0.3s linear;
        }
        .dropdown-${data?.index}.active .chevron{
          transform: rotate(-90deg);
          transition: transform 0.3s linear;
        }
        .item-text{
          display: flex;
          flex-direction: column;
          margin: 1rem;
          color: white;
        }
        .item-image img{
          object-fit: cover;
        }
        .overlay{
          display: grid;
          place-content: center;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 20px;
          z-index: 3;
          backdrop-filter: blur(35px);
			  }

        @media (max-width: 640px){
          .overlay{
            width: 100%;
            height: 100%;
            position: fixed;
			    }
        }
      `}</style>
      <style>{`
        .item-image img{
          border-radius: 20px;
        }
      `}</style>
    </div>
  )
}

export default OutputGallery