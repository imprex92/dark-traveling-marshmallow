import { useEffect, useState } from 'react'
import { withRouter } from 'next/router'
import withPrivateRoute from 'components/HOC/withPrivateRoute'
import { fetchDocumentByFieldName } from 'components/utility/subscriptions'
import SideNavLight from 'components/nav/SideNavLight'
import DateFormatter from 'components/utility/DateFormatter'
import SkeletonSinglePost from 'components/loaders/skeletons/SkeletonSinglePost'
import usePostStorage from 'store/postStorage'

const singlepost = ({router, userAuth}) => {
	const [requestedBlog, setRequestedBlog] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [hasError, setHasError] = useState(false)
	const currentPost = usePostStorage(state => state.data)
	const updateCurrent = usePostStorage(state => state.setPreviouslyViewedPost)

	useEffect(() => {
		const logedInUserId = userAuth.uid
		fetchDocumentByFieldName({
			fieldName: 'slug',
			value: router.query.slug,
			userID: logedInUserId
		})
		.then(blog => {
			setRequestedBlog(blog)
			updateCurrent(blog)
			setIsLoading(false)
		}).catch(err => {console.error(err), setHasError({error: true, message: 'ERROR: Post not found', code: err})})
	}, [ ])

	if(isLoading){
		return (<div className='skeleton-container full-center loadingskeleton'>
					<SkeletonSinglePost />
				</div>)
	}

	if(hasError){
		return (<div className="singlepost-wrapper hasError"><SideNavLight/>{hasError && hasError.message}</div>)
	}

	if(requestedBlog === null){
		return (<div className="singlepost-wrapper loading"><SideNavLight/>Loading...</div>)
	}
	else if(requestedBlog.empty === true)
	return (<div className="singlepost-wrapper not-found"><SideNavLight/>Not found!</div>)
	else
	return (
		<>
			<div className="singlePost-main is-found">
				<SideNavLight/>
				<div className="singlepost-wrapper">
					<div className="row img-row">
						<div className="col s12 main-image-wrapper">
							<img
							src={requestedBlog.imgURL || "https://firebasestorage.googleapis.com/v0/b/dark-traveling-marshmallow.appspot.com/o/userData%2FFP5M7soIZIbxLOFOCOEtkjtiUm53%2Fsea-164989.jpg?alt=media&token=255516f7-193c-432e-9a16-3cfa1c838f09"}
							alt="Main image"
							/>
						</div>
					</div>
					<div className="row">
						<div className="col s10 push-s1">
							<h3>
								<strong>{requestedBlog.postTitle}</strong>
							</h3>
							<h4>
								-- {requestedBlog.postLocationData.city + ', ' + requestedBlog.postLocationData.country}
							</h4>							
						</div>
						<div className="row">
							<div className="col s10 push-s1">
								<p className="center-align">
									{requestedBlog.postContent}
								</p>
							</div>
						</div>
						<div className="divider col s10 push-s1"></div>
						<div className="row">
							<div className="col m5 s12 push-m1 small-wrapper-left">
								{/*<p><small> // ToDo weather
									{requestedBlog.postWeather ?? 'none'} <br/>
									{requestedBlog.postMood ?? 'none'}	
								</small></p>*/}
							</div>
							<div className="col m6 s12 small-wrapper-right">
								<p><small>
									Posted by <a href="#">{requestedBlog.createdByUser}</a> <br/>
									<span className="gray-text"><DateFormatter timestamp={requestedBlog.timestamp.seconds}/></span>
								</small></p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default withPrivateRoute(withRouter(singlepost))
