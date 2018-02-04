import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Account from '../components/Account';
import Modal from '../components/Modal';
import DashboardLayout from '../layout/dashboard';
import { userCheckEmail, userCheckTwoFactor, userClearState } from '../reducers/_user';
import { overviewDisplayAccounts } from '../reducers/_overview';
import { modalOpen, modalClose } from '../reducers/_modal';
import { warningClear } from '../reducers/_warning';
import { responsive } from '../styles';

const StyledHorizontalGrid = styled.div`
  display: grid;
  grid-template-columns: 300px;
  grid-auto-columns: 300px;
  grid-auto-flow: column;
  grid-gap: 20px;
  width: 100%;
  overflow-y: scroll;
  @media screen and (${responsive.xs.max}) {
    grid-template-columns: calc(100vw - 40px);
    grid-auto-columns: calc(100vw - 40px);
  }
`;

class Overview extends Component {
  componentDidMount() {
    this.props.userCheckEmail();
    this.props.userCheckTwoFactor();
    this.props.overviewDisplayAccounts();
  }
  openNewAccountModal = () => this.props.modalOpen('NEW_ACCOUNT', {});
  componentWillUnmount() {
    this.props.warningClear();
    this.props.userClearState();
  }
  render() {
    return (
      <DashboardLayout>
        <StyledHorizontalGrid>
          {this.props.accounts.map(account => <Account key={account.address} account={account} />)}
        </StyledHorizontalGrid>
        <Modal
          modal={this.props.modal}
          modalProps={this.props.modalProps}
          closeModal={this.props.modalClose}
        />
      </DashboardLayout>
    );
  }
}

Overview.propTypes = {
  userCheckEmail: PropTypes.func.isRequired,
  userCheckTwoFactor: PropTypes.func.isRequired,
  userClearState: PropTypes.func.isRequired,
  overviewDisplayAccounts: PropTypes.func.isRequired,
  warningClear: PropTypes.func.isRequired,
  modalOpen: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
  accounts: PropTypes.array.isRequired,
  error: PropTypes.bool.isRequired,
  modal: PropTypes.string.isRequired,
  modalProps: PropTypes.object.isRequired
};

const reduxProps = ({ overview, modal }) => ({
  accounts: overview.accounts,
  error: overview.error,
  modal: modal.modal,
  modalProps: modal.modalProps
});

export default connect(reduxProps, {
  userCheckEmail,
  userCheckTwoFactor,
  userClearState,
  overviewDisplayAccounts,
  warningClear,
  modalOpen,
  modalClose
})(Overview);
