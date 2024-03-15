import React from 'react'
import PropTypes from 'prop-types'

const BtnSlider = ({ direction, moveSlide}) => {

  return (
	<>
		<span className={`material-symbols-outlined btn-slide ${direction}`} onClick={moveSlide}>
			{ direction === 'next' ? 'chevron_right' : 'chevron_left'}
		</span>
		<style>{`
			.btn-slide {
				position: absolute;
				top: 50%;
				border: none;
				font-size: 3em;
				height: 1em;
				width: 1em;
				cursor: pointer;
				z-index: 2;
				background-color: #fafafa;
				border-radius: 999px;
				color: var(--primaryBtnTextColor);
				background-color: var(--primaryBtnColor);
				border-color: #144677;
				&:hover{
					color: var(--primaryBtnTextColorHover);
					cursor: pointer;
					background-color: var(--primaryBtnColorHover);
				}
			}
			.prev { left: 0rem; }
			.next { right: 0rem; }
		`}</style>
	</>
  )
}

BtnSlider.propTypes = {}

export default BtnSlider