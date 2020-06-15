import React from 'react';
import moment from 'moment';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import authActions from 'store/auth/actions';

// PrimeReact
import { Button } from 'primereact/button';

// Styles
import 'styles/header.css';

const SoTHeader = props => {
  let history = useHistory();

  const handleBrandLink = () => {
    if (props.isAuthenticated) {
      history.push('/dashboard');
    } else {
      history.push('/');
    }
  }

  const handleLogout = () => {
    props.logout();
    history.push('/');
  }

  const navActions = props.isAuthenticated ? (
    <>
      <div className='p-col-2'>
        <p><i className='pi pi-calendar' style={{ verticalAlign: 'bottom' }}/> {`${moment().format('MM/DD/YYYY')}` }</p>
      </div>
      <div className='p-col-2'>
        <p><i className='pi pi-clock' style={{ verticalAlign: 'bottom' }} /> {`${moment().format('HH:mm')}`}</p>
      </div>
      <div className='p-col-1'>
        <Button className='p-button-info' icon='pi pi-sign-out' onClick={handleLogout} style={{ marginTop: 10 }} />
      </div>
    </>
  ) : (
    <Button className='p-button-success' icon='pi pi-sign-in' onClick={() => history.push('/login')} />
  );
  
  return (
    <div className='p-grid p-align-center navbar'>
      <div className='p-col-9 p-md-3'>
        <div className='navbar-brand' onClick={handleBrandLink}>
          <img className='brand' src='/SoT.svg' alt='' />
          <span className='brand-text'>State of Turmoil</span>
        </div>
      </div>
      <div className='p-col-3 p-md-9'>
        <div className='p-grid p-justify-end'>
          { navActions }
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(authActions.logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SoTHeader);