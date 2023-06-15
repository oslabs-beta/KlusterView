import React, { useEffect, FC, MouseEventHandler } from 'react';
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
  allPodsUrl: string;
  podInfo: PodInfo[];
  setPodInfo: (podInfo: PodInfo[]) => void;
  nodeMapInfo: { [n: string]: string[] };
}

const Sidebar: FC<SidebarProps> = ({
  setPodTitle,
  setUrl,
  url,
  podsUrl,
  setPodsUrl,
  klusterUrl,
  allPodsUrl,
  podInfo,
  setPodInfo,
  nodeMapInfo,
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

  const handlePodLink = (e: MouseEventHandler<HTMLAnchorElement>) => {
    // Update page title with pod name
    const podClassName = e.currentTarget.classList[1];
    setPodTitle(podClassName);
    const podName = podClassName.slice(4);

    // //update url for all pods metrics if PODS was clicked
    if (podName === 'All') {
      setPodsUrl(allPodsUrl);
    } else {
      //Find indexes of url to add url insert
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
    }
  };

  //Create dropdown pod links by mapping through podLinks
  const podLinks: JSX.Element[] = podInfo.map((pod: PodInfo) => {
    return (
      <li key={pod.name} className='navlink navlink-dropdown'>
        <Link
          className={`link Pod-${pod.name}`}
          to={`/pods/${pod.name}`}
          onClick={handlePodLink}
        >
          {pod.name}
        </Link>
      </li>
    );
  });

  const firstNodeName = Object.keys(nodeMapInfo)[0];

  return (
    <nav className='sidebar'>
      <ul className='sidebar-list'>
        <li className='navlink'>
          <Link className='link' to='/' onClick={handleKlusterLink}>
            KLUSTER
          </Link>
        </li>
        <li className='navlink'>
          <Link className='link' to={`/nodegraph/${firstNodeName}`}>
            NODE MAP
          </Link>
        </li>
        <li className='navlink'>
          <Link className='link Pod-All' to='/pods/all' onClick={handlePodLink}>
            PODS
          </Link>
          <ul className='sidebar-list dropdown-content'>{podLinks}</ul>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
