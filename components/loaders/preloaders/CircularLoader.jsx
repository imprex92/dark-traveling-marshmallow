import React from 'react'
import PropTypes from 'prop-types'

const CircularLoader = props => {
	const { loaderColor, loaderSize, wrapperMargins = 0 } = props
  return (
	<div className={`preloader-wrapper active ${loaderSize}`}>
		<div className={`spinner-layer ${loaderColor}`}>
			<div className="circle-clipper left">
				<div className="circle"></div>
			</div>
			<div className="gap-patch">
				<div className="circle"></div>
			</div>
			<div className="circle-clipper right">
				<div className="circle"></div>
			</div>
		</div>
		<style jsx={true} scoped={true}>{`
			.preloader-wrapper{
				position: absolute;
				display: inline-block;
				margin: ${wrapperMargins};
			}
			.preloader-wrapper.small{
				width: 26px;
				height: 26px;
			}
		`}</style>
  	</div>
  )
}

CircularLoader.propTypes = {
	loaderColor: PropTypes.oneOf([
		'spinner-red-only',
	 	'spinner-blue-only', 
		'spinner-yellow-only', 
		'spinner-green-only', 
		'default'
	]),
	loaderSize: PropTypes.oneOf([
		'small', 
		'medium', 
		'big'
	]),
	wrapperMargins: PropTypes.string,
}

export default CircularLoader