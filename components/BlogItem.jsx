import React from 'react'
import Link from 'next/link'
// import DateFormatter from '../components/utility/DateFormatter'

const BlogItem = ({blog}) => {

	function textSlicer(text, num){
		if(text.length <= num){
			return text
		}
		else
		return text.slice(0, num) + "..."
	}	

	return (
		<>
			<Link as={`/user/posts/singlepost/${blog.slug}`} href={`/user/posts/singlepost?slug=${blog.slug}`}>
				<div  className="blogItem-wrapper post-wrapper">
					<div className="post-text-content">
						<h3 className="postTitle center-align">
							{blog.postTitle}
						</h3>
						<p className="postContent">
							{textSlicer(blog.postContent, 125)}
						</p>
						<Link href="#">
							<a>@{blog.createdByUser}</a> 
						</Link> <br/>
						{/* <DateFormatter timestamp={blog.timestamp}/> */}
					</div>
				</div>
			</Link>
		</>
	)
}
export default BlogItem