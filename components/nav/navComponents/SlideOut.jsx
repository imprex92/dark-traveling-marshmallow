import React, { useEffect } from 'react'
import styles from 'styles/mainNav.module.css'
import PropTypes from 'prop-types'
import {
  closeSideNav,
  handleLogout,
  handleNewPost,
} from '../utils/functions/functions'
import Link from 'next/link'
import { useRouter } from 'next/router'

const SlideOut = (props) => {
  const router = useRouter()
  console.log('props', props)
  const {
    dbUserData = [],
    dataFromChildToParent = [],
    currentUser = null,
  } = props
  const show_in = 'posts'
  const route = router.route

  useEffect(() => {
    var sidenav = document.querySelectorAll('.sidenav')
    var instances = M.Sidenav.init(sidenav, {
      onOpenEnd: (el) => {
        el.classList.toggle('nav-open')
      },
      onCloseEnd: (el) => {
        el.classList.toggle('nav-open')
      },
    })
  }, [dbUserData])
  return (
    <ul id="slide-out" className="sidenav">
      <li>
        <div className="user-view">
          <div className="background">
            <img
              src="/assets/lighthouse-sidenav.jpg"
              alt="side navigation background image"
              height="211"
              width="300"
              quality={60}
            />
          </div>
          <a href="#user">
            <img
              style={{ objectFit: 'cover' }}
              className="circle"
              src={
                (currentUser && currentUser.photoURL) ||
                '/assets/icons8-test-account.png'
              }
              alt="User profile picture"
              width="96"
              height="96"
              quality={60}
            />
          </a>
          <a href="#name">
            <span className="white-text name">
              {currentUser && currentUser.displayName
                ? currentUser.displayName
                : 'No Name'}
            </span>
          </a>
          <a href="#email">
            <span className="white-text email">
              {currentUser && currentUser.email}
            </span>
          </a>
        </div>
      </li>
      <li onClick={closeSideNav}>
        <Link href="/user/dashboard">
          <i className="material-icons">home</i>Dashboard
        </Link>
      </li>
      <li>
        <a href="#!" onClick={handleLogout}>
          <i className="material-icons">power_settings_new</i>Log out
        </a>
      </li>
      <li onClick={closeSideNav}>
        <Link href="/user/settings">
          <i className="material-icons">manage_accounts</i>Account settings
        </Link>
      </li>
      <li>
        <div className="divider"></div>
      </li>
      <li>
        <a className="subheader">Submenu</a>
      </li>
      <li>
        <a className="sidenav-close waves-effect" href="#!">
          <i className="material-icons material-symbols-outlined">
            chevron_left
          </i>
          Close menu
        </a>
      </li>
      <li onClick={closeSideNav}>
        <a onClick={handleNewPost} className="" href="#!">
          <i className="material-icons">edit</i>Write new post
        </a>
      </li>
      <li
        style={
          route.includes(show_in) ? { display: 'none' } : { display: 'block' }
        }
        onClick={closeSideNav}
      >
        <Link href="/user/posts">
          <i className="material-icons">grid_on</i>View gallery
        </Link>
      </li>
      <li onClick={closeSideNav}>
        <Link href="/user/receipts/home">
          <i className="material-icons">receipt_long</i>Receipts
        </Link>
      </li>
      <li onClick={closeSideNav}>
        <Link href="/weather">
          <i className="material-icons material-symbols-outlined">
            partly_cloudy_day
          </i>
          Weather
        </Link>
      </li>
    </ul>
  )
}

SlideOut.propTypes = {}

export default SlideOut
