import Shimmer from "./Shimmer"
import SkeletonElement from "./SkeletonElement"

const SkeletonImage = ({ theme }) => {
	const themeClass = theme || 'light'
	
  return (
	<div className={`skeleton-wrapper ${themeClass}`}>
		<div className="skeleton-image">
			<div>
				<SkeletonElement type="image" />
			</div>
		</div>
		<Shimmer />
	</div>
  )
}

export default SkeletonImage