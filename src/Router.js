import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
import { getSession } from './helpers/utilities';

const Home = Loadable({
  loader: () => import('./pages/Home'),
  loading: () => null
});

const SignIn = Loadable({
  loader: () => import('./pages/SignIn'),
  loading: () => null
});

const SignUp = Loadable({
  loader: () => import('./pages/SignUp'),
  loading: () => null
});

const SetupTwoFactor = Loadable({
  loader: () => import('./pages/SetupTwoFactor'),
  loading: () => null
});

const BuyEther = Loadable({
  loader: () => import('./pages/BuyEther'),
  loading: () => null
});

const SignOut = Loadable({
  loader: () => import('./pages/SignOut'),
  loading: () => null
});

const Overview = Loadable({
  loader: () => import('./pages/Overview'),
  loading: () => null
});

const Verify = Loadable({
  loader: () => import('./pages/Verify'),
  loading: () => null
});

const NotFound = Loadable({
  loader: () => import('./pages/NotFound'),
  loading: () => null
});

class Router extends Component {
  componentDidMount() {
    window.browserHistory = this.context.router.history;
  }
  render = () => (
    <div>
      <Switch>
        <Route
          exact
          path="/"
          render={routerProps => {
            const session = getSession();
            if (session && session.expires > Date.now()) {
              if (!session.twoFactor) {
                return <Redirect to="/setup-two-factor" />;
              } else {
                return <Redirect to="/overview" />;
              }
            } else if (session && session.expires < Date.now()) {
              return <Redirect to="/signout" />;
            }
            return <Home {...routerProps} />;
          }}
        />
        <Route
          exact
          path="/signin"
          render={routerProps => {
            const session = getSession();
            if (session && session.expires > Date.now()) {
              if (!session.twoFactor) {
                return <Redirect to="/setup-two-factor" />;
              } else {
                return <Redirect to="/overview" />;
              }
            } else if (session && session.expires < Date.now()) {
              return <Redirect to="/signout" />;
            }
            return <SignIn {...routerProps} />;
          }}
        />
        <Route
          exact
          path="/signup/"
          render={routerProps => {
            const session = getSession();
            if (session && session.expires > Date.now()) {
              if (!session.twoFactor) {
                return <Redirect to="/setup-two-factor" />;
              } else {
                return <Redirect to="/overview" />;
              }
            } else if (session && session.expires < Date.now()) {
              return <Redirect to="/signout" />;
            }
            return <SignUp {...routerProps} />;
          }}
        />
        <Route
          exact
          path="/setup-two-factor"
          render={routerProps => {
            const session = getSession();
            if (session.twoFactor) {
              return <Redirect to="/overview" />;
            }
            return <SetupTwoFactor {...routerProps} />;
          }}
        />
        <Route
          exact
          path="/buy-ether"
          render={routerProps => {
            const session = getSession();
            if (!session || session.expires < Date.now()) {
              return <Redirect to="/" />;
            }
            return <BuyEther {...routerProps} />;
          }}
        />
        <Route exact path="/signout" component={SignOut} />
        <Route exact path="/verify/:hash" component={Verify} />
        <Route
          exact
          path="/overview"
          render={routerProps => {
            const session = getSession();
            if (!session || session.expires < Date.now()) {
              return <Redirect to="/" />;
            }
            if (!session.twoFactor) {
              return <Redirect to="/setup-two-factor" />;
            }
            return <Overview {...routerProps} />;
          }}
        />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

Router.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  email: PropTypes.string,
  signup: PropTypes.any
};

export default Router;
