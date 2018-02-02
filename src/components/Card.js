import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Loader from '../components/Loader';
import { colors, fonts, shadows, responsive } from '../styles';

const StyledCard = styled.div`
  position: relative;
  width: 100%;
  border-style: none;
  border-radius: 7px;
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.normal};
  padding: 30px 20px;
  margin: 5px auto;
  text-align: left;
  color: ${({ outline }) => (outline ? `rgb(${colors.white})` : `rgb(${colors.dark})`)};
  border: ${({ outline }) => (outline ? `1px solid rgb(${colors.white})` : 'none')};
  box-shadow: ${({ outline }) => (outline ? 'none' : `${shadows.soft} rgba(${colors.dark}), 0.1)`)};
  background-color: ${({ outline }) => (outline ? 'transparent' : `rgb(${colors.white})`)};
  & > * {
    margin-top: 10px;
  }
  @media screen and (${responsive.sm.max}) {
    padding: 15px 10px;
  }
`;

const Card = ({ fetching, outline, children, ...props }) => (
  <StyledCard outline={outline} {...props}>
    {fetching ? <Loader background={'white'} /> : children}
  </StyledCard>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  fetching: PropTypes.bool,
  outline: PropTypes.bool
};

Card.defaultProps = {
  fetching: false,
  outline: false
};

export default Card;
