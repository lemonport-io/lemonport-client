import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import cross from '../assets/cross.svg';
import { colors, shadows, transitions } from '../styles';

const StyledButtonAdd = styled.button`
  transition: ${transitions.base};
  border: none;
  border-style: none;
  box-sizing: border-box;
  border: ${({ outline }) => (outline ? `2px solid rgb(${colors.white})` : 'none')};
  background-color: ${({ outline, dark }) =>
    outline ? 'transparent' : dark ? `rgb(${colors.dark})` : `rgba(${colors.white}, 0.2)`};
  color: ${({ outline, dark }) =>
    outline || dark ? `rgba(${colors.white}, 0.2)` : `rgb(${colors.dark})`};
  box-shadow: ${({ outline }) => (outline ? 'none' : `${shadows.soft} rgba(${colors.dark}, 0.1)`)};
  border-radius: 50%;
  margin: 20px;
  width: 50px;
  height: 50px;
  cursor: pointer;
  will-change: transform;

  @media (hover: hover) {
    &:hover {
      opacity: 0.7;
    }
  }
`;

const StyledPlus = styled.img`
  width: 20px;
  height: 20px;
  transform: rotate(45deg);
  mask: url(${cross}) center no-repeat;
  mask-size: 100%;
  background-color: ${({ outline, dark }) =>
    outline || !dark ? `rgb(${colors.white})` : `rgb(${colors.lightGrey})`};
`;

const ButtonAdd = ({ children, outline, dark, ...props }) => (
  <StyledButtonAdd outline={outline} dark={dark} {...props}>
    <StyledPlus outline={outline} dark={dark} />
  </StyledButtonAdd>
);

ButtonAdd.propTypes = {
  outline: PropTypes.bool,
  dark: PropTypes.bool
};

ButtonAdd.defaultProps = {
  outline: false,
  dark: false
};

export default ButtonAdd;
