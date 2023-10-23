import React, {useEffect, useState} from 'react'
import Image from "next/image"

const Gallerypopup = ({data, popupToOpen, resetPopup}) => {
	let d = popupToOpen
	const {id, title, imgURL, pickedDateForPost, locationData} = data?.elm
	const i = data?.index;
	const [popup, setPopup] = useState(popupToOpen)
	console.log('data', data);
	useEffect(() => {
	  console.log('changed', popupToOpen, popup);
		setPopup(popupToOpen)
	  return () => {
	  }
	}, [popupToOpen])
	
	
	
	const reset = (e) => {
		console.log(e);
		setPopup(null)
		resetPopup(e)
	}
 // TODO popup not finished
 // TODO Fix <Image /> tag
  return (
	<>
		<div className={`popup popup-${i} ${popup === i ? 'active' : ''}`}>
			<div className="close-btn material-icons" onClick={e => {e.stopPropagation(), reset(e)}}>close</div>
			<div className='item-image'>
				{ /*<Image 
				src={imgURL} 
				quality={90} 
				layout="responsive"
				width="50%"
				height="50%"
				objectFit='cover'
				/> */}
				<img src={imgURL} width={402} height={402} style={{objectFit: 'cover'}} />
			</div> 
			<h2>Cool Popup</h2>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt quibusdam omnis repellendus, 
				atque similique magnam alias recusandae veniam, quisquam magni,
				itaque quaerat dolor? Veniam animi exercitationem at quasi molestiae! Doloremque.
			</p>
		</div>
		<style jsx scoped>{`
			.close-btn{
				position: absolute;
				top: 0.5rem;
				right: 0.5rem;
				cursor: pointer;
			}
			.popup {
				position:fixed;
				top:-150%;
				left:50%;
				transform:translate(-50%,-50%) scale(1.2);
				opacity: 0;
				background:rgba(255,255,255,0.2);
				border:1px solid rgba(255,255,255,0.15);
				box-shadow:inset 0px 0px 20px 5px rgba(255,255,255,0.05);
				backdrop-filter:blur(8px);
				-webkit-backdrop-filter:blur(8px);
				width:100%;
				max-width: 1000px;
				padding: 40px 30px;
				border-radius:10px;
				z-index:1000;
				transition:top 0ms ease-in-out 300ms,
						opacity 300ms ease-in-out 0ms,
						transform 300ms ease-in-out 0ms;
			}
			.item-image img{
				border-radius: var(--defaultBorderRadius);
			}
			.popup.popup-${popupToOpen}.active {
				max-width: 560px;
          		max-height: 800px;
				position: relative;
				top:50%;
				width: calc(100% - 105px);
				transform:translate(-50%,-50%) scale(1);
				opacity:1;
				transition:top 0ms ease-in-out 0ms,
						opacity 300ms ease-in-out 0ms,
						transform 300ms ease-in-out 0ms;
			}
		`}</style>
	</>
  )
}

export default Gallerypopup