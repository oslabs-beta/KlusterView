/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import Header from '../client/components/Header/Header';
import Sidebar from '../client/components/Sidebar/Sidebar';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import { getNodeIPs } from '../server/controllers/initializationController';
import Dashboard from '../client/components/Dashboard/Dashboard';
import Home from '../client/pages/Home';

const IPList = getNodeIPs();
const GRAF_IP = IPList[0];

afterEach(() => {
  cleanup();
});

describe('Header', () => {
  test('renders the header with logo and name', () => {
    render(<Header />);
    const logo = screen.getByText('KV');
    const name1 = screen.getByText('Kluster');
    const name2 = screen.getByText('View');
    expect(logo).toBeInTheDocument();
    expect(name1).toBeInTheDocument();
    expect(name2).toBeInTheDocument();
  });

  test('has correct class names', () => {
    render(<Header />);

    const headerElement = screen.getByRole('banner');
    const logo = screen.getByText('KV');
    const name1 = screen.getByText('Kluster');
    const name2 = screen.getByText('View');

    expect(headerElement).toHaveClass('header');
    expect(logo).toHaveClass('header-logo');
    expect(name1).not.toHaveClass('header-logo');
    expect(name2).toHaveClass('header-name');
  });
});

describe('Sidebar component', () => {
  test('renders all the navigation links', () => {
    const setPodTitle = jest.fn();
    const setUrl = jest.fn();
    const setPodsUrl = jest.fn();
    const podInfo = [
      { name: 'Pod1', ip: 1 },
      { name: 'Pod2', ip: 2 },
      { name: 'Pod3', ip: 3 },
    ];

    render(
      <MemoryRouter>
        <Sidebar
          setPodTitle={setPodTitle}
          setUrl={setUrl}
          url=''
          podsUrl=''
          setPodsUrl={setPodsUrl}
          klusterUrl=''
          allPodsUrl=''
          podInfo={podInfo}
          setPodInfo={() => {}}
          nodeMapInfo={{}}
        />
      </MemoryRouter>
    );

    // Check if all the navigation links are rendered
    const klusterLink = screen.getByText('KLUSTER');
    const nodeMapLink = screen.getByText('NODE MAP');
    const podsLink = screen.getByText('PODS');

    expect(klusterLink).toBeInTheDocument();
    expect(nodeMapLink).toBeInTheDocument();
    expect(podsLink).toBeInTheDocument();
  });

  test('handles click on KLUSTER link correctly', () => {
    const setUrl = jest.fn();
    const klusterUrl = '/kluster';

    render(
      <MemoryRouter>
        <Sidebar
          setPodTitle={() => {}}
          setUrl={setUrl}
          url=''
          podsUrl=''
          setPodsUrl={() => {}}
          klusterUrl={klusterUrl}
          allPodsUrl=''
          podInfo={[]}
          setPodInfo={() => {}}
          nodeMapInfo={{}}
        />
      </MemoryRouter>
    );

    const klusterLink = screen.getByText('KLUSTER');
    fireEvent.click(klusterLink);

    expect(setUrl).toHaveBeenCalledTimes(1);
    expect(setUrl).toHaveBeenCalledWith(klusterUrl);
  });

  test('handles click on PODS link correctly', () => {
    const setPodTitle = jest.fn();
    const setPodsUrl = jest.fn();
    const allPodsUrl = '/pods/all';
    const podInfo = [
      { name: 'Pod1', ip: 1 },
      { name: 'Pod2', ip: 2 },
    ];

    render(
      <MemoryRouter>
        <Sidebar
          setPodTitle={setPodTitle}
          setUrl={() => {}}
          url=''
          podsUrl=''
          setPodsUrl={setPodsUrl}
          klusterUrl=''
          allPodsUrl={allPodsUrl}
          podInfo={podInfo}
          setPodInfo={() => {}}
          nodeMapInfo={{}}
        />
      </MemoryRouter>
    );

    const podsLink = screen.getByText('PODS');
    fireEvent.click(podsLink);

    expect(setPodTitle).toHaveBeenCalledTimes(1);
    expect(setPodTitle).toHaveBeenCalledWith('Pod-All');
    expect(setPodsUrl).toHaveBeenCalledTimes(1);
    expect(setPodsUrl).toHaveBeenCalledWith(allPodsUrl);
  });
});

describe('Home', () => {
  test('renders Home page', () => {
    const { container } = render(<Home url='test-url' />);
    const homeElement = container.firstChild;
    expect(homeElement).toBeInTheDocument();
  });

  test('renders Home page title', () => {
    render(<Home url='test-url' />);
    const pageTitle = screen.getByText('Kluster Metrics');
    expect(pageTitle).toBeInTheDocument();
  });

  test('renders Dashboard component', () => {
    const { container } = render(<Home url='test-url' />);
    const dashboardComponent = container.lastChild;
    expect(dashboardComponent).toBeInTheDocument();
  });
});

describe('Dashboard', () => {
  test('renders the dashboard component', () => {
    const testUrl = `http://admin:admin@${GRAF_IP}:32000/api/search?type=dash-db`;
    const { container } = render(<Dashboard url={testUrl} />);
    const iframeElement = container.firstChild.firstChild;

    expect(iframeElement).toBeInTheDocument();
    expect(iframeElement).toHaveAttribute('src', testUrl);
  });

  test('has correct class names', () => {
    const testUrl = `http://admin:admin@${GRAF_IP}:32000/api/search?type=dash-db`;
    const { container } = render(<Dashboard url={testUrl} />);
    const dashboardContainer = container.firstChild;
    const iframeElement = dashboardContainer.firstChild;

    expect(dashboardContainer).toBeInTheDocument();
    expect(dashboardContainer).toHaveClass('dashboard-container');
    expect(iframeElement).toBeInTheDocument();
    expect(iframeElement).toHaveClass('dashboard');
  });
});
