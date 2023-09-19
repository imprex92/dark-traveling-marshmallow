import moment from 'moment'
import PropTypes from 'prop-types'

// Supply with unix seconds

export default function DateFormatter ({timestamp, timeFromNow = false}){
	
	typeof(timestamp) !== 'number' && console.error('Dateformater error. Timestamp NaN');

	if(typeof(timestamp) !== 'number') return(<span>No date</span>)
	
	return(
		<>
			{ timeFromNow ? 
				<span>
					{
						moment.unix(timestamp).format('MMMM Do YYYY')
					}, around  
					{
						' ' + moment.unix(timestamp).fromNow()
					}
				</span> : 
				<span>
					{
						moment.unix(timestamp).format('MMMM Do YYYY')
					}
				</span>
			}
		</>
	)
}

DateFormatter.propTypes={
	timeFromNow: PropTypes.bool,
	timestamp: PropTypes.number.isRequired
}
