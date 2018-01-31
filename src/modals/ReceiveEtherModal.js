import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Card from '../components/Card';

import QRCodeDisplay from '../components/QRCodeDisplay';
import cross from '../assets/cross.svg';
import { fonts, colors, responsive } from '../styles';

const StyledClose = styled.img`
  position: absolute;
  top: 5px;
  right: 15px;
  width: 18px;
  height: 18px;

  @media (hover: hover) {
    &:hover {
      opacity: 0.6;
    }
  }
`;

const StyledAddress = styled.div`
  font-weight: ${fonts.weight.semibold};
  text-align: center;
  letter-spacing: 2px;
  background: rgb(${colors.white});
  @media screen and (${responsive.sm.min}) {
    padding: 20px;
  }
  @media screen and (${responsive.sm.max}) {
    font-size: 10px;
  }
`;

class ReceiveEtherModal extends Component {
  onClose = () => {
    this.props.closeModal();
  };
  render = () => (
    <Card>
      <StyledClose onClick={this.onClose} src={cross} />
      <h4>{`Receive to ${this.props.modalProps.name}`}</h4>
      <QRCodeDisplay data={this.props.modalProps.address} />
      <StyledAddress>{this.props.modalProps.address}</StyledAddress>
    </Card>
  );
}

ReceiveEtherModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modalProps: PropTypes.object.isRequired
};

export default ReceiveEtherModal;
