import React from 'react';
import styled from 'styled-components';
import reload from '../assets/reload.svg';
import { colors } from '../styles';

const StyledReload = styled.img`
  width: 50px;
  height: 50px;
  margin: 80px auto;
  mask: url(${reload}) center no-repeat;
  mask-size: 90%;
  background-color: rgb(${colors.white});

  @media (hover: hover) {
    &:hover {
      opacity: 0.6;
    }
  }
`;

const Reload = ({ ...props }) => <StyledReload {...props} />;

export default Reload;
