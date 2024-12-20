import { useState, useEffect } from 'react'
import { projectFirestore } from 'firebase/config'
import withPrivateRoute from 'components/HOC/withPrivateRoute'
import {
  fetchUserblog,
  fetchUserHotels,
  fetchDbUserData,
} from 'components/utility/subscriptions'
import Geolocator from 'components/Geolocator'
import Slides from 'components/Slides'
import styles from 'styles/dashboard.module.css'
import { useRouter } from 'next/router'
import { getFirestore } from 'firebase-admin/firestore'

import nookies from 'nookies'
import { firebaseAdminVerifyToken } from 'firebase/firebaseAdmin'
import { RANDOM_SENTENCES } from 'components/utility/constants'
import SidebarNavigation from 'components/nav/SidebarNavigation'
import AddFirstPost from '../../components/blogComponents/AddFirstPost'

const dashboard = ({ userAuth, userBlogs = [] }) => {
  const { uid, name = 'User' } = userAuth
  const userDbRef = projectFirestore.collection('testUserCollection').doc(uid)
  const [searchText, setSearchText] = useState('')
  const [blogPosts, setBlogPosts] = useState([])
  const [stayingHotels, setStayingHotels] = useState([])
  const [dbUserData, setDbUserData] = useState([])
  const [byCountrySearchTerm, setByCountrySearchTerm] = useState('')
  //let blogsToSend

  useEffect(() => {
    //! ComponentWillMount!
    const unsubscribePosts = userDbRef
      .collection('blogPosts')
      .onSnapshot(blogPostListener, (err) => {
        console.error('Subscribe to blogposts failed', err)
        M.toast({ text: `Subscribe to blogposts failed, ${err}` })
      })
    const unsubscribeHotels = userDbRef
      .collection('stayingHotel')
      .onSnapshot(hotelListener, (err) => {
        console.error('Subscribe to Hotels failed', err)
        M.toast({ text: `Subscribe to hotels failed, ${err}` })
      })
    const unsubscribeDbUserData = userDbRef.onSnapshot(
      DbUserDataListener,
      (err) => {
        console.error('Subscribe to DB failed', err)
        M.toast({ text: `Subscribe to DB failed, ${err}` })
      },
    )

    return () => {
      unsubscribePosts()
      unsubscribeHotels()
      unsubscribeDbUserData()
    }
  }, [])
  useEffect(() => {
    blogPosts.length === 0 ? setBlogPosts(userBlogs) : ''
  }, [])
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * RANDOM_SENTENCES.length)
    setRandomIndex(randomIndex)
  }, [])

  //! 3 firestore listeners!
  function blogPostListener() {
    fetchUserblog(uid).then((blogs) => {
      //blogsToSend = blogs
      setBlogPosts(blogs)
    })
  }
  function hotelListener() {
    fetchUserHotels(uid).then((userHotels) => {
      setStayingHotels(userHotels)
    })
  }
  function DbUserDataListener() {
    fetchDbUserData(uid).then((user) => {
      setDbUserData(user)
    })
  }

  //! SearchTerm, filter vid click på land i navbar, kommer från navbar, skickas vidare till Slides componenten
  function filterCountry(dataFromChildToParent) {
    console.log('User wants to search for: ', dataFromChildToParent)
    setByCountrySearchTerm(dataFromChildToParent)
  }

  return (
    <div id="mainContainer" className={styles.dashboardMain}>
      <SidebarNavigation userAuthFromServerside={userAuth} />
      <div id="mainContent" className={styles.wrapper}>
        <Geolocator />
        <div className="row valign-wrapper">
          <div className={`col m12 s10 ${styles.greetingSection}`}>
            <h4>Hi {name}!</h4>
            <h5>Let's start your journey</h5>
          </div>
        </div>
        <div className="row valign-wrapper">
          <form className={`col s12 ${styles.searchbarSection}`}>
            <div className="row">
              <div
                className={`input-field col s8 offset-s1 offset-m3 m6 ${styles.searchBox}`}
              >
                <i className="material-icons prefix">search</i>
                <input
                  type="search"
                  className="white-text"
                  onChange={(e) => setSearchText(e.target.value)}
                  name=""
                  placeholder=" "
                  id="search-field"
                />
                <label className="white-text" htmlFor="search-field">
                  Make a search
                </label>
              </div>
            </div>
          </form>
        </div>
        <div
          className={`row valign-wrapper ${styles.postSlides} ${userBlogs.length > 0 ? styles.hasContent : styles.postSlides_empty}`}
        >
          <div
            className={`col s12 center-align ${userBlogs.length > 0 ? styles.postCarouselSection : styles.postCarouselSection_empty}`}
          >
            <div className="custom-body">
              {/* //! SearchTerm, filter vid click på land i navbar, kommer från navbar, skickas vidare till Slides componenten */}
              {/* //! userBlogs, skickar vidare bloggarna vi fått med subscription från Firestore till Slides för att visa och visa eventuella sökresultat */}
              {userBlogs.length > 0 ? (
                <Slides
                  searchByText={searchText}
                  countrySearchTerm={byCountrySearchTerm}
                  userBlogs={blogPosts}
                />
              ) : (
                <AddFirstPost
                  isDashboard={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async (ctx) => {
  try {
    const cookies = nookies.get(ctx)
    const token = await firebaseAdminVerifyToken(cookies.token)
    const adminFirestore = getFirestore()
    const { uid, email, name = null, picture = null } = token

    // Fetch data here

    let userBlogs = []
    const userDbRef = adminFirestore.collection('testUserCollection').doc(uid)

    await userDbRef
      .collection('blogPosts')
      .get()
      .then((docSet) => {
        if (docSet !== null) {
          docSet.forEach((doc) => {
            let postData = doc.data()
            // Check and convert GeoPoint to a serializable object
            if (
              postData.postLocationData &&
              postData.postLocationData.geopoint
            ) {
              const geopoint = postData.postLocationData.geopoint
              postData.postLocationData.geopoint = {
                latitude: geopoint.latitude,
                longitude: geopoint.longitude,
              }
            }
            // Ensure the entire postData object is serializable
            postData = JSON.parse(JSON.stringify(postData))
            userBlogs.push({ ...postData, id: doc.id })
          })
        }
      })

    return {
      props: {
        userBlogs,
        userAuth: { uid, email, name, picture },
      },
    }
  } catch (err) {
    console.error(err)
    ctx.res.writeHead(302, {
      Location:
        err.code === 'auth/id-token-expired' ? '/login#tokenExpired' : '/login',
    })
    ctx.res.end()

    return { props: {} }
  }
}

export default withPrivateRoute(dashboard)
