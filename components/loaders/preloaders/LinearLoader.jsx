import React from 'react'
import PropTypes from 'prop-types'

const LinearLoader = props => {
	const {
		loaderType = 'indeterminate',
		loaderContainerWidth = '100%',
		loaderContainerMargins = '.5rem 0 1rem 0',
		progressIndicatorWidth = '0%',
		indicatorColor = '#26a69a'
	} = props
  return ( 
	<>
		{
			loaderType === 'indeterminate' ?
				<div className='progress'>
					<div className="indeterminate"></div>
				</div> : 
			loaderType === 'determinate' ?
				<div className='progress'>
					<div className="determinate"></div>
				</div> : 
			<span className='typeError'>LoaderType error!</span>
		}
		<style jsx={true} scoped={true}>{`
			.progress{
				display: inline-block;
				width: ${loaderContainerWidth};
				margin: ${loaderContainerMargins};
			}
			.indeterminate, .determinate{
				color: ${indicatorColor}	
			}

			.determinate{
				width: ${progressIndicatorWidth};
			}

			.typeError{
				color: red;
			}
		`}</style>
	</>
  )
}

LinearLoader.propTypes = {
	loaderType: PropTypes.oneOf(['indeterminate','determinate']), //Determinate or indeterminated progress bar
	loaderContainerWidth: PropTypes.string,
	loaderContainerMargins: PropTypes.string,
	progressIndicatorWidth: PropTypes.string,
	indicatorColor: PropTypes.string,
}

/* <LinearLoader loaderType='indeterminate' loaderContainerWidth='100px' loaderContainerMargins='auto auto auto 2rem' /> */

export default LinearLoader