import React from 'react'
import PropTypes from 'prop-types'
import fallbackUserImg from 'public/assets/icons8-test-account.png'
import sideNavigationBackroundImg from 'public/assets/lighthouse-sidenav.jpg'
import Image from 'next/image'

const AsideUserInfo = props => {
  const { displayName = 'No Name', email, photoURL = fallbackUserImg } = props.currentUser

  return (
    <li>
      <div className="user-view">
        <div className="background">
          <Image
            src={sideNavigationBackroundImg}
            placeholder='blur'
            alt="side navigation background image"
            fill
            quality={60}
          />
        </div>
        <a href="#user">
          <Image
            style={{ objectFit: 'cover' }}
            className="circle"
            src={photoURL}
            alt="User profile picture"
            width="96"
            height="96"
            quality={60}
          />
        </a>
        <a href="#name">
          <span className="white-text name">
            {displayName}
          </span>
        </a>
        <a href="#email">
          <span className="white-text email">
            {email}
          </span>
        </a>
      </div>
    </li>
  )
}

AsideUserInfo.propTypes = {
  currentUser: PropTypes.object.isRequired,
  currentUser: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string,
    photoURL: PropTypes.string
  })
}

export default AsideUserInfo