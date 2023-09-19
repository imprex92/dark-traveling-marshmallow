import Shimmer from "./Shimmer"
import SkeletonElement from "./SkeletonElement"


const SkeletonWeather = ({ theme, position = null }) => {
	const themeClass = theme || 'light'
	const isMobile = window.innerWidth <= 640;

	const MainSkeleton = () => {
		return (
			<>
				<SkeletonElement type={'title'} desktopCSS={{ marginTop: '2rem'}} globalCSS={{width: '65%'}}  />
				<SkeletonElement type={'text'} desktopCSS={{ margin: '4.5rem auto 1rem auto' }} globalCSS={{width: '50%', height: '20px', margin: '1.5rem auto 1rem auto'}}  />
				<SkeletonElement type={'text'} globalCSS={{width: '40%', margin: '2rem auto'}} />
				<SkeletonElement type={'thumbnail'} globalCSS={{ margin: '2.5rem auto 2.5rem auto' }} mobileCSS={{ width: '150px' }} desktopCSS={{ width: '225px', height: '150px' }} />
				{ !isMobile ? 
				<>
					<span style={{ display: 'flex', justifyContent: 'center', columnGap: '1.5rem' }}>
						<SkeletonElement type="title" desktopCSS={{ width: '25%' }} mobileCSS={{ display: 'none' }} />
						<SkeletonElement type="title" desktopCSS={{ width: '25%' }} mobileCSS={{ display: 'none' }} />
					</span>
					<span style={{ display: 'flex', justifyContent: 'center', columnGap: '1.5rem' }}>
						<SkeletonElement type="title" desktopCSS={{ width: '25%' }} mobileCSS={{ display: 'none' }} />
						<SkeletonElement type="title" desktopCSS={{ width: '25%' }} mobileCSS={{ display: 'none' }} />
					</span>
					<span style={{ display: 'flex', justifyContent: 'center', columnGap: '1.5rem' }}>
						<SkeletonElement type="title" desktopCSS={{ width: '25%' }} mobileCSS={{ display: 'none' }} />
						<SkeletonElement type="title" desktopCSS={{ width: '25%' }} mobileCSS={{ display: 'none' }} />
					</span>
				</>
				: null }
			</>
		)
	}
	const TagsSkeleton = () => {
		return(
			<>
				<SkeletonElement type="tag" />
				<SkeletonElement type="tag" />
				<SkeletonElement type="tag" />
			</>
		)
	}
	const AdditionalInfoSkeleton = () => {
		return(
			<>
				<div className="skeletonGroupWrapper">
					<SkeletonElement type="smallBox" />
					<SkeletonElement type="smallBox" />
					<SkeletonElement type="smallBox" />
					<SkeletonElement type="smallBox" />
					<SkeletonElement type="smallBox" />
					<SkeletonElement type="smallBox" />
				</div>
			</>
		)
	}
	const HistorySkeleton = () => {
		return(
			<>
				<SkeletonElement globalCSS={{}} type="title" />
				<SkeletonElement globalCSS={{}} type="text" />
				<SkeletonElement globalCSS={{}} type="text" />
			</>
		)
	}
	
  return (
	<div className={`skeleton-wrapper weather-skeleton ${themeClass}`}>
		<div style={{height: '100%'}} className={`skeleton-weather ${position}`}>
			<div className={`box3 ${position}`}>
				{ position === 'main' 
				? <MainSkeleton /> 
				: position === 'tags' 
				? <TagsSkeleton /> 
				: position === 'additionalInfo' 
				? <AdditionalInfoSkeleton />
				: position === 'history'
				? <HistorySkeleton />
				: null }
				<Shimmer />
			</div>
		</div>
	</div>
  )
}

export default SkeletonWeather