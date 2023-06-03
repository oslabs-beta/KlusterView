import React, { useEffect, FC, SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.scss';

interface SidebarProps {
  setPodTitle: (podTitle: string) => void;
  setUrl: (url: string) => void;
  url: string;
  klusterUrl: string;
  podNames: { name: string }[];
  setPodNames: (podNames) => void;
}

const Sidebar: FC<SidebarProps> = ({
  setPodTitle,
  setUrl,
  url,
  klusterUrl,
  podNames,
  setPodNames,
}) => {
  const getPodNames = async () => {
    // try {
    //   const res = await fetch('/grafana/pods');
    //   const pods = await res.json();
    //   setPodNames(pods);
    // } catch (error) {
    //   console.log(error);
    // }
    setPodNames([{ name: '1' }, { name: '2' }, { name: '3' }]);
  };

  useEffect(() => {
    getPodNames();
  }, []);

  const handleKlusterLink = () => {
    setUrl(klusterUrl);
  };

  const handlePodLink = (e: SyntheticEvent) => {
    // Update page title with pod name
    const podName = e.target.classList[1];
    const podNumber = podName[podName.length - 1];
    setPodTitle(podName);

    //update url by inserting current pod number
    const urlIndexStart = url.indexOf('id/') + 3;
    const urlIndexEnd = url.indexOf('/', urlIndexStart);
    let urlStart = url.slice(0, urlIndexStart);
    let urlEnd = url.slice(urlIndexEnd);
    let newUrl = urlStart.concat(podNumber).concat(urlEnd);
    setUrl(newUrl);
  };

  const podlinks: JSX.Element[] = podNames.map(function (pod: {
    name: string;
  }) {
    return (
      <li className='navlink navlink-dropdown'>
        <Link
          className={`link Pod-${pod.name}`}
          to='/pods'
          onClick={handlePodLink}
        >
          {pod.name}
        </Link>
      </li>
    );
  });

  return (
    <nav className='sidebar'>
      <ul className='sidebar-list'>
        <li className='navlink'>
          <Link className='link' to='/' onClick={handleKlusterLink}>
            KLUSTER
          </Link>
        </li>
        <li className='navlink'>
          <Link className='link' to='/'>
            NODE MAP
          </Link>
        </li>
        <li className='navlink'>
          <Link className='link' to='/'>
            ALERTS
          </Link>
        </li>
        <li className='navlink'>
          <p className='link link-p'>PODS</p>
          <ul className='sidebar-list dropdown-content'>{podlinks}</ul>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
