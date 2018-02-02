import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledForm = styled.form`
  width: 100%;
  padding: 10px;
  display: block;
  & button {
    float: right;
  }
`;

class Form extends Component {
  componentWillUnmount() {
    document.activeElement.blur();
  }
  render = () => {
    const { children, ...props } = this.props;
    return (
      <StyledForm noValidate {...props}>
        {children}
      </StyledForm>
    );
  };
}

Form.propTypes = {
  children: PropTypes.node.isRequired
};

export default Form;
