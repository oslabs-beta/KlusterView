import React, { FC, useState, CSSProperties } from 'react';
import './Modal.scss';

interface ModalProps {
  modalVisible: boolean;
  fetchStatus: (endpoint: string, postRequest: boolean) => void;
}

const Modal: FC<ModalProps> = ({ modalVisible, fetchStatus }) => {
  const [manual, setManual] = useState<boolean>(false);

  const modalStyle: CSSProperties = {
    visibility: modalVisible ? 'visible' : 'hidden',
    transform: modalVisible ? 'scale(1)' : 'scale(0.1)',
  };

  const handleAutoSetup = (): void => {
    fetchStatus('/status/setup', true);
  };

  const handleManualSetup = (): void => {
    setManual(true);
  };

  const checkStatus = (): void => {
    fetchStatus('/status', false);
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

        <div className='modal-setup'>
          <h3 className='modal-buttons-title'>
            {!manual ? 'Setup Options' : 'Have you finished setting up?'}
          </h3>
          <div className='modal-buttons'>
            {!manual && (
              <button className='btn' onClick={handleAutoSetup}>
                Setup For Me
              </button>
            )}
            {!manual && (
              <button className='btn btn--outline' onClick={handleManualSetup}>
                Setup Myself
              </button>
            )}
            {manual && (
              <button className='btn' onClick={checkStatus}>
                Yes, I've finished!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
