import React, { FC, useCallback, useEffect, useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge } from 'reactflow';
import { useParams } from 'react-router';
import 'reactflow/dist/style.css';

interface NodeGraphProps {
  nodeMapInfo: { [n: string]: string[] };
  podStatus: { [p: string]: string };
}
const NodeGraph: FC<NodeGraphProps> = ({ nodeMapInfo, podStatus }) => {
  const nodeUrlName = useParams();
  const root = nodeUrlName.nodeName;
  const children = nodeMapInfo[root];
  const rootX = 850;
  const rootY = 300;
  const initialNodes = [];
  initialNodes.push({
    id: '1',
    position: { x: rootX, y: rootY },
    data: { label: root },
    style: { color: 'green', backgroundColor: 'white' },
  });
  const initialEdges = [];

  let childX = 200;
  let childY = 400;
  for (let i = 0, times = 0; i < children.length; times++, i++) {
    const childNodeObj = {
      id: `${2 + i}`,
      position: { x: childX * (times + 1), y: childY },
      data: { label: children[i] },
      status: 'running',
      style: {
        color: 'white',
        backgroundColor: podStatus[children[i]] === 'Running' ? 'green' : 'red',
      },
    };
    if (childX * (times + 1) > 1200) {
      childX = 200;
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
  console.log('customNodes', initialNodes);
  console.log('customNegde', initialEdges);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      />
    </div>
  );
};

export default NodeGraph;
