import React, { FC, CSSProperties } from 'react';

interface ModalContainerProps {
  modalVisible: boolean;
}

const ModalContainer: FC<ModalContainerProps> = ({ modalVisible }) => {
  const modalContainerStyle: CSSProperties = {
    visibility: modalVisible ? 'visible' : 'hidden',
    transform: modalVisible ? 'scale(1)' : 'scale(0.1)',
  };

  return <div className='modal-container' style={modalContainerStyle}></div>;
};

export default ModalContainer;
