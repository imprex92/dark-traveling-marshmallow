import { useEffect, useState } from 'react';
import styles from 'styles/blogPostsFeed.module.css';

import BlogItem from './BlogItem';

const BlogList = ({ searchByText, countrySearchTerm, userBlogs }) => {
  const [filterByCountry, setFilterByCountry] = useState('');
  const [fetchedUserBlogs, setFetchedUserBlogs] = useState([]);
  useEffect(() => {
    setFetchedUserBlogs(userBlogs);
    setFilterByCountry(countrySearchTerm);
    return () => {};
  }, [searchByText, countrySearchTerm, userBlogs]);

  let filteredBlogs = fetchedUserBlogs?.filter((post) => {
    if (!filterByCountry.trim(' ')) {
      return post;
    } else {
      return post.postLocationData.country
        .toLowerCase()
        .includes(filterByCountry.toLowerCase());
    }
  });

  return (
    <div id="mainContent" className={styles.innerWrapper}>
      <div
        className={`${styles.postItemsWrapper} ${filteredBlogs.length > 0 ? styles.gotPosts : ''}`}
      >
        {filteredBlogs.map((blog) => {
          //! change to mediaURLs when ready
          const url =
            typeof blog.imgURL === 'string' ? blog.imgURL : blog.mediaURLs[0];
          return (
            <div
              key={blog.id}
              style={{ backgroundImage: `url(${url})` }}
              className={styles.itemsWrapper}
            >
              <BlogItem blog={blog} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default BlogList;
