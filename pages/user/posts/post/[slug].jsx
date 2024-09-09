import React, { useEffect, useState, useRef } from 'react'
import { useRouter, withRouter } from 'next/router'
import { useAuth } from 'contexts/AuthContext'
import { fetchDocumentByFieldName } from 'components/utility/subscriptions'
import SideNavLight from 'components/nav/SideNavLight'
import DateFormatter from 'components/formatters/DateFormatter'
import SkeletonSinglePost from 'components/loaders/skeletons/SkeletonSinglePost'
import usePostStorage from 'store/postStorage'
import withPrivateRoute from 'components/HOC/withPrivateRoute'
import SkeletonImage from 'components/loaders/skeletons/SkeletonImage'
import styles from 'styles/post.module.css'
import Image from 'next/image'

const Post = (props) => {
	const router = useRouter();
	const { currentUser } = useAuth();
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const requestedBlog = usePostStorage((state) => state.data);
	const setPreviouslyViewedPost = usePostStorage((state) => state.setPreviouslyViewedPost);

	useEffect(() => {
		if (!currentUser) {
			return;
		}
		const logedInUserId = currentUser.uid;
		const slug = router.query.slug;
	
		if (requestedBlog && requestedBlog.slug === slug) {
			setIsLoading(false);
			return;
		}

		fetchDocumentByFieldName({
			fieldName: 'slug',
			value: slug,
			userID: logedInUserId,
		})
		.then((blog) => setPreviouslyViewedPost(blog))
		.catch((err) => {
			console.error(err);
			setHasError({ error: true, message: 'ERROR: Post not found', code: err });
		})
		.finally(() => setIsLoading(false));

	}, [currentUser, router.query.slug, isLoading]);

	if (isLoading) {
		return (
			<div className={styles.singlePostMain}>
				<div className='skeleton-container full-center loadingskeleton'>
					<SkeletonSinglePost />
				</div>
			</div>
		)
	}

	if (hasError) {
		return (
			<div className={styles.singlePostMain}>
				<div className={`${styles.singlepostWrapper_error} hasError`}>
					<div className={`${styles.navigation}`}>
						<SideNavLight />
					</div>
					<div className={styles.errorBox}>
						{hasError && hasError.message ? hasError.message : 'ERROR: Something went wrong'}
					</div>
				</div>
			</div>
		)
	}

	if (requestedBlog === null) {
		return (
			<div className={styles.singlePostMain}>
				<div className={`${styles.singlepostWrapper_loading} loading`}>
					<div className={`${styles.navigation}`}>
						<SideNavLight />
					</div>
					<div className={styles.errorBox}>
						Loading...
					</div>
				</div>
			</div>
		)
	}
	else if (requestedBlog.empty === true) {
		return (
			<div className={styles.singlePostMain}>
				<div className={`${styles.singlepostWrapper_notFound} not-found`}>
					<div className={`${styles.navigation}`}>
						<SideNavLight />
					</div>
					<div className={styles.errorBox}>
						Not found!
					</div>
				</div>
			</div>
		)
	}
	else
		return (
			<>
				<div className={`${styles.singlePostMain} is-found`}>
					<div className={`${styles.navigation}`}>
						<SideNavLight />
					</div>
					<div className={`${styles.singlepostWrapper}`}>
						<div className={`${styles.imgRow}`}>
							<div className={`${styles.mainImageWrapper}`} >
								<Image src={requestedBlog?.imgURL || requestedBlog?.mediaURLs[0]} width={500} height={400} alt='Post image' />
							</div>
						</div>
						<div className={styles.postContent}>
							<div className={styles.titleBox}>
								<h3>
									<strong>{requestedBlog?.postTitle}</strong>
								</h3>
								<h4 className={`${styles.locationDiv}`}>
									-- {requestedBlog?.postLocationData?.city + ', ' + requestedBlog?.postLocationData?.country}
								</h4>
							</div>
							<div className={styles.mainContent}>
								<p className={styles.text}>
									{requestedBlog.postContent}
								</p>
							</div>
							<div className={`${styles.divider} divider col s10 offset-s1`}></div>
							<div className={styles.lowerSection}>
								<div className={styles.innerSection}>
									<div className={`${styles.smallWrapperLeft}`}>
										<p className={styles.moodWeather}>
											{requestedBlog?.postWeather && <small>
												Weather that day - {' '}
												<span>
													{requestedBlog?.postWeather?.weatherUser}
												</span>
											</small>}
											<br />
											{requestedBlog?.postMood && <small>
												Wood that day - {' '}
												<span>
													{requestedBlog?.postMood}
												</span>
											</small>
											}
										</p>
									</div>
									<div className={styles.postedBy}>
										<p className={styles.postedByText}>
											<small>
												Posted by - <a href="#"> {' '} {requestedBlog.createdByUser}</a> <br />
												<span className="gray-text"><DateFormatter timestamp={requestedBlog?.timestamp?.seconds} /></span>
											</small>
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		)
}

export default withPrivateRoute(Post)