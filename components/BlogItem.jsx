import React from 'react'
import Link from 'next/link'
import DateFormatter from '../components/utility/DateFormatter'
import styles from 'styles/blogPostsFeed.module.css'

const BlogItem = ({blog}) => {

	function textSlicer(text, num){
		if(text.length <= num){
			return text
		}
		else
		return text.slice(0, num) + "..."
	}	

	return <>
        <Link
            as={`/user/posts/post/${blog.slug}`}
            href={`/user/posts/post?slug=${blog.slug}`}
            legacyBehavior>
            <div  className={styles.postItemWrapper}>
                <div className={styles.postTextContent}>
                    <h4 className="postTitle center-align">
                        {blog.postTitle ?? 'No title'}
                    </h4>
                    <div className={styles.postInfo}>
                        <p className={styles.postContent}>
                            {blog.postContent ? textSlicer(blog.postContent, 50) : 'No text'}
                        </p>
                        { blog.createdByUser && 
                            <>
                                <Link href="#" className={styles.userLink}>
                                    @{blog.createdByUser}
                                </Link>
                                <br/>
                            </> 
                        }
                        <DateFormatter timeFromNow={false} timestamp={blog.timestamp?.seconds}/>
                    </div>
                </div>
            </div>
        </Link>
    </>;
}

export default BlogItem