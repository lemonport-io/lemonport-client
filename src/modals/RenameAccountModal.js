import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Form from '../components/Form';
import cross from '../assets/cross.svg';
import { dashboardRenameAccount } from '../reducers/_dashboard';
import { responsive } from '../styles';

const StyledClose = styled.img`
  position: absolute;
  top: 5px;
  right: 15px;
  width: 18px;
  height: 18px;

  @media (hover: hover) {
    &:hover {
      opacity: 0.6;
    }
  }
`;

const StyledForm = styled(Form)`
  @media screen and (${responsive.sm.min}) {
    padding: 20px;
  }
`;

class RenameAccountModal extends Component {
  state = {
    name: ''
  };
  onSubmit = e => {
    e.preventDefault();
    this.props.dashboardRenameAccount(this.props.modalProps.address, this.state.name);
  };
  onClose = () => {
    this.setState({ name: '' });
    this.props.closeModal();
  };
  render = () => (
    <Card>
      <StyledClose onClick={this.onClose} src={cross} />
      <StyledForm onSubmit={this.onSubmit}>
        <h4>{`Rename wallet: ${this.props.modalProps.name}`}</h4>
        <Input
          placeholder="New Name"
          type="text"
          value={this.state.name}
          onChange={({ target }) => this.setState({ name: target.value })}
        />
        <Button fetching={this.props.fetching} type="submit">
          Submit
        </Button>
      </StyledForm>
    </Card>
  );
}

RenameAccountModal.propTypes = {
  dashboardRenameAccount: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  modalProps: PropTypes.object.isRequired,
  fetching: PropTypes.bool.isRequired
};

const reduxProps = ({ dashboard }) => ({
  fetching: dashboard.fetching
});

export default connect(reduxProps, {
  dashboardRenameAccount
})(RenameAccountModal);
