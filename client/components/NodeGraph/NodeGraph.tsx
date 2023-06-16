import React, { FC, useCallback, useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge } from 'reactflow';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import 'reactflow/dist/style.css';
import './NodeGraph.scss';
import NodeModal from './NodeModal';
interface NodeGraphProps {
  nodeMapInfo: { [n: string]: string[] };
  podStatus: { [p: string]: string };
  modalInfo: { [p: string]: string };
}

const NodeGraph: FC<NodeGraphProps> = ({
  nodeMapInfo,
  podStatus,
  modalInfo,
}) => {
  const [modal, setModal] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  const [podHoverInfo, setPodHoverInfo] = useState<any>({});
  const nodeUrlName = useParams();
  const root = nodeUrlName.nodeName;
  const children = nodeMapInfo[root];
  const rootX = 600;
  const rootY = 100;
  const initialNodes = [];
  initialNodes.push({
    id: '1',
    position: { x: rootX, y: rootY },
    data: { label: root },
    style: { color: 'green', backgroundColor: 'white' },
  });
  const initialEdges = [];
  let childX = 50;
  let childY = 300;
  type ChildNode = {
    id: string;
    position: {
      x: number;
      y: number;
    };
    data: {
      label: string;
    };
    status: string;
    modalData: any;
    style: {
      color: string;
      backgroundColor: string;
    };
  };
  for (let i = 0, times = 0; i < children.length; times++, i++) {
    const childNodeObj: ChildNode = {
      id: `${2 + i}`,
      position: { x: childX * 4 * (times + 1), y: childY },
      data: { label: children[i] },
      status: podStatus[children[i]],
      modalData: modalInfo[children[i]],
      style: {
        color: 'white',
        backgroundColor: podStatus[children[i]] === 'Running' ? 'green' : 'red',
      },
    };
    if (childX * 4 * (times + 1) > 1000) {
      childX = 40;
      childY += 100;
      times = 0;
    }
    initialNodes.push(childNodeObj);
    const edgeObj = {
      id: `el-${2 + i}`,
      source: '1',
      target: `${i + 2}`,
    };
    initialEdges.push(edgeObj);
  }
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
    setModal(true);
  };
  const handleMouseLeave = (e: React.SyntheticEvent, n: ChildNode) => {
    setModal(false);
  };

  // Create links to view each node graph if there are multiple
  const nodeLinks = Object.keys(nodeMapInfo).map((node) => {
    return (
      <li className='navlink-graph'>
        <Link to={`/nodegraph/${node}`}>{node}</Link>
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
