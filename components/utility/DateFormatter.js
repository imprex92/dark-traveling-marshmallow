import moment from 'moment'

// Supply with unix seconds

export default function DateFormatter ({timestamp, timeFromNow = true}){
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