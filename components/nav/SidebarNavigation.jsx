import React from 'react'
import Link from 'next/link'
import styles from 'styles/mainNav.module.css'
import SlideOut from './navComponents/SlideOut'
import { closeSideNav } from './utils/functions/functions'
import { VERTICAL_MENU } from 'components/utility/constants'
import { useRouter } from 'next/router'
import Tooltip from 'components/utility/tooltip/Tooltip'
import withPrivateRoute from 'components/HOC/withPrivateRoute'

const SidebarNavigation = (props) => {
  return (
    <div id="pageNavigation" className={styles.navMain}>
      <VerticalSection />
      <SlideOut {...props} />
    </div>
  )
}

const VerticalSection = () => {
  const router = useRouter()
  const route = router.route

  return (
    <div id={styles.verticalNav}>
      <div className={styles.menuItems}>
        <a
          href="#"
          data-target="slide-out"
          className={`sidenav-trigger vertical-menu-btn ${styles.navBtn} ${styles.menuBtn}`}
        >
          <i className="material-icons">menu</i>
        </a>
        <Link
          href="/user/newpost"
          onClick={closeSideNav}
          className={styles.navBtn}
        >
          <i className="material-icons">add_box</i>
        </Link>
        {VERTICAL_MENU.map((menuItem, index) => {
          const selectedClass = route.includes(menuItem.link)
            ? `${styles[menuItem.class]}_selected`
            : styles[menuItem.class]
          return (
            <Tooltip key={index} text={menuItem.name} position="right">
              <Link
                key={index}
                href={menuItem.link}
                className={`${selectedClass} `}
              >
                <i
                  className={
                    menuItem.link === '/weather'
                      ? 'material-symbols-outlined'
                      : 'material-icons'
                  }
                >
                  {menuItem.icon}
                </i>
              </Link>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}

export default withPrivateRoute(SidebarNavigation)
