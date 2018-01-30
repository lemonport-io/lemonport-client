import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { colors } from '../styles';

const expand = keyframes`
0% {
  width: 0;
  height: 0;
  opacity: 1;
}
100% {
  width: 100%;
  height: 100%;
  opacity: 0;
}
`;

const StyledLoader = styled.div`
  position: relative;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  & div {
    box-sizing: content-box;
    position: absolute;
    border-width: ${({ size }) => `${size * 0.05}px`};
    border-style: solid;
    opacity: 1;
    border-radius: 50%;
    animation: ${expand} 1.25s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }
  & div:nth-child(1) {
    border-color: ${({ color }) => `rgb(${colors[color]})`};
  }
  & div:nth-child(2) {
    border-color: ${({ color }) => `rgb(${colors[color]})`};
    animation-delay: -0.4s;
  }
`;

const Loader = ({ size, color, ...props }) => (
  <StyledLoader size={size} color={color} {...props}>
    <div />
    <div />
  </StyledLoader>
);

Loader.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string
};

Loader.defaultProps = {
  size: 100,
  color: 'white'
};

export default Loader;
