import React from 'react';
import Checkit from 'checkit';
import TextField from 'material-ui/TextField';
import LaddaButton from 'react-ladda';
import Debug from 'debug';
import alertAjax from 'components/alertAjax';
import rules from 'services/rules';
let debug = new Debug("components:register");

export default (context) => {
  const {tr} = context;
  const AlertAjax = alertAjax(context);
  return React.createClass({
    propTypes: {
      register: React.PropTypes.object.isRequired,
      actions: React.PropTypes.object.isRequired
    },
    getInitialState() {
      return {errors: {}};
    },
    render() {
      debug('render state:', this.state);
      debug('render props:', this.props);
      let {errors} = this.state;
      return (
        <div className="local-login-form register-form">
          <form>
            <div className="signup-options text-center form">
              <AlertAjax error={this.props.register.error} className='register-error-view'/>
              <div className='form-group username'>
                <TextField id='username' ref="username" hintText={tr.t('Username')} errorText={errors.username && errors.username[0]}/>
              </div>
              <div className='form-group email'>
                <TextField id='email' ref="email" hintText={tr.t('Email')} errorText={errors.email && errors.email[0]}/>
              </div>
              <div className='form-group password'>
                <TextField id='password' ref="password" hintText={tr.t('Password')} errorText={errors.password && errors.password[0]} type='password'/>
              </div>

              <div className='btn-signup'>
                <LaddaButton className='btn btn-lg btn-primary btn-register' buttonColor='green' loading={this.props.register.loading} buttonStyle="slide-up" onClick={this.register}>{tr.t('Create Account')}</LaddaButton>
              </div>
            </div>
          </form>
        </div>
      );
    },

    register(evt) {
      //TODO trim spaces
      evt.preventDefault()
      this.setState({errors: {}});

      let {username, email, password} = this.refs;
      let payload = {
        username: username.getValue(),
        email: email.getValue(),
        password: password.getValue()
      }
      let rulesRegister = new Checkit({username: rules.username, password: rules.password, email: rules.email});
      return rulesRegister.run(payload).then(this.props.actions.register).catch(errors => {
        if (errors instanceof Checkit.Error) {
          this.setState({errors: errors.toJSON()})
        } else {
          throw errors;
        }
      });

    }
  });
}
