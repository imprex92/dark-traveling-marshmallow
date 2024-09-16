import React, { useEffect } from 'react'
import styles from 'styles/mainNav.module.css'
import {
  closeSideNav,
  handleLogout,
  handleNewPost,
} from '../utils/functions/functions'
import Link from 'next/link'
import { useRouter } from 'next/router'
import AsideUserInfo from './AsideUserInfo'
import { ASIDE_MENU_BOTTOM, ASIDE_MENU_TOP } from 'components/utility/constants'

const SlideOut = (props) => {
  const router = useRouter()
  const route = router.route
  const {
    dbUserData = [],
    dataFromChildToParent = [],
    userAuth
  } = props

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
      <AsideUserInfo currentUser={userAuth} />
      {ASIDE_MENU_TOP.map((menuItem, index) => {
        return (
          <li key={index} onClick={menuItem.link === '#logout' ? handleLogout : closeSideNav} className={styles[menuItem.class]}>
            <Link href={menuItem.link} className={`${route.includes(menuItem.link) ? styles.active : ''}`}>
              <i className="material-icons">{menuItem.icon}</i>
              {menuItem.name}
            </Link>
          </li>
        )
      })}
      <li>
        <div className="divider"></div>
      </li>
      <li>
        <a className="subheader">Submenu</a>
      </li>
      {ASIDE_MENU_BOTTOM.map((menuItem, index) => {
        return (
          <li key={index} onClick={menuItem.link === '#newpost' ? handleNewPost : closeSideNav} className={styles[menuItem.class]}>
            <Link href={menuItem.link} className={`${route.includes(menuItem.link) ? styles.active : ''} ${menuItem.link === '#close' && 'sidenav-close waves-effect'}`}>
              <i className={menuItem.name === 'Weather' ? 'material-icons material-symbols-outlined' : 'material-icons'}>{menuItem.icon}</i>
              {menuItem.name}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default SlideOut
