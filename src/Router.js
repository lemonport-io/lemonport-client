import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
import Warning from './components/Warning';
import Notification from './components/Notification';
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

const Dashboard = Loadable({
  loader: () => import('./pages/Dashboard'),
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
      <Warning />
      <Switch>
        <Route
          exact
          path="/"
          render={routerProps => {
            const session = getSession();
            if (session && session.expires > Date.now()) {
              return <Redirect to="/dashboard" />;
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
              return <Redirect to="/dashboard" />;
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
              return <Redirect to="/dashboard" />;
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
              return <Redirect to="/dashboard" />;
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
          path="/dashboard"
          render={routerProps => {
            const session = getSession();
            if (!session || session.expires < Date.now()) {
              return <Redirect to="/" />;
            }
            return <Dashboard {...routerProps} />;
          }}
        />
        <Route component={NotFound} />
      </Switch>
      <Notification />
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
