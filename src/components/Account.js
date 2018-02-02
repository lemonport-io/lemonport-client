import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Card from '../components/Card';
import Button from '../components/Button';
import { responsive, fonts, colors } from '../styles';
import { modalOpen } from '../reducers/_modal';
import { notificationShow } from '../reducers/_notification';

const StyledFlex = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledActions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  & button {
    width: 100%;
  }
  @media screen and (${responsive.sm.max}) {
    & button {
      font-size: ${fonts.size.h6};
    }
  }
`;

const StyledBalance = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
`;

const StyledAccount = styled.div`
  width: 100%;
  margin: 10px auto;
`;

const StyledLine = styled.div`
  width: 100%;
  border-top: 1px solid rgb(${colors.lightGrey});
`;

class Account extends Component {
  onBuyEther = () => window.browserHistory.push(`/buy-ether?address=${this.props.account.address}`);
  openSendModal = () =>
    this.props.modalOpen('SEND_ETHER', {
      name: this.props.account.name,
      address: this.props.account.address,
      type: this.props.account.type,
      tokens: this.props.account.tokens
    });
  openReceiveModal = () =>
    this.props.modalOpen('RECEIVE_ETHER', {
      name: this.props.account.name,
      address: this.props.account.address
    });
  getPrice = (amount, symbol) => {
    const priceObject = this.props.prices[symbol];
    const native = this.props.nativeCurrency;
    const _amount = Number(amount.replace(/[^0-9.]/gi, ''));
    const decimals = native === 'ETH' || native === 'BTC' ? 8 : 2;
    if (priceObject) {
      const result = String(_amount * priceObject[native]);
      return `${BigNumber(result).toFormat(decimals)} ${native}`;
    }
    return null;
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
      <Card outline>
        <StyledFlex>
          <StyledFlex>
            <div>
              <h4>{this.props.account.currency}</h4>
            </div>
          </StyledFlex>
          <StyledBalance>
            <div>{`${this.props.account.balance} ETH`}</div>
            <div>{this.getPrice(this.props.account.balance, 'ETH')}</div>
          </StyledBalance>
          {!!this.props.account.tokens && <StyledLine />}
          {!!this.props.account.tokens &&
            this.props.account.tokens.map(token => (
              <StyledBalance key={`${this.props.account.address}-${token.symbol}`}>
                <div>{`${token.balance} ${token.symbol}`}</div>
                <div>{this.getPrice(token.balance, token.symbol)}</div>
              </StyledBalance>
            ))}
        </StyledFlex>
      </Card>
      <StyledActions>
        <Button outline onClick={this.openSendModal}>
          Send
        </Button>
        <Button outline onClick={this.onBuyEther}>
          Buy Ether
        </Button>
        <Button outline onClick={this.openReceiveModal}>
          Receive
        </Button>
      </StyledActions>
    </StyledAccount>
  );
}

Account.propTypes = {
  account: PropTypes.object.isRequired,
  modalOpen: PropTypes.func.isRequired,
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
  notificationShow
})(Account);
