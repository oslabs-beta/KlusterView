import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.scss';

const Sidebar = () => {
  type Data = {
    name: string;
  };

  const data: Data[] = [{ name: 'One' }, { name: 'Two' }, { name: 'Three' }];

  const podlinks = data.map(function (pod: { name: string }) {
    return (
      <li className='navlink navlink-dropdown'>
        <Link to='/pods'>{pod.name}</Link>
      </li>
    );
  });

  return (
    <nav className='sidebar'>
      <ul className='sidebar-list'>
        <li className='navlink'>
          <Link to='/'>METRICS</Link>
        </li>
        <li className='navlink'>
          <Link to='/pods'>PODS</Link>
          <ul className='sidebar-list dropdown-content'>{podlinks}</ul>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
