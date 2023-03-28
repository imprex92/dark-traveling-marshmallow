import Shimmer from "./Shimmer"
import SkeletonElement from "./SkeletonElement"


const SkeletonSinglePost = ({ theme }) => {
	const themeClass = theme || 'light'
	
  return (
	<div className={`skeleton-wrapper single-post ${themeClass}`}>
		<div className="skeleton-single-post">
			<div className="">
				<SkeletonElement type="image" />
				<SkeletonElement type="title" />
				<SkeletonElement type="text" />
				<SkeletonElement type="text" />
				<SkeletonElement type="text" />
				<Shimmer />
			</div>
		</div>
	</div>
  )
}

export default SkeletonSinglePost