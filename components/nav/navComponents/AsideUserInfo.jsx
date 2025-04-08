import React from 'react';
import PropTypes from 'prop-types';
import sideNavigationBackroundImg from 'public/assets/lighthouse-sidenav.jpg';
import Image from 'next/image';

import { FALLBACK_AVATAR_URL } from '../../utility/constants';

const AsideUserInfo = (props) => {
  console.log('props', props);
  const { userAuthFromServerside = {} } = props;
  const userAuth =
    Object.keys(userAuthFromServerside).length > 0
      ? userAuthFromServerside
      : props.userAuth;

  const { displayName = 'No Name', email, photoURL = null } = userAuth;

  return (
    <li>
      <div className="user-view">
        <div className="background">
          <Image
            src={sideNavigationBackroundImg}
            placeholder="blur"
            alt="side navigation background image"
            fill
            quality={60}
          />
        </div>
        <a href="#user">
          <img
            style={{ objectFit: 'cover' }}
            className="circle"
            src={photoURL || FALLBACK_AVATAR_URL}
            alt="User profile picture"
            width="96"
            height="96"
          />
        </a>
        <a href="#name">
          <span className="white-text name">{displayName}</span>
        </a>
        <a href="#email">
          <span className="white-text email">{email}</span>
        </a>
      </div>
    </li>
  );
};

AsideUserInfo.propTypes = {
  currentUser: PropTypes.object.isRequired,
  currentUser: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string,
    photoURL: PropTypes.string,
  }),
};

export default AsideUserInfo;
