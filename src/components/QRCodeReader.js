import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import QrReader from 'react-qr-reader';
import Column from './Column';
import ButtonClose from './ButtonClose';
import { colors } from '../styles';

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  margin: 0 auto !important;
  background: rgb(${colors.black});
`;

const StyledButtonClose = styled(ButtonClose)`
  z-index: 10;
`;

class QRCodeReader extends Component {
  state = {
    delay: 500
  };
  stopRecording = () => this.setState({ delay: false });
  handleScan = data => {
    if (data) {
      this.stopRecording();
      this.props.onScan(data);
    }
  };
  handleError = err => {
    console.error(err);
    this.props.onError(err);
  };
  onClose = () => {
    this.stopRecording();
    this.props.onClose();
  };
  componentWillUnmount() {
    this.stopRecording();
  }
  render() {
    return (
      <StyledWrapper>
        <StyledButtonClose white size={30} onClick={this.onClose} />
        <Column center>
          <QrReader
            delay={this.state.delay}
            onError={this.handleError}
            onScan={this.handleScan}
            style={{ width: '100%' }}
          />
        </Column>
      </StyledWrapper>
    );
  }
}

QRCodeReader.propTypes = {
  onScan: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default QRCodeReader;
