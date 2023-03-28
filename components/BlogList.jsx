import {useEffect, useState} from 'react'
import BlogItem from './BlogItem'

const BlogList = ({searchByText, countrySearchTerm, userBlogs}) => {
	const [filterByCountry, setFilterByCountry] = useState('')
	const [fetchedUserBlogs, setFetchedUserBlogs] = useState([])
	useEffect(() => {
		setFetchedUserBlogs(userBlogs)
		setFilterByCountry(countrySearchTerm)
		return () => {
			
		}
	}, [searchByText, countrySearchTerm, userBlogs])

	let filteredBlogs = fetchedUserBlogs?.filter((post) => {
		if(!filterByCountry.trim(' '))
		return post
		else
		return post.postLocationData.country.toLowerCase().includes(filterByCountry.toLowerCase())
	})

	return (
		<div className='main-wrapper'>
			<div className="row post-item-wrapper">
				{filteredBlogs.map((blog) => (
					<div key={blog.id} style={{backgroundImage: `url(${blog.imgURL})`}} className="all-post-backgroundimg">
						<BlogItem blog={blog} />
					</div>
				))}
			</div>
		</div>
	)
}
export default BlogList