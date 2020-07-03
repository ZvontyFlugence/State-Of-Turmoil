import React, { useState } from 'react';
import { useHistory } from 'react-router';
import SoTApi from 'services/SoTApi';
import constants from 'util/constants';

// PrimeReact
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';

// Components
import Public from './layouts/public';

const Register = () => {
  let history = useHistory();

  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [country, setCountry] = useState(null);

  const handleRegister = () => {
    let payload = {
      email,
      displayName,
      country,
    };

    SoTApi.register(payload)
      .then(data => {
        if (data.created) {
          history.push('/login');
        }
      });
  }

  const countryTemplate = option => {
    if (!option.value) {
      return <span style={{ fontSize: '20px' }}>{option.label}</span>;
    } else {
      return (
        <div className='p-clearfix'>
          <i className={`flag-icon flag-icon-${option.code}`} style={{ float: 'none', marginRight: '10px' }} />
          <span style={{ fontSize: '20px' }}>
            { option.label }
          </span>
        </div>
      );
    }
  }

  const footer = (
    <>
      <Button label='Register' onClick={handleRegister} />
      <br />
      <p style={{ marginTop: 10 }}>
        Don't have a Turmoil Studios account?
        <a
          href='https://turmoil-studios-dev.herokuapp.com/register'
          target='_blank'
          rel='noopener noreferrer'
          style={{ marginLeft: 10 }}
        >
          Sign up here.
        </a>
      </p>
    </>
  );

  return (
    <Public>
      <div id='register' className='p-grid p-dir-col p-justify-center p-align-center'>
        <div className='p-col-12 p-md-4' style={{ textAlign: 'center', marginTop: '5vh' }}>
          <Message severity='info' text='A Turmoil Studios account is required to play SoT' />
        </div>
        <div className='p-col-12 p-md-4'>
          <Card title='Register' footer={footer}>
            <br />
            <div className='p-grid p-fluid p-dir-col'>
              <div className='p-inputgroup p-float-label'>
                <InputText id='email' value={email} onChange={e => setEmail(e.target.value)} />
                <label htmlFor='email'>Turmoil Studios Account Email</label>
              </div>
              <br />
              <div className='p-inputgroup p-float-label'>
                <InputText id='name' value={displayName} onChange={e => setDisplayName(e.target.value)} />
                <label htmlFor='name'>Diplay Name</label>
              </div>
              <br />
              <div className='p-inputgroup'>
                <Dropdown
                  value={country}
                  options={constants.COUNTRIES}
                  onChange={e => setCountry(e.target.value)}
                  itemTemplate={countryTemplate}
                  placeholder='Select a Country'
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Public>
  );
}

export default Register;