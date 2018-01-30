import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { colors, shadows, fonts, transitions } from '../styles';

const StyledPopUp = styled.div`
  transition: ${transitions.base};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 1;
  top: 35px;
  color: rgb(${colors.dark});
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
  pointer-events: ${({ show }) => (show ? 'auto' : 'none')};
  background-color: rgb(${colors.white});
  box-shadow: ${shadows.soft} rgba(${colors.dark}, 0.1);
  border-radius: 7px;
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.normal};
  padding: 35px;
  margin: 5px auto;
  overflow: hidden;
`;

const PopUp = ({ children, show, ...props }) => (
  <StyledPopUp show={show} {...props}>
    {children}
  </StyledPopUp>
);

PopUp.propTypes = {
  children: PropTypes.node.isRequired,
  show: PropTypes.bool.isRequired
};

export default PopUp;
