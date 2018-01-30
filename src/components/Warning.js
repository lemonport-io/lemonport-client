import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { colors } from '../styles';

const StyledWrapper = styled.div`
  position: absolute;
  top: 0;
  width: 100vw;
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
  pointer-events: ${({ show }) => (show ? 'auto' : 'none')};
`;

const StyledWarning = styled.div`
  width: 100%;
  height: 40px;
  background: ${({ color }) => `rgb(${colors[color]})`};
  color: rgb(${colors.white});
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

class Warning extends Component {
  render() {
    return (
      <StyledWrapper show={this.props.show}>
        {!!this.props.active.length
          ? this.props.active.map(warning => (
              <StyledWarning
                key={warning.key}
                color={warning.color}
                onClick={() => warning.action()}
              >
                {warning.message}
              </StyledWarning>
            ))
          : null}
      </StyledWrapper>
    );
  }
}

Warning.propTypes = {
  show: PropTypes.bool.isRequired,
  active: PropTypes.array.isRequired
};

const reduxProps = ({ warning }) => ({
  show: warning.show,
  active: warning.active
});

export default connect(reduxProps, null)(Warning);
