import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from 'contexts/AuthContext'
import styles from 'styles/mainNav.module.css'
import SlideOut from './navComponents/SlideOut'
import { closeSideNav } from './utils/functions/functions'

const VerticalSection = ({ dataFromChildToParent, countriesVisited }) => {
  const [currentFilter, setCurrentFilter] = useState('All')

  function handleFilter(e) {
    let countryToFilter = e.currentTarget.textContent

    if (e.currentTarget.textContent === 'All') {
      countryToFilter = ' '
      dataFromChildToParent(countryToFilter)
      setCurrentFilter(countryToFilter)
    }
    dataFromChildToParent(countryToFilter)
    setCurrentFilter(countryToFilter)
  }

  return (
    <div id="vertical-nav">
      <div className="wrapper">
        <a
          href="#"
          data-target="slide-out"
          className="sidenav-trigger vertical-menu-btn"
        >
          <i className="material-icons">menu</i>
        </a>
        <Link href="/user/newpost" onClick={closeSideNav}>
          <i className="material-icons">add_box</i>
        </Link>
        <a
          onClick={handleFilter}
          defaultValue="All"
          className={`contact ${currentFilter === 'All' ? 'filterActive' : ''}`}
          href="#"
        >
          All
        </a>
        {countriesVisited?.map((country, i) => {
          return (
            <a
              onClick={handleFilter}
              key={i}
              defaultValue={country}
              className={`contact ${country === currentFilter ? 'filterActive' : ''}`}
              href="#"
            >
              {country}
            </a>
          )
        })}
      </div>
    </div>
  )
}

const SideNavReplacement = (props) => {
  const { logout, currentUser } = useAuth()
  const router = useRouter()
  return (
    <div id="pageNavigation" className={styles.navMain}>
      <VerticalSection />
      <SlideOut {...props} />
    </div>
  )
}

SideNavReplacement.propTypes = {}

export default SideNavReplacement
