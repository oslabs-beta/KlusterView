import React, { FC, useState, CSSProperties } from 'react';
import './Modal.scss';

interface ModalProps {
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
}

const Modal: FC<ModalProps> = ({ modalVisible, setModalVisible }) => {
  const [manual, setManual] = useState<boolean>(false);

  const modalStyle: CSSProperties = {
    visibility: modalVisible ? 'visible' : 'hidden',
    transform: modalVisible ? 'scale(1)' : 'scale(0.1)',
  };

  const autoSetup = (): void => {
    setModalVisible(false);
    //make request
  };

  const manualSetup = (): void => {
    setManual(true);
  };

  const postSetup = (): void => {
    setModalVisible(false);
    //make request
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
              <button className='btn' onClick={autoSetup}>
                Setup For Me
              </button>
            )}
            {!manual && (
              <button className='btn btn--outline' onClick={manualSetup}>
                Setup Myself
              </button>
            )}
            {manual && (
              <button className='btn' onClick={postSetup}>
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
