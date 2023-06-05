import React from 'react';

interface ModalContainerProps {
  modalVisible: boolean;
}

const ModalContainer = ({ modalVisible }) => {
  const modalContainerStyle = {
    visibility: modalVisible ? 'visible' : 'hidden',
    transform: modalVisible ? 'scale(1)' : 'scale(0.1)',
  };

  return <div className='modal-container' style={modalContainerStyle}></div>;
};

export default ModalContainer;
