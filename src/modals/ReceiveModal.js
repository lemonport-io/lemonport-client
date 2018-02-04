import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Card from '../components/Card';
import ButtonClose from '../components/ButtonClose';
import QRCodeDisplay from '../components/QRCodeDisplay';
import currencies from '../libraries/currencies.json';
import { fonts, colors, responsive } from '../styles';

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

class ReceiveModal extends Component {
  onClose = () => {
    this.props.closeModal();
  };
  render = () => (
    <Card>
      <ButtonClose onClick={this.onClose} />
      <h4>{`Receive ${currencies[this.props.modalProps.currency].name}`}</h4>
      <QRCodeDisplay data={this.props.modalProps.address} />
      <StyledAddress>{this.props.modalProps.address}</StyledAddress>
    </Card>
  );
}

ReceiveModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modalProps: PropTypes.object.isRequired
};

export default ReceiveModal;
