import Shimmer from "./Shimmer"
import SkeletonElement from "./SkeletonElement"


const SkeletonWeather = ({ theme }) => {
	const themeClass = theme || 'light'
	
  return (
	<div className={`skeleton-wrapper weather ${themeClass}`}>
		<div className="skeleton-weather">
			<div className="box3">
				<SkeletonElement type="largeBox" />
				<Shimmer />
			</div>
		</div>
		
	</div>
  )
}

export default SkeletonWeather