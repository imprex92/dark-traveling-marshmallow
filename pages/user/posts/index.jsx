import { useEffect, useState } from 'react'
import withPrivateRoute from 'components/HOC/withPrivateRoute'
import { projectFirestore } from 'firebase/config'
import BlogList from 'components/blogComponents/BlogList'
import {
  fetchUserblog,
  fetchUserHotels,
  fetchDbUserData,
} from 'components/utility/subscriptions'
import styles from 'styles/blogPostsFeed.module.css'
import SidebarNavigation from 'components/nav/SidebarNavigation'
import AddFirstPost from 'components/blogComponents/AddFirstPost'

const index = ({ userAuth }) => {
  const userDbRef = projectFirestore
    .collection('testUserCollection')
    .doc(userAuth.uid)
  const [blogPosts, setBlogPosts] = useState([])
  const [stayingHotels, setStayingHotels] = useState([])
  const [dbUserData, setDbUserData] = useState([])
  const [byCountrySearchTerm, setByCountrySearchTerm] = useState('')
  const [searchText, setSearchText] = useState('')
  let blogsToSend
  useEffect(() => {
    //! ComponentWillMount!
    const unsubscribePosts = userDbRef
      .collection('blogPosts')
      .onSnapshot(blogPostListener, (err) => {
        console.error('Subscibe to blogposts failed', err)
      })
    //! Subscribe to hotels as well?
    const unsubscribeHotels = userDbRef
      .collection('stayingHotel')
      .onSnapshot(hotelListener, (err) => {
        console.error('Subscribe to Hotels failed', err)
      })
    const unsubscribeDbUserData = userDbRef.onSnapshot(
      DbUserDataListener,
      (err) => {
        console.error('Subscribe to Firestore userData failed', err)
      },
    )
    //! inside return, same as ComponentWillUnmount! unsubscribe firestore listeners

    return () => {
      unsubscribePosts
      unsubscribeHotels
      unsubscribeDbUserData
    }
  }, [])

  //! 3 firestore listeners!
  function blogPostListener() {
    fetchUserblog(userAuth.uid).then((blogs) => {
      blogsToSend = blogs
      setBlogPosts(blogs)
    })
  }
  function hotelListener() {
    fetchUserHotels(userAuth.uid).then((userHotels) => {
      setStayingHotels(userHotels)
    })
  }
  function DbUserDataListener() {
    fetchDbUserData(userAuth.uid).then((user) => {
      setDbUserData(user)
    })
  }
  
  return (
    <div id="mainContainer" className={`${styles.container} ${blogPosts.length > 0 ? styles.gotPosts : ''}`}>
      <SidebarNavigation />
      { blogPosts.length > 0 ? 
        <BlogList countrySearchTerm={byCountrySearchTerm} userBlogs={blogPosts} />
        : 
        <AddFirstPost /> 
      }
    </div>
  )
}

export default withPrivateRoute(index)
