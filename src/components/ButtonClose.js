import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import cross from '../assets/cross.svg';
import { colors, transitions } from '../styles';

const StyledClose = styled.img`
  transition: ${transitions.base};
  position: absolute;
  top: 15px;
  right: 15px;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  mask: url(${cross}) center no-repeat;
  mask-size: 95%;
  background-color: ${({ white }) => (white ? `rgb(${colors.white})` : `rgb(${colors.dark})`)};

  @media (hover: hover) {
    &:hover {
      opacity: 0.7;
    }
  }
`;

const ButtonClose = ({ white, size, ...props }) => (
  <StyledClose white={white} size={size} {...props} />
);

ButtonClose.propTypes = {
  white: PropTypes.bool
};

ButtonClose.defaultProps = {
  white: false,
  size: 18
};

export default ButtonClose;
