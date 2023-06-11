import moment from 'moment'

// Supply with unix seconds

export default function DateFormatter ({timestamp, timeFromNow = true}){
	
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