import SkeletonElement from "./SkeletonElement"
import Shimmer from "./Shimmer"

const SkeletonWeaterWidget = ({ theme }) => {
	const themeClass = theme || 'light'
	
  return (
	<div className={`skeleton-wrapper weatherWidget ${themeClass}`}>
		<div className="skeleton-weatherWidget">
			<div>
				<SkeletonElement type="weaterWidgetImg" />
				<Shimmer />
			</div>
		</div>
	</div>
  )
}

export default SkeletonWeaterWidget