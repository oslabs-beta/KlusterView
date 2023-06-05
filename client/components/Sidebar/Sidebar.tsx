import React, { useEffect, FC, SyntheticEvent } from 'react';
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
  klusterUrl: string;
  podInfo: PodInfo[];
  setPodInfo: (podInfo: PodInfo[]) => void;
}

const Sidebar: FC<SidebarProps> = ({
  setPodTitle,
  setUrl,
  url,
  klusterUrl,
  podInfo,
  setPodInfo,
}) => {
  const getPodInfo = async () => {
    // try {
    //   const res = await fetch('/grafana/pods');
    //   const pods = await res.json();
    //   setPodNames(pods);
    // } catch (error) {
    //   console.log(error);
    // }
    setPodInfo([
      { name: '1', ip: 345 },
      { name: '2', ip: 456 },
      { name: '3', ip: 567 },
    ]);
  };

  useEffect(() => {
    getPodInfo();
  }, []);

  const handleKlusterLink = () => {
    setUrl(klusterUrl);
  };

  const handlePodLink = (e: SyntheticEvent<HTMLAnchorElement>) => {
    // Update page title with pod name
    const podClassName = e.currentTarget.classList[1];
    const podName = podClassName.slice(4);
    setPodTitle(podClassName);

    //update url by inserting current pod number and ip
    const urlIndexStart = url.indexOf('id/') + 3;
    const urlIndexEnd = url.indexOf('/', urlIndexStart);
    /*****  Actual URL Code *******
    const urlIndexStart = url.indexOf('&var-Pod=') + 9;
    const urlIndexEnd = url.indexOf('&var-phase=', urlIndexStart);
    ****** Actual URL Insert ******
    const podInfoKeys = Object.keys(podInfo);
    const podIndex = podInfoKeys.indexOf(podName);
    const ipAddress = podInfo[podIndex].ip;
    const ip = e.target.id;
    const urlInsert = `${podName}&var-Pod_ip=${ipAddress}`;
    ******************************/
    const urlStart = url.slice(0, urlIndexStart);
    const urlEnd = url.slice(urlIndexEnd);

    const newUrl = urlStart.concat(podName).concat(urlEnd);
    /***** Actual newUrl **********
    const newUrl = urlStart.concat(urlInsert).concat(urlEnd)
    ******************************/
    setUrl(newUrl);
  };

  //Create dropdown pod links by mapping through podLinks
  const podLinks: JSX.Element[] = podInfo.map((pod: PodInfo) => {
    return (
      <li key={pod.name} className='navlink navlink-dropdown'>
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
          <ul className='sidebar-list dropdown-content'>{podLinks}</ul>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
