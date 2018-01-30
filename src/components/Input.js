import React from 'react';
import styled from 'styled-components';
import { colors, fonts, shadows, responsive } from '../styles';

const StyledInput = styled.input`
  width: 100%;
  background: rgb(${colors.white});
  padding: 10px 20px;
  border: none;
  border-style: none;
  font-size: ${fonts.size.h6};
  border-radius: 7px;
  -webkit-box-shadow: ${shadows.soft} rgba(${colors.dark}, 0.1);
  box-shadow: ${shadows.soft} rgba(${colors.dark}, 0.1);
  outline: none;
  &::placeholder {
    text-transform: uppercase;
    color: rgb(${colors.dark});
    opacity: 1;
  }
  @media screen and (${responsive.sm.max}) {
    padding: 8px 10px;
  }
`;

const Input = props => <StyledInput {...props} />;

export default Input;
