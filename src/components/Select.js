import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import caretLight from '../assets/caret-light.svg';
import { fonts, colors } from '../styles';

const StyledSelect = styled.select`
  -webkit-appearance: none;
  margin: 5px;
  border-style: none;
  border: none;
  border-radius: 7px;
  background: ${({ dark }) =>
    dark
      ? `rgb(${colors.dark}) url(${caretLight})`
      : `rgba(${colors.white}, 0.2) url(${caretLight})`};
  color: ${({ dark }) => (dark ? `rgb(${colors.lightGrey})` : `rgb(${colors.white})`)};
  background-size: 12px;
  background-position: 86% 56%;
  background-repeat: no-repeat;
  padding: 5px 26px 5px 8px;
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.semibold};
  text-align: center;
  outline: none;
`;

const Select = ({ dark, selected, options, ...props }) => (
  <StyledSelect value={selected} dark={dark} {...props}>
    {options.map(option => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </StyledSelect>
);

Select.propTypes = {
  options: PropTypes.array.isRequired,
  selected: PropTypes.string.isRequired,
  dark: PropTypes.bool
};

Select.defaultProps = {
  dark: false
};

export default Select;
