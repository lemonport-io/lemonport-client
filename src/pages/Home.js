import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '../components/Button';
import Link from '../components/Link';
import Column from '../components/Column';
import BaseLayout from '../layout/base';
import { initFB, checkStatusFB, loginFB, fetchFB } from '../helpers/facebook';
import facebookWhite from '../assets/facebook-white.svg';
import { apiCheckUser } from '../helpers/api';
import { colors, fonts } from '../styles';

const StyledColumn = styled(Column)`
  & div,
  & h1,
  & h4 {
    margin: 10px;
  }
`;

const StyledFlex = styled.div`
  width: 75%;
  display: flex;
  flex-direction: column;
`;

const StyledButton = styled(Button)`
  width: 236px;
  height: 40px;
  border-radius: 4px;
  font-weight: ${fonts.weight.semibold};
`;

const StyledFacebook = styled(StyledButton)`
  background-color: rgb(${colors.facebook});
  background-image: url(${facebookWhite});
  background-size: 24px;
  background-position: 8px;
  background-repeat: no-repeat;
  color: rgb(${colors.white});
  padding-left: 42px;
`;

class Home extends Component {
  componentDidMount() {
    initFB();
  }
  onFacebookLogin = () => {
    initFB()
      .then(() =>
        checkStatusFB().then(() =>
          loginFB().then(response => {
            if (response.status === 'connected') {
              console.log(response);
              fetchFB('/me?fields=email').then(data => {
                console.log(data);
                apiCheckUser(data.email).then(({ data }) => {
                  if (data.message === 'USER_FOUND') {
                    window.browserHistory.push('/signin');
                  } else {
                    window.browserHistory.push('/signup');
                  }
                });
              });
            }
          })
        )
      )
      .catch(error => console.error(error));
  };
  render = () => (
    <BaseLayout>
      <StyledColumn>
        <h4>social cryptocurrency online payments platform</h4>
        <StyledFlex>
          <Link to="/signin">
            <StyledButton>Sign In with Email</StyledButton>
          </Link>
          <div onClick={this.onFacebookLogin}>
            <StyledFacebook>Sign in with Facebook</StyledFacebook>
          </div>
        </StyledFlex>
      </StyledColumn>
    </BaseLayout>
  );
}

export default Home;
