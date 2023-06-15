import React, { FC } from 'react';
import NodeGraph from '../components/NodeGraph/NodeGraph';
import './pages.scss';

interface GraphProps {
  nodeMapInfo: { [n: string]: string[] };
  podStatus: { [p: string]: string };
  modalInfo: { [p: string]: string };
}

const Graph: FC<GraphProps> = ({ nodeMapInfo, podStatus, modalInfo }) => {
  return (
    <div className='page'>
      <h1 className='page-title'>Node Graph</h1>
      <NodeGraph
        nodeMapInfo={nodeMapInfo}
        podStatus={podStatus}
        modalInfo={modalInfo}
      />
    </div>
  );
};

export default Graph;
