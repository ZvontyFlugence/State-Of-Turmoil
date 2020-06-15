import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import authActions from 'store/auth/actions';

// PrimeReact
import { ScrollPanel } from 'primereact/scrollpanel';

// Components
import SoTFooter from '../shared/SoTFooter';
import SoTHeader from '../shared/SoTHeader';

const Public = props => {
  let history = useHistory();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      // Check if redux store is set
      if (props.isAuthenticated && !props.isLoading) {
        history.push('/dashboard');
      } else {
        props.validate();
      }
    }
  });

  return (
    <div className='p-grid p-dir-col'>
      <div id='header' className='p-col-12'>
        <SoTHeader />
      </div>
      <div id='main' className='p-col-12'>
        <ScrollPanel style={{ width: '100%', height: '83vh' }}>
          { props.children }
        </ScrollPanel>
      </div>
      <div id='footer' className='p-col-12'>
        <SoTFooter />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
});

const mapDispatchToProps = dispatch => ({
  validate: () => dispatch(authActions.validate()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Public);