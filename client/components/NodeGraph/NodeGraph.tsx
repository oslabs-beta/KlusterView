import React, { FC, useCallback, useEffect, useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge } from 'reactflow';

import NodeModal from './NodeModal';
import { Link } from 'react-router-dom';
import { initialGen, ChildNode, NodeGraphProps } from './utils';

import 'reactflow/dist/style.css';
import './NodeGraph.scss';

const NodeGraph: FC<NodeGraphProps> = ({
  nodeMapInfo,
  podStatus,
  modalInfo,
}) => {
  const [modal, setModal] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  const [podHoverInfo, setPodHoverInfo] = useState<any>({});
  const [root, setRoot] = useState<string>('minikube');

  const children = nodeMapInfo[root];
  const { initialNodes, initialEdges } = initialGen(
    root,
    children,
    podStatus,
    modalInfo
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  const handleMouseEnter = (e: React.SyntheticEvent, n: ChildNode) => {
    if (n.status && n.modalData) {
      setStatus(n.status);
      setPodHoverInfo(n.modalData);
    }
    if (n.id !== '1') {
      setModal(true);
    }
  };
  const handleMouseLeave = (e: React.SyntheticEvent, n: ChildNode) => {
    setModal(false);
  };

  // Create links to view each node graph if there are multiple

  const nodeLinks = Object.keys(nodeMapInfo).map((node) => {
    return (
      <li className='navlink-graph' key={node}>
        <Link
          to={`/nodegraph/${node}`}
          onClick={() => {
            const { initialNodes, initialEdges } = initialGen(
              node,
              nodeMapInfo[node],
              podStatus,
              modalInfo
            );
            setNodes(initialNodes);
            setEdges(initialEdges);
          }}
        >
          {node}
        </Link>
      </li>
    );
  });

  return (
    <div className='nodeGraph-container'>
      <div className='nodeGraph'>
        {nodeLinks.length > 1 && <ul className='list'>{nodeLinks}</ul>}
        {modal && <NodeModal status={status} modalInfo={podHoverInfo} />}
        <div style={{ width: '100%', height: '90%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeMouseEnter={handleMouseEnter}
            onNodeMouseLeave={handleMouseLeave}
          />
        </div>
      </div>
    </div>
  );
};

export default NodeGraph;
