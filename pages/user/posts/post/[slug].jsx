import React, {useEffect, useState, useRef} from 'react'
import { useRouter, withRouter } from 'next/router'
import { useAuth } from 'contexts/AuthContext'
import { fetchDocumentByFieldName } from 'components/utility/subscriptions'
import SideNavLight from 'components/nav/SideNavLight'
import DateFormatter from 'components/utility/DateFormatter'
import SkeletonSinglePost from 'components/loaders/skeletons/SkeletonSinglePost'
import usePostStorage from 'store/postStorage'
import withPrivateRoute from 'components/HOC/withPrivateRoute'
import SkeletonImage from 'components/loaders/skeletons/SkeletonImage'
import styles from 'styles/post.module.css'

const Post = (props) => {
  const { isSlug = true } = props;
  const router = useRouter();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());
  const [hasError, setHasError] = useState(false);
  const requestedBlog = usePostStorage((state) => state.data);
  const setPreviouslyViewedPost = usePostStorage((state) => state.setPreviouslyViewedPost);

  const loadImage = (imgSrc) => {
    const image = new Image();
    image.src = imgSrc;

    image.onload = () => {
      setIsImageLoaded(true);
    };

    image.onerror = (err) => {
      console.error('Failed to load image:', err);
      setHasError({
        error: true,
        message: 'ERROR: Post not found',
        code: err,
      });
    };
  };

  useEffect(() => {
    const logedInUserId = currentUser.uid;
    const slug = router.query.slug;

    // Check if the blog post is already available in the Zustand store
	loadImage(`${requestedBlog.imgURL}`);
    if (requestedBlog && requestedBlog.slug === slug) {
		setIsLoading(false)
      return;
    }

    fetchDocumentByFieldName({
      fieldName: 'slug',
      value: slug,
      userID: logedInUserId,
    })
      .then((blog) => {
        setPreviouslyViewedPost(blog);
		setIsLoading(false)
      })
      .catch((err) => {
        console.error(err);
        setHasError({ error: true, message: 'ERROR: Post not found', code: err });
      });

  }, [currentUser, router.query.slug, requestedBlog, imageKey]);
	

  	if(isLoading){
		return (
			<div className='skeleton-container full-center loadingskeleton'>
				<SkeletonSinglePost />
			</div>
		)
	}

	if(hasError){
		return (<div className={`${styles.singlepostWrapper} hasError`}><SideNavLight/>{hasError && hasError.message}</div>)
	}

	if(requestedBlog === null){
		return (<div className={`${styles.singlepostWrapper} loading`}><SideNavLight/>Loading...</div>)
	}
	else if(requestedBlog.empty === true)
	return (<div className={`${styles.singlepostWrapper} not-found`}><SideNavLight/>Not found!</div>)
	else
	return (
		<>
			<div className={`${styles.singlePostMain} is-found`}>
				<SideNavLight/>
				<div className={`${styles.singlepostWrapper}`}>
					<div className={`row ${styles.imgRow}`}>
						<div className={`col s12 ${styles.mainImageWrapper}`}>
							{isImageLoaded ? (<img
							src={requestedBlog?.imgURL || "https://firebasestorage.googleapis.com/v0/b/dark-traveling-marshmallow.appspot.com/o/userData%2FFP5M7soIZIbxLOFOCOEtkjtiUm53%2Fsea-164989.jpg?alt=media&token=255516f7-193c-432e-9a16-3cfa1c838f09"}
							alt="Main image"
							/>
							) : (
								<SkeletonImage />
							)}
						</div>
					</div>
					<div className="row">
						<div className="col s10 offset-s1">
							<h3>
								<strong>{requestedBlog?.postTitle}</strong>
							</h3>
							<h4 className={`${styles.locationDiv}`}>
								-- {requestedBlog?.postLocationData?.city + ', ' + requestedBlog?.postLocationData?.country}
							</h4>							
						</div>
						<div className="row">
							<div className="col s10 offset-s1">
								<p className="center-align">
									{requestedBlog.postContent}
								</p>
							</div>
						</div>
						<div className="divider col s10 offset-s1"></div>
						<div className="row">
							<div className={`col m5 s12 offset-m1 ${styles.smallWrapperLeft}`}>
								{/*<p><small> // ToDo weather
									{requestedBlog.postWeather ?? 'none'} <br/>
									{requestedBlog.postMood ?? 'none'}	
								</small></p>*/}
							</div>
							<div className={`col m6 s12 offset-m1 ${styles.smallWrapperRight}`}>
								<p><small>
									Posted by <a href="#">{requestedBlog.createdByUser}</a> <br/>
									<span className="gray-text"><DateFormatter timestamp={requestedBlog?.timestamp?.seconds}/></span>
								</small></p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Post