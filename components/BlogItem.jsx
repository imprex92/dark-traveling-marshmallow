import React from 'react'
import Link from 'next/link'
import DateFormatter from '../components/utility/DateFormatter'

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
			<Link as={`/user/posts/post/${blog.slug}`} href={`/user/posts/post?slug=${blog.slug}`}>
				<div  className="blogItem-wrapper post-wrapper">
					<div className="post-text-content">
						<h4 className="postTitle center-align">
							{blog.postTitle ?? 'No title'}
						</h4>
						//! link to user
						<div className='post-info'>
							<p className="postContent">
								{blog.postContent ? textSlicer(blog.postContent, 70) : 'No text'}
							</p>
							{ blog.createdByUser && <><Link href="#">
								<a>@{blog.createdByUser}</a> 
							</Link><br/></> }
							<DateFormatter timestamp={blog.timestamp?.seconds}/>
						</div>
					</div>
				</div>
			</Link>
		</>
	)
}

export default BlogItem