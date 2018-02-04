import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import reload from '../assets/reload.svg';
import { overviewGetSingleAccount } from '../reducers/_overview';
import { colors, fonts, transitions } from '../styles';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const StyledRelative = styled.div`
  position: relative;
`;

const StyledParagraph = styled.p`
  font-size: ${fonts.size.small};
  text-align: right;
  margin: 0 6px;
  position: absolute;
  right: 0;
`;

const StyledFetching = styled(StyledParagraph)`
  transition: ${transitions.base};
  opacity: ${({ active }) => (active ? 1 : 0)};
  visibility: ${({ active }) => (active ? 'visible' : 'hidden')};
  pointer-events: ${({ active }) => (active ? 'auto' : 'none')};
`;

const StyledPrompt = styled(StyledParagraph)`
  transition: ${transitions.base};
  color: ${({ error }) => (error ? `rgb(${colors.red})` : 'inherit')};
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
`;

const StyledError = styled(StyledParagraph)`
  color: rgb(${colors.red});
  transition: ${transitions.base};
  opacity: ${({ error }) => (error ? 1 : 0)};
  visibility: ${({ error }) => (error ? 'visible' : 'hidden')};
  pointer-events: ${({ error }) => (error ? 'auto' : 'none')};
`;

const StyledIndicator = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 100%;
  mask: url(${reload}) center no-repeat;
  background: rgb(${colors.white});
  mask-size: 100%;
  animation: ${({ active }) => (active ? `${spin} 0.5s infinite linear` : 'none')};
`;

const StyledWrapper = styled.div`
  display: flex;
  cursor: ${({ active }) => (active ? 'auto' : 'pointer')};
  @media (hover: hover) {
    &:hover ${StyledPrompt} {
      opacity: ${({ active }) => (active ? 0 : 1)};
      visibility: ${({ active }) => (active ? 'hidden' : 'visible')};
      pointer-events: ${({ active }) => (active ? 'none' : 'auto')};
    }
    &:hover ${StyledError} {
      opacity: 0;
      visibility: 'hidden';
      pointer-events: 'none';
    }
  }
`;

const Indicator = ({ overviewGetSingleAccount, fetching, currency, error, ...props }) => {
  const active = fetching === currency || fetching === 'all';
  return (
    <StyledWrapper active={active} {...props} onClick={() => overviewGetSingleAccount(currency)}>
      <StyledRelative>
        <StyledFetching active={active}>{`Syncing`}</StyledFetching>
        <StyledPrompt error={error}>{`Sync`}</StyledPrompt>
        <StyledError error={error}>{`Failed`}</StyledError>
      </StyledRelative>
      <StyledIndicator error={error} active={active} />
    </StyledWrapper>
  );
};

Indicator.propTypes = {
  overviewGetSingleAccount: PropTypes.func.isRequired,
  fetching: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  error: PropTypes.bool.isRequired
};

const reduxProps = ({ overview }) => ({
  fetching: overview.fetching,
  error: overview.error
});

export default connect(reduxProps, { overviewGetSingleAccount })(Indicator);
