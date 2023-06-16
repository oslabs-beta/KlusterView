/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Header from '../client/components/Header/Header';
import Sidebar from '../client/components/Sidebar/Sidebar';
import { Routes, Route } from 'react-router-dom';
import { getNodeIPs } from '../server/controllers/initializationController';
import Dashboard from '../client/components/Dashboard/Dashboard';

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
});

describe('Dashboard', () => {
  test('renders the dashboard component', () => {
    //somehow get a test url
    console.log('Graf ip', GRAF_IP);
    const testUrl = `http://admin:admin@${GRAF_IP}:32000/api/search?type=dash-db`;

    const { container } = render(<Dashboard url={testUrl} />);
    console.log('container', container.firstChild);

    // const dashboardContainer = screen.getByTestId('dashboard-container');
    // expect(dashboardContainer).toBeInTheDocument();
    console.log('classlist', container.classList);
    expect(container.firstChild.classList.contains('dashboard-container')).toBe(
      true
    );

    // const iframeElement = screen.getByTestId('dashboard');
    // expect(iframeElement).toBeInTheDocument();
    expect(
      container.firstChild.firstChild.classList.contains('dashboard')
    ).toBe(true);

    // expect(iframeElement).toHaveAttribute('src', testUrl);
  });
});
