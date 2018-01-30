import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Loader from '../components/Loader';
import { colors, fonts, shadows, responsive } from '../styles';

const StyledCard = styled.div`
  position: relative;
  width: 100%;
  border: none;
  border-style: none;
  color: rgb(${colors.dark});
  background-color: rgb(${colors.white});
  box-shadow: ${shadows.soft} rgba(${colors.dark}, 0.1);
  border-radius: 7px;
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.normal};
  padding: 30px 20px;
  margin: 5px auto;
  text-align: left;
  & > * {
    margin-top: 10px;
  }
  @media screen and (${responsive.sm.max}) {
    padding: 15px 10px;
  }
`;

const Card = ({ fetching, children, ...props }) => (
  <StyledCard {...props}>{fetching ? <Loader background={'white'} /> : children}</StyledCard>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  fetching: PropTypes.bool
};

Card.defaultProps = {
  fetching: false
};

export default Card;
