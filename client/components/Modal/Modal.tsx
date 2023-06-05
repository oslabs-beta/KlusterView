import React from 'react';
import './Modal.scss';

interface ModalProps {
  modalVisible: boolean;
}

const Modal = ({ modalVisible }) => {
  const modalStyle = {
    visibility: modalVisible ? 'visible' : 'hidden',
    transform: modalVisible ? 'scale(1)' : 'scale(0.1)',
  };

  return (
    <div className='modal' style={modalStyle}>
      <div className='container'>
        <h2 className='modal-title'>Error Loading Kluster</h2>
        <p className='modal-text'>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam
          quis nisi pariatur culpa, nesciunt tempore placeat exercitationem
          voluptates, qui iure ullam facere aut ipsam, dolorem magni error ipsa
          officia fugit dolore molestias nostrum ipsum! Delectus dolores placeat
        </p>
        <h3 className='modal-buttons-title'>Setup Options</h3>
        <div className='modal-buttons'>
          <button className='btn'>Setup For Me</button>
          <button className='btn btn--outline'>Setup Myself</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
