import React, { Component } from 'react';
import Input from './Input';

class InputTwoFactor extends Component {
  componentDidMount() {
    this.twoFactorInput.focus();
  }
  _onChange = ({ target }) => {
    const code = target.value.replace(/[^0-9.]/g, '');
    if (code.length <= 6) {
      this.props.onChange(code);
    }
  };
  render() {
    return (
      <Input
        innerRef={c => (this.twoFactorInput = c)}
        placeholder={this.props.placeholder || '6 Digit Code'}
        type={this.props.type || 'text'}
        value={this.props.value}
        onChange={this._onChange}
      />
    );
  }
}

export default InputTwoFactor;
