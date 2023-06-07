import React, { useEffect, FC, SyntheticEvent, MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.scss';

interface PodInfo {
  name: string;
  ip: number;
}

interface SidebarProps {
  setPodTitle: (podTitle: string) => void;
  setUrl: (url: string) => void;
  url: string;
  podsUrl: string;
  setPodsUrl: (podsUrl: string) => void;
  klusterUrl: string;
  podInfo: PodInfo[];
  setPodInfo: (podInfo: PodInfo[]) => void;
}

const Sidebar: FC<SidebarProps> = ({
  setPodTitle,
  setUrl,
  url,
  podsUrl,
  setPodsUrl,
  klusterUrl,
  podInfo,
  setPodInfo,
}) => {
  const getPodInfo = async () => {
    try {
      const res = await fetch('/prom/pods');
      const pods = await res.json();
      console.log(pods);
      setPodInfo(pods);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPodInfo();
  }, []);

  const handleKlusterLink = () => {
    setUrl(klusterUrl);
  };

  // const handlePodLink = (e: SyntheticEvent<HTMLAnchorElement>) => {
  const handlePodLink = (e: MouseEventHandler<HTMLLIElement>) => {
    // Update page title with pod name
    console.log('base event:', e);
    const podClassName = e.target.classList[1];
    const podName = podClassName.slice(4);
    setPodTitle(podClassName);

    //update url by inserting current pod number and ip
    const urlIndexStart = podsUrl.indexOf('&var-Pod=') + 9;
    const urlIndexEnd = podsUrl.indexOf('&var-phase=', urlIndexStart);
    // Create URL Insert
    const podInfoKeys = Object.keys(podInfo);
    let names = podInfo.map((item) => item.name);
    const podIndex = names.indexOf(podName);
    const ipAddress = podInfo[podIndex].ip;
    const urlInsert = `${podName}&var-Pod_ip=${ipAddress}`;
    // Create newURL
    const urlStart = podsUrl.slice(0, urlIndexStart);
    const urlEnd = podsUrl.slice(urlIndexEnd);
    const newUrl = urlStart.concat(urlInsert).concat(urlEnd);
    setPodsUrl(newUrl);
  };

  //Create dropdown pod links by mapping through podLinks
  const podLinks: JSX.Element[] = podInfo.map((pod: PodInfo) => {
    return (
      <li
        key={pod.name}
        className='navlink navlink-dropdown'
        onClick={handlePodLink}
      >
        <Link
          key={pod.name}
          className={`link Pod-${pod.name}`}
          to={`/pods/${pod.name}`}
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
          <ul className='sidebar-list dropdown-content'>{podLinks}</ul>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
