import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Card from '../components/Card';
import Button from '../components/Button';
import Indicator from '../components/Indicator';
import { fonts, responsive } from '../styles';
import { modalOpen } from '../reducers/_modal';
import { overviewChangeNativeCurrency } from '../reducers/_overview';
import { notificationShow } from '../reducers/_notification';
import { convertToNative } from '../helpers/utilities';
import currencies from '../libraries/currencies.json';

const StyledAccount = styled.div`
  width: 100%;
`;

const StyledColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledIndicator = styled(Indicator)`
  position: absolute;
  top: 0;
  right: 15px;
`;

const StyledFlex = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const StyledActions = styled.div`
  width: 100%;
  margin: 15px 0;
  display: flex;
  justify-content: space-between;
  & button {
    font-size: ${fonts.size.h6};
    width: 100%;
    padding: 0.6em 1em;
    margin: 0;
  }
  & button:first-of-type {
    margin-right: 10px;
  }
  & button:last-of-type {
    margin-left: 10px;
  }
  @media screen and (${responsive.xs.max}) {
    margin-top: 30px;
  }
`;

const StyledBalance = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin: 10px 0;
  text-align: right;
  & > div:first-child {
    font-weight: 500;
    font-size: 1.25em;
  }
`;

class Account extends Component {
  onBuyEther = () => window.browserHistory.push(`/buy-ether?address=${this.props.account.address}`);
  openSendModal = () =>
    this.props.modalOpen('SEND', {
      currency: this.props.account.currency,
      address: this.props.account.address
    });
  openReceiveModal = () =>
    this.props.modalOpen('RECEIVE', {
      currency: this.props.account.currency,
      address: this.props.account.address
    });
  changeNativeCurrency = () => {
    const activeCurrency = currencies.indexOf(this.props.nativeCurrency);
    const index = activeCurrency + 1 < currencies.length ? activeCurrency + 1 : 0;
    const nextCurrency = currencies[index];
    overviewChangeNativeCurrency(nextCurrency);
  };
  shouldComponentUpdate(nextProps) {
    if (
      nextProps.nativeCurrency !== this.props.nativeCurrency &&
      nextProps.prices === this.props.prices
    )
      return false;
    return true;
  }
  render = () => (
    <StyledAccount>
      <Card color={this.props.account.currency}>
        <StyledIndicator currency={this.props.account.currency} />

        <StyledColumn>
          <StyledFlex>
            <h4>{currencies[this.props.account.currency].name}</h4>
            <StyledBalance>
              <div>{`${this.props.account.balance} ${this.props.account.currency}`}</div>
              <div onClick={this.changeNativeCurrency}>
                {convertToNative(this.props.account.balance, this.props.account.currency).string}
              </div>
            </StyledBalance>
          </StyledFlex>

          <StyledActions>
            <Button outline onClick={this.openSendModal}>
              Send
            </Button>
            <Button outline onClick={this.onBuyEther}>
              Exchange
            </Button>
            <Button outline onClick={this.openReceiveModal}>
              Receive
            </Button>
          </StyledActions>
        </StyledColumn>
      </Card>
    </StyledAccount>
  );
}

Account.propTypes = {
  account: PropTypes.object.isRequired,
  modalOpen: PropTypes.func.isRequired,
  overviewChangeNativeCurrency: PropTypes.func.isRequired,
  notificationShow: PropTypes.func.isRequired,
  prices: PropTypes.object.isRequired,
  nativeCurrency: PropTypes.string.isRequired
};

const reduxProps = ({ overview }) => ({
  prices: overview.prices,
  nativeCurrency: overview.nativeCurrency
});

export default connect(reduxProps, {
  modalOpen,
  notificationShow,
  overviewChangeNativeCurrency
})(Account);
