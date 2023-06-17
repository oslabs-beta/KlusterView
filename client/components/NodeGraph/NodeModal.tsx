import React, { FC } from 'react';
import './NodeModal.scss';
interface NodeModalProps {
  status: string;
  modalInfo: { [key: string]: string };
}
const NodeModal: FC<NodeModalProps> = ({ status, modalInfo }) => {
  const { hostIp, podIp, node, nameSpace, job } = modalInfo;
  return (
    <div className='nodeModal'>
      <ul>
        <li>
          <text>Status:</text>
          {status}
        </li>
        <li>
          <text>Host IP:</text> {hostIp}
        </li>
        <li>
          <text>Pod IP:</text>
          {podIp}
        </li>
        <li>
          <text>Node:</text>
          {node}
        </li>
        <li>
          <text>NameSpace:</text> {nameSpace}
        </li>
        <li>
          <text>Job:</text> {job}
        </li>
      </ul>
    </div>
  );
};

export default NodeModal;
