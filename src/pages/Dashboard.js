import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Column from '../components/Column';
import ButtonAdd from '../components/ButtonAdd';
import Account from '../components/Account';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Select from '../components/Select';
import Indicator from '../components/Indicator';
import BaseLayout from '../layout/base';
import { userCheckEmail, userCheckTwoFactor, userClearState } from '../reducers/_user';
import {
  dashboardDisplayAccounts,
  dashboardGetAllAccounts,
  dashboardChangeNativeCurrency
} from '../reducers/_dashboard';
import { modalOpen, modalClose } from '../reducers/_modal';
import { warningClear } from '../reducers/_warning';
import nativeCurrencies from '../libraries/native.json';

const StyledColumn = styled(Column)`
  padding-top: 14px;
`;

const StyledWrapper = styled.div`
  width: 100%;
  margin: 20px auto;
`;

const StyledCard = styled(Card)`
  margin: 10px auto;
  text-align: center;
`;

const StyledIndicator = styled(Indicator)`
  position: absolute;
  left: 5px;
  top: 0px;
  margin: 0;
`;

const StyledSelect = styled(Select)`
  position: absolute;
  right: 0;
  top: -7px;
  margin: 0;
`;

class Dashboard extends Component {
  componentDidMount() {
    this.props.userCheckEmail();
    this.props.userCheckTwoFactor();
    this.props.dashboardDisplayAccounts();
  }
  openNewAccountModal = () => this.props.modalOpen('NEW_ACCOUNT', {});
  changeNativeCurrency = ({ target }) => this.props.dashboardChangeNativeCurrency(target.value);
  componentWillUnmount() {
    this.props.warningClear();
    this.props.userClearState();
  }
  render() {
    return (
      <BaseLayout>
        <StyledColumn>
          <StyledIndicator
            fetching={this.props.fetching}
            action={this.props.dashboardGetAllAccounts}
            error={this.props.error}
          />
          <StyledSelect
            selected={this.props.nativeCurrency}
            options={nativeCurrencies}
            onChange={this.changeNativeCurrency}
          />
          {!!this.props.accounts.length ? (
            this.props.accounts.map(account => <Account key={account.address} account={account} />)
          ) : (
            <StyledCard>Generate, Import or Add account bellow</StyledCard>
          )}
          <StyledWrapper>
            <ButtonAdd onClick={this.openNewAccountModal} />
          </StyledWrapper>
        </StyledColumn>
        <Modal
          modal={this.props.modal}
          modalProps={this.props.modalProps}
          closeModal={this.props.modalClose}
        />
      </BaseLayout>
    );
  }
}

Dashboard.propTypes = {
  userCheckEmail: PropTypes.func.isRequired,
  userCheckTwoFactor: PropTypes.func.isRequired,
  userClearState: PropTypes.func.isRequired,
  dashboardDisplayAccounts: PropTypes.func.isRequired,
  dashboardGetAllAccounts: PropTypes.func.isRequired,
  dashboardChangeNativeCurrency: PropTypes.func.isRequired,
  warningClear: PropTypes.func.isRequired,
  modalOpen: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  accounts: PropTypes.array.isRequired,
  nativeCurrency: PropTypes.string.isRequired,
  error: PropTypes.bool.isRequired,
  modal: PropTypes.string.isRequired,
  modalProps: PropTypes.object.isRequired
};

const reduxProps = ({ dashboard, modal }) => ({
  fetching: dashboard.fetching,
  accounts: dashboard.accounts,
  nativeCurrency: dashboard.nativeCurrency,
  error: dashboard.error,
  modal: modal.modal,
  modalProps: modal.modalProps
});

export default connect(reduxProps, {
  userCheckEmail,
  userCheckTwoFactor,
  userClearState,
  dashboardDisplayAccounts,
  dashboardGetAllAccounts,
  dashboardChangeNativeCurrency,
  warningClear,
  modalOpen,
  modalClose
})(Dashboard);
