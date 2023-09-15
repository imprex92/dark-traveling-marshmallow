import React from "react";
import PropTypes from 'prop-types'

const SkeletonElement = ({ type, globalCSS, desktopCSS, mobileCSS }) => {
	const isMobile = window.innerWidth <= 640;
	
	const classes = `skeleton ${type}`;
	
	const globalStyle = globalCSS || {}
	const mobileStyle = isMobile ? mobileCSS || {} : {}
	const desktopStyle = isMobile ? {} : desktopCSS || {}
	
	const style = {
		...globalStyle,
		...mobileStyle,
		...desktopStyle
	}

	
	return (
		<div style={style} className={classes}></div>
	)
}

SkeletonElement.propTypes = {
  type: PropTypes.string.isRequired,
  globalCSS: PropTypes.object,
  mobileCSS: PropTypes.object,
  desktopCSS: PropTypes.object,
};

export default SkeletonElement

// use globalCSS || desktopCSS || mobileCSS
// ex write globalCSS={{ backgroundColor: "lightgray", width: "100px", height: "20px" }}