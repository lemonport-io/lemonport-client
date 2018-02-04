import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Loader from '../components/Loader';
import { colors, fonts, shadows } from '../styles';

const StyledCard = styled.div`
  position: relative;
  width: 100%;
  border: none;
  border-style: none;
  border-radius: 7px;
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.normal};
  padding: 15px;
  margin: 0 auto;
  text-align: left;
  color: ${({ color }) => (color ? `rgb(${colors.white})` : `rgb(${colors.dark})`)};
  box-shadow: ${shadows.soft} rgba(${colors.dark}, 0.1);
  background-color: ${({ color }) => (color ? `rgb(${colors[color]})` : `rgb(${colors.white})`)};
  & > * {
    margin-top: 10px;
  }
`;

const Card = ({ fetching, color, children, ...props }) => (
  <StyledCard color={color} {...props}>
    {fetching ? <Loader background={'white'} /> : children}
  </StyledCard>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  fetching: PropTypes.bool,
  color: PropTypes.string
};

Card.defaultProps = {
  fetching: false,
  color: ''
};

export default Card;
