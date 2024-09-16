import React, { useState } from 'react'
import Link from 'next/link'
import styles from 'styles/mainNav.module.css'
import SlideOut from './navComponents/SlideOut'
import { closeSideNav } from './utils/functions/functions'
import { MOCK_COUNTRY_LIST } from 'components/utility/constants'

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
    <div id={styles.verticalNav}>
      <div className={styles.menuItems}>
        <a
          href="#"
          data-target="slide-out"
          className={`sidenav-trigger vertical-menu-btn ${styles.navBtn} ${styles.menuBtn}`}
        >
          <i className="material-icons">menu</i>
        </a>
        <Link href="/user/newpost" onClick={closeSideNav} className={styles.navBtn}>
          <i className="material-icons">add_box</i>
        </Link>
          <a
            onClick={handleFilter}
            defaultValue="All"
            className={`white-text ${currentFilter === 'All' ? styles.filterActive : ''} ${styles.filterOptionAll}`}
            href="#"
          >
            All
          </a>
        <div className={styles.countryFilters}>
          {MOCK_COUNTRY_LIST?.sort().map((country, i) => {
            return (
              <a
                onClick={handleFilter}
                key={i}
                defaultValue={country}
                className={`white-text ${country === currentFilter ? styles.filterActive : ''}`}
                href="#"
              >
                {country}
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const SideNavReplacement = (props) => {
  return (
    <div id="pageNavigation" className={styles.navMain}>
      <VerticalSection />
      <SlideOut {...props} />
    </div>
  )
}

export default SideNavReplacement
