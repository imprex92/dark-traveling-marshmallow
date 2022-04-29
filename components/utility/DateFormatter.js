import moment from 'moment'

export default function DateFormatter ({timestamp}){
	return(
		<span>
			{
				moment.unix(timestamp).format('MMMM Do YYYY')
			}, around  
			{
				' ' + moment.unix(timestamp).fromNow()
			}
		</span>
	)
}