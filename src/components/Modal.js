import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Column from '../components/Column';
import SendModal from '../modals/SendModal';
import ReceiveModal from '../modals/ReceiveModal';
import SetupTwoFactorModal from '../modals/SetupTwoFactorModal';
import { colors, transitions } from '../styles';

const StyledLightbox = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  transition: ${transitions.base};
  opacity: ${({ modal }) => (modal ? 1 : 0)};
  visibility: ${({ modal }) => (modal ? 'visible' : 'hidden')};
  pointer-events: ${({ modal }) => (modal ? 'auto' : 'none')};
  background: rgba(${colors.dark}, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

class Modal extends Component {
  modalController = () => {
    switch (this.props.modal) {
      case 'SEND':
        return <SendModal modalProps={this.props.modalProps} closeModal={this.props.closeModal} />;
      case 'RECEIVE':
        return (
          <ReceiveModal modalProps={this.props.modalProps} closeModal={this.props.closeModal} />
        );
      case 'SETUP_TWO_FACTOR':
        return (
          <SetupTwoFactorModal
            modalProps={this.props.modalProps}
            closeModal={this.props.closeModal}
          />
        );
      default:
        return <div />;
    }
  };
  render = () => {
    const body = document.body || document.getElementsByTagName('body')[0];
    if (this.props.modal) {
      body.style['overflow-y'] = 'hidden';
    } else {
      body.style['overflow-y'] = 'auto';
    }
    return (
      <StyledLightbox modal={this.props.modal}>
        <Column center>{this.modalController()}</Column>
      </StyledLightbox>
    );
  };
}

Modal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.string.isRequired,
  modalProps: PropTypes.object.isRequired
};

export default Modal;
