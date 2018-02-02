import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { colors, fonts, shadows, responsive } from '../styles';

const StyledInput = styled.input`
  width: 100%;
  background: ${({ transparent }) => (transparent ? `transparent` : `rgb(${colors.white})`)};
  padding: ${({ transparent }) => (transparent ? `10px` : `10px 20px`)};
  border: none;
  border-style: none;
  margin: 10px auto;
  font-size: ${fonts.size.h6};
  color: ${({ transparent }) => (transparent ? `rgb(${colors.white})` : `rgb(${colors.dark})`)};
  border-bottom: ${({ transparent }) => (transparent ? `1px solid rgb(${colors.white})` : `0`)};
  border-radius: ${({ transparent }) => (transparent ? `0` : `7px`)};
  -webkit-box-shadow: ${({ transparent }) =>
    transparent ? `none` : `${shadows.soft} rgba(${colors.dark}, 0.1)`};
  box-shadow: ${({ transparent }) =>
    transparent ? `none` : `${shadows.soft} rgba(${colors.dark}, 0.1)`};
  outline: none;
  &::placeholder {
    text-transform: uppercase;
    color: ${({ transparent }) => (transparent ? `rgb(${colors.white})` : `rgb(${colors.dark})`)};
    opacity: 1;
  }
  @media screen and (${responsive.sm.max}) {
    padding: ${({ transparent }) => (transparent ? `8px` : `8px 10px`)};
  }
`;

const Input = ({ transparent, ...props }) => <StyledInput transparent={transparent} {...props} />;

Input.propTypes = {
  transparent: PropTypes.bool
};

Input.defaultProps = {
  transparent: false
};

export default Input;
