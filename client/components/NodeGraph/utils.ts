interface NodeGraphProps {
  nodeMapInfo: { [n: string]: string[] };
  podStatus: { [p: string]: string };
  modalInfo: { [p: string]: string };
}
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
interface NodeGraphProps {
  nodeMapInfo: { [n: string]: string[] };
  podStatus: { [p: string]: string };
  modalInfo: { [p: string]: string };
}

//This Function takes a node name, pods under this node,
// status of those pods, and some additional info on those pods
//based on these data it creates necessarry nodes and edges
//that is needed for ReactFlow Graph
const initialGen = (
  root: string,
  children: string[],
  podStatus: { [p: string]: string },
  modalInfo: { [p: string]: string }
) => {
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

  return { initialNodes, initialEdges };
};

export { initialGen, ChildNode, NodeGraphProps };
