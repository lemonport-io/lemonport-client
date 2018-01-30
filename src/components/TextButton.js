import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Loader from './Loader';
import { colors, fonts, transitions } from '../styles';

const StyledTextButton = styled.button`
  transition: ${transitions.base};
  display: block;
  border: none;
  border-style: none;
  box-sizing: border-box;
  background: transparent;
  color: ${({ color }) => `rgb(${colors[color]})`};
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.normal};
  margin: 5px;
  cursor: pointer;
  will-change: transform;

  @media (hover: hover) {
    &:hover {
      opacity: 0.6;
    }
  }
`;

const TextButton = ({ children, fetching, ...props }) => (
  <StyledTextButton {...props}>{fetching ? <Loader size={40} /> : children}</StyledTextButton>
);

TextButton.propTypes = {
  children: PropTypes.node.isRequired,
  fetching: PropTypes.bool,
  color: PropTypes.string
};

TextButton.defaultProps = {
  fetching: false,
  color: 'dark'
};

export default TextButton;
