import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Loader from './Loader';
import { colors, fonts, shadows, transitions } from '../styles';

const StyledButton = styled.button`
  transition: ${transitions.base};
  border: none;
  border-style: none;
  box-sizing: border-box;
  border: ${({ outline }) => (outline ? `1px solid rgb(${colors.white})` : 'none')};
  background-color: ${({ outline, dark }) =>
    outline ? 'transparent' : dark ? `rgb(${colors.dark})` : `rgb(${colors.white})`};
  color: ${({ outline, dark }) =>
    outline || dark ? `rgb(${colors.white})` : `rgb(${colors.dark})`};
  box-shadow: ${({ outline }) => (outline ? 'none' : `${shadows.soft} rgba(${colors.dark}, 0.1)`)};
  border-radius: 7px;
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.normal};
  padding: 10px;
  margin: 5px;
  width: 150px;
  height: 36px;
  cursor: ${({ disabled }) => (disabled ? 'auto' : 'pointer')};
  will-change: transform;

  &:disabled {
    opacity: 0.7;
  }

  &:active {
    opacity: 1;
  }

  @media (hover: hover) {
    &:hover {
      opacity: 0.7;
    }
  }
`;

const Button = ({ children, fetching, outline, type, dark, disabled, round, ...props }) => (
  <StyledButton type={type} outline={outline} dark={dark} disabled={disabled} {...props}>
    {fetching ? (
      <Loader size={40} color={dark ? 'white' : 'dark'} background={dark ? 'dark' : 'white'} />
    ) : (
      children
    )}
  </StyledButton>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  fetching: PropTypes.bool,
  outline: PropTypes.bool,
  type: PropTypes.string,
  dark: PropTypes.bool,
  disabled: PropTypes.bool
};

Button.defaultProps = {
  fetching: false,
  outline: false,
  type: 'button',
  dark: false,
  disabled: false
};

export default Button;
