import React from 'react';
import './Header.scss';

const Header = () => {
  return (
    <header className='header'>
      <h1 className='header-logo'>KV</h1>
      <div className='header-container'>
        <span>Kluster</span>
        <h1 className='header-name'>View</h1>
      </div>
    </header>
  );
};

export default Header;
