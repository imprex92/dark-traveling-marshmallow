import SkeletonElement from "./SkeletonElement"
import Shimmer from "./Shimmer"

const SkeletonWeatherWidget = ({ theme }) => {
	const themeClass = theme || 'light'
	
  return (
	<div className={`skeleton-wrapper weatherWidget ${themeClass}`}>
		<div className="skeleton-weatherWidget">
			<div>
				<SkeletonElement type="weatherWidgetImg" />
				<Shimmer />
			</div>
		</div>
	</div>
  )
}

export default SkeletonWeatherWidget