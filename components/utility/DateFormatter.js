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

export function ISODateFormatter({timestamp, timeFromNow = false}){
	let isoTimestamp;
	
	if (typeof timestamp === 'object' && timestamp instanceof Date) {
		// Convert Date object to ISO 8601 string
		isoTimestamp = timestamp.toISOString();
	} else if (typeof timestamp === 'string') {
		isoTimestamp = timestamp; // It's already in ISO 8601 format
	} else {
		console.error('ISODateFormatter error: Invalid timestamp');
		return <span>No date</span>;
	}

	const formattedDate = moment(isoTimestamp).format('MMMM Do YYYY');

	return (
		<span>
		{timeFromNow
			? `${formattedDate}, around ${moment(isoTimestamp).fromNow()}`
			: formattedDate}
		</span>
	);
}

ISODateFormatter.propTypes = {
	timeFromNow: PropTypes.bool,
	timestamp: PropTypes.oneOfType([
	  	PropTypes.instanceOf(Date),
	  	PropTypes.string,
	]).isRequired,
};