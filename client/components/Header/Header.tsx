import React, { FC } from 'react';
import './Header.scss';

const Header: FC = () => {
  return (
    <header className='header'>
      <div className='header-logo'>
        <img
          src={require('../../../assets/headerLogo.png')}
          alt='logo'
          width={56}
          height={56}
        />
      </div>
      <div className='header-container'>
        <span>Kluster</span>
        <h1 className='header-name'>View</h1>
      </div>
    </header>
  );
};

export default Header;
