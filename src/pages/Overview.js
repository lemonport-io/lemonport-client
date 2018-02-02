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
import DashboardLayout from '../layout/dashboard';
import { userCheckEmail, userCheckTwoFactor, userClearState } from '../reducers/_user';
import {
  overviewDisplayAccounts,
  overviewGetAllAccounts,
  overviewChangeNativeCurrency
} from '../reducers/_overview';
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

class Overview extends Component {
  componentDidMount() {
    this.props.userCheckEmail();
    this.props.userCheckTwoFactor();
    this.props.overviewDisplayAccounts();
  }
  openNewAccountModal = () => this.props.modalOpen('NEW_ACCOUNT', {});
  changeNativeCurrency = ({ target }) => this.props.overviewChangeNativeCurrency(target.value);
  componentWillUnmount() {
    this.props.warningClear();
    this.props.userClearState();
  }
  render() {
    return (
      <DashboardLayout>
        <StyledColumn>
          <StyledIndicator
            fetching={this.props.fetching}
            action={this.props.overviewGetAllAccounts}
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
      </DashboardLayout>
    );
  }
}

Overview.propTypes = {
  userCheckEmail: PropTypes.func.isRequired,
  userCheckTwoFactor: PropTypes.func.isRequired,
  userClearState: PropTypes.func.isRequired,
  overviewDisplayAccounts: PropTypes.func.isRequired,
  overviewGetAllAccounts: PropTypes.func.isRequired,
  overviewChangeNativeCurrency: PropTypes.func.isRequired,
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

const reduxProps = ({ overview, modal }) => ({
  fetching: overview.fetching,
  accounts: overview.accounts,
  nativeCurrency: overview.nativeCurrency,
  error: overview.error,
  modal: modal.modal,
  modalProps: modal.modalProps
});

export default connect(reduxProps, {
  userCheckEmail,
  userCheckTwoFactor,
  userClearState,
  overviewDisplayAccounts,
  overviewGetAllAccounts,
  overviewChangeNativeCurrency,
  warningClear,
  modalOpen,
  modalClose
})(Overview);
