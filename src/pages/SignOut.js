import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { authSignOut } from '../reducers/_auth';

class SignOut extends Component {
  componentDidMount() {
    this.props.authSignOut();
  }
  render = () => <div />;
}

SignOut.propTypes = {
  authSignOut: PropTypes.func.isRequired
};

export default connect(null, { authSignOut })(SignOut);
