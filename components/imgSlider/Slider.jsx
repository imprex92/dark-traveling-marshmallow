import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import BtnSlider from './utils/BtnSlider';
import TextContent from './TextContent';

const Slider = ({ formData }) => {
	const { files } = formData;
	const [slideIndex, setSlideIndex] = useState(1);
	let numSlides = files.length || 0

	const nextSlide  = () => {
		if(slideIndex !== numSlides){
			setSlideIndex(slideIndex + 1)
		} 
		else if (slideIndex === numSlides){
			setSlideIndex(1)
		}
	}
	const prevSlide  = () => {
		if (slideIndex !== 1){
			setSlideIndex(slideIndex - 1)
		} else if (slideIndex === 1){
			setSlideIndex(numSlides)
		}
	}

  if (numSlides === 0) return <div>No images to display</div>;

  return (
	<>
		<div className={'container-slider'}>
			<div id="slider-content" className="slider-container">
				<div className="slider-content" style={{ '--num-slides': numSlides }}>
					<BtnSlider moveSlide={prevSlide} direction={'prev'} />

					{files.map((file, index) => (
						<div key={index} className={`slide position-${index + 1} ${slideIndex === index + 1 ? 'slide active-anim' : 'slide'}`}>
							<div className="media">
								{file.type.startsWith('image/') ? (
								<img height={300} className="imgThumbnail" src={URL.createObjectURL(file)} alt={`Slide image ${index + 1}`}/>
								) : file.type.startsWith('video/') ? (
								<video controls muted height={300}>
									<source src={URL.createObjectURL(file)} type={`${file.type === 'video/quicktime' ? 'video/mp4' : file.type}`} />
									No support
								</video>
								) : null}
							</div>
							<div className="card-sections">
								<div className="upper-section">
									<div><i></i></div>
									<div><i></i></div>
								</div>
								<div className="lower-section">
									<div className="card-caption"></div>
									<div className="card-button"></div>
								</div>
							</div>
						</div>
					))}

					<BtnSlider moveSlide={nextSlide}  direction={'next'} />
					<div className="container-dots">
						{Array.from({length: numSlides}, (_, i) => (
							<label 
								className={slideIndex === i + 1 ? 'dot active' : 'dot'} 
								key={`dot${i + 1}`} 
								htmlFor={`dot${i + 1}`} 
								onClick={()=> setSlideIndex(i + 1)} 
							>
							</label>
						))}
					</div>
				</div>
				<div className='text-content'>
					<TextContent formData={formData} />
				</div>
			</div>
		</div>
		<style scoped>{`
			.container-slider, .slider-container{
				height: 100%;
				position: relative;
			}
			.slider-container{
				display: grid;
				grid-template-rows: 300px auto;
				grid-template-areas: 'media'
							'text';
				position: relative;
			}
			.slider-content{
				height: inherit;
				grid-area: media;
				position: relative;
				width: 370px;
				place-self: center;
			}
			.slide{
				width: 100%;
				height: 100%;
				position: absolute;
				opacity: 0;
				transition: opacity ease-in-out 0.4s;
			}
			.media{
				display: flex;
				justify-content: center;
			}
			.imgThumbnail{
				aspect-ratio: 1 / 1;
				object-fit: contain;
			}
			.active-anim{
				opacity: 1;
			}

			.container-dots{
				position: absolute;
				display: flex;
				width: 100%;
				bottom: 5px;
				justify-content: center;
				gap: 0.35rem;
				z-index: 9;
				& > .dot{
					width: 15px;
					height: 15px;
					border-radius: 50%;
					background-color: var(--primaryBtnColor);
					cursor: pointer;
					&.active, &:hover{
						background-color: var(--primaryBtnColorHover);
						border: 3px solid var(--primaryBtnColor);
					}
				}
			}

			.text-content{
				grid-area: text;
				color: #fff;
				margin: 2rem auto;
				max-width: 600px;
				width: 100%;
			}
		`}</style>
	</>
  );
};

Slider.propTypes = {
  files: PropTypes.array.isRequired,
};

export default Slider;
