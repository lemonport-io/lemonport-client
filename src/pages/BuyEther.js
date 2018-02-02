import React, { Component } from 'react';
import styled from 'styled-components';
import Reload from '../components/Reload';
import BaseLayout from '../layout/base';
import Link from '../components/Link';
import { getSession, getUrlParameter } from '../helpers/utilities';
import { colors, transitions, fonts } from '../styles';

const StyledWrapper = styled.div`
  width: 100%;
  margin: 20px auto;
  position: relative;
  height: 200px;
`;

const StyledLink = styled(Link)`
  transition: ${transitions.base};
  display: block;
  border: none;
  border-style: none;
  box-sizing: border-box;
  background: transparent;
  color: rgb(${colors.white});
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.normal};
  margin: 5px;
  cursor: pointer;
  will-change: transform;

  @media (hover: hover) {
    &:hover {
      opacity: 0.7;
    }
  }
`;

const StyledActions = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 0;
`;

class BuyEther extends Component {
  state = {
    email: getSession() ? getSession().email : '',
    address: getUrlParameter('address') || getSession() ? getSession().accounts[0].address : {}
  };
  onReceiveMessage = e => {
    if (e.origin === 'https://buy.coinbase.com') {
      if (e.data.status === 'buy_completed') {
        console.log('buy_completed');
        // TODO
        // Success message and redirect to dashboard
      } else if (e.data.status === 'buy_canceled') {
        console.log('buy_canceled');
        // TODO
        // Handle canceled purchase
      }
      return;
    }
  };
  componentWillMount() {
    window.addEventListener('message', this.onReceiveMessage, false);

    const script = document.createElement('script');
    script.src = 'https://use.typekit.net/foobar.js';
    script.async = true;
    var url = 'https://buy.coinbase.com/static/widget.js';
    script.src =
      url + (url.indexOf('?') >= 0 ? '&' : '?') + 'ref=' + encodeURIComponent(window.location.href);

    document.body.appendChild(script);
  }
  componentWillUnmount() {
    window.removeEventListener('message', this.onReceiveMessage, false);
  }
  render() {
    return (
      <BaseLayout>
        {!!this.state.address ? (
          <StyledWrapper>
            <h4>Don't have Ether yet?</h4>
            <p>{`Address: ${this.state.address}`}</p>
            <a
              className="coinbase-widget"
              id="coinbase_widget"
              data-prefill_email={this.state.email}
              data-address={this.state.address}
              data-amount="50"
              data-code="a35eb8aa-eba8-5dbd-aa2b-c6656ac6c07a"
              data-currency="USD"
              data-crypto_currency="ETH"
              href=""
            >
              Buy ETH with Coinbase
            </a>
            <StyledActions>
              <StyledLink to="/dashboard">Skip</StyledLink>
            </StyledActions>
          </StyledWrapper>
        ) : (
          <StyledWrapper>
            <h4>Failed to load</h4>
            <Reload onClick={() => window.location.reload()} />
          </StyledWrapper>
        )}
      </BaseLayout>
    );
  }
}

export default BuyEther;
