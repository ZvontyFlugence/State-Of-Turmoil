import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import authActions from 'store/auth/actions';

// PrimeReact
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Messages } from 'primereact/messages';
import { Password } from 'primereact/password';

// Components
import Public from './layouts/public';

const Login = props => {
  let history = useHistory();
  let messages = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const credentials = { email, password };

    props.login(credentials)
      .then(data => {
        if (props.growl) {
          if (!data.error) {
            props.growl.show({
              severity: 'success',
              summary: 'Login Success',
              detail: `Welcome, ${data.user.displayName}!`
            });
            history.push('/dashboard');
          } else {
            messages.current.show({
              sticky: true,
              severity: 'error',
              summary: 'Login Failed',
              detail: data.error,
            });
          }
        } else {
          console.log('GROWN NOT SET');
        }
      });
  }

  const footer = (
    <span>
      <Button label='Login' onClick={handleLogin} />
    </span>
  );

  return (
    <Public>
      <div id='login' className='p-grid p-dir-col p-justify-center p-align-center'>
        <Messages ref={messages} />
        <div className='p-col-12 p-md-4'>
          <Card title='Login' footer={footer} style={{ marginTop: '5vh' }}>
            <br />
            <div className='p-grid p-fluid p-dir-col'>
              <div className='p-inputgroup p-float-label'>
                <InputText id='email' value={email} onChange={e => setEmail(e.target.value)} />
                <label htmlFor='email'>Email</label>
              </div>
              <br />
              <div className='p-inputgroup p-float-label'>
                <Password id='password' value={password} onChange={e => setPassword(e.target.value)} />
                <label htmlFor='password'>Password</label>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Public>
  );
}

const mapStateToProps = state => ({
  growl: state.growl.el,
});

const mapDispatchToProps = dispatch => ({
  login: credentials => dispatch(authActions.login(credentials)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);