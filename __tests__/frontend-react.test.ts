import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../client/components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import { Routes, Route } from 'react-router-dom';


describe('Header', () => {
  it('renders the header with logo and name', () => {

    header = render(<Header >);


    const logo = screen.getByText('KV');
    const name = screen.getByText('Kluster View');

    expect(logo).toBeInTheDocument();
    expect(name).toBeInTheDocument();
  });
});

describe('Sidebar', () => {
    it('renders the sidebar with link', () => {
     
      render(
 
          <Sidebar
            setPodTitle={() => {}}
            setUrl={() => {}}
            url=""
            podsUrl=""
            setPodsUrl={() => {}}
            klusterUrl=""
            allPodsUrl=""
            podInfo={[
              { name: 'Pod1', ip: 123 },
              { name: 'Pod2', ip: 456 }
            ]}
            setPodInfo={() => {}}
            nodeMapInfo={{}}
          />

      );
  
     
      const klusterLink = screen.getByRole('link', { name: /kluster/i });
      const podsLink = screen.getByRole('link', { name: /pods/i });
      const nodeMapLink = screen.getByRole('link', { name: /node map/i });
  
 
      expect(klusterLink).toBeInTheDocument();
      expect(podsLink).toBeInTheDocument();
      expect(nodeMapLink).toBeInTheDocument();
    });

    describe('Dashboard', () => {
        test('renders the dashboard component', () => {
          const testUrl = 'http://admin:admin@${GRAF_IP}:${GRAF_NODE_PORT}/api/search?type=dash-db'
      

          render(<Dashboard-url={testUrl} />);
      

          const dashboardContainer = screen.getByTestId('dashboard-container');
          expect(dashboardContainer).toBeInTheDocument();
      

          const iframeElement = screen.getByTestId('dashboard-iframe');
          expect(iframeElement).toBeInTheDocument();
          expect(iframeElement).toHaveAttribute('src', testUrl);
        });
      
      });
