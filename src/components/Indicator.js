import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { colors, fonts, transitions } from '../styles';

const blink = keyframes`
  0% {
    background-color: rgba(${colors.white}, 0.2);
  }
  25% {
    background-color: rgba(${colors.white}, 0.2);
  }
  35% {
    background-color: rgb(${colors.dark});
  }
  45% {
    background-color: rgba(${colors.white}, 0.2);
  }
  50% {
    background-color: rgba(${colors.white}, 0.2);
  }
  60% {
    background-color: rgb(${colors.dark});
  }
  70% {
    background-color: rgba(${colors.white}, 0.2);
  }
  100% {
    background-color: rgba(${colors.white}, 0.2);
  }
`;

const StyledRelative = styled.div`
  position: relative;
`;

const StyledParagraph = styled.p`
  font-size: ${fonts.size.small};
  font-family: monospace;
  margin: 3px 8px;
  position: absolute;
`;

const StyledFetching = styled(StyledParagraph)`
  transition: ${transitions.base};
  opacity: ${({ fetching }) => (fetching ? 1 : 0)};
  visibility: ${({ fetching }) => (fetching ? 'visible' : 'hidden')};
  pointer-events: ${({ fetching }) => (fetching ? 'auto' : 'none')};
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
  width: 20px;
  height: 20px;
  border-radius: 100%;
  background-color: ${({ error }) => (error ? `rgba(${colors.red}, 0.5)` : `rgba(${colors.white}, 0.2)`)};
  animation: ${({ fetching }) => (fetching ? `${blink} 1s infinite ease-in-out` : 'none')};
`;

const StyledWrapper = styled.div`
  display: flex;
  cursor: ${({ fetching }) => (fetching ? 'auto' : 'pointer')};
  @media (hover: hover) {
    &:hover ${StyledPrompt} {
      opacity: ${({ fetching }) => (fetching ? 0 : 1)};
      visibility: ${({ fetching }) => (fetching ? 'hidden' : 'visible')};
      pointer-events: ${({ fetching }) => (fetching ? 'none' : 'auto')};
    }
    &:hover ${StyledError} {
      opacity: 0;
      visibility: 'hidden';
      pointer-events: 'none';
    }
  }
`;

const Indicator = ({ fetching, error, messages, action, ...props }) => (
  <StyledWrapper fetching={fetching} {...props} onClick={action}>
    <StyledIndicator error={error} fetching={fetching} />
    <StyledRelative>
      <StyledFetching fetching={fetching}>{messages.fetching}</StyledFetching>
      <StyledPrompt error={error}>{messages.prompt}</StyledPrompt>
      <StyledError error={error}>{messages.error}</StyledError>
    </StyledRelative>
  </StyledWrapper>
);

Indicator.propTypes = {
  fetching: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  action: PropTypes.func,
  messages: PropTypes.objectOf(PropTypes.string)
};

Indicator.defaultProps = {
  action: () => {},
  messages: {
    fetching: 'Scanning',
    prompt: 'Scan',
    error: 'Failed'
  }
};

export default Indicator;
