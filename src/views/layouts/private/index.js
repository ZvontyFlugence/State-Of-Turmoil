import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import actions from 'store/auth/actions';

// PrimeReact
import { ScrollPanel } from 'primereact/scrollpanel';

// Components
import SoTHeader from '../shared/SoTHeader';
import SoTFooter from '../shared/SoTFooter';
import Sidebar from './Sidebar';

const Private = props => {
  let history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      history.push('/login');
    } else {
      if (!props.isAuthenticated && !props.isLoading) {
        props.validate()
          .then(data => {
            if (data.error) {
              history.push('/login');
            }
          });
      }
    }
  });

  return (
    <div className='p-grid p-dir-col'>
      <div id='header' className='p-col-12'>
        <SoTHeader />
      </div>
      <div id='main' className='p-col-12'>
        <div className='p-grid p-nogutter p-align-stretch'>
          <Sidebar />
          <div className='p-col'>
            <ScrollPanel style={{ width: '100%', height: '83vh' }}>
              { props.children }
            </ScrollPanel>
          </div>
        </div>
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
  validate: () => dispatch(actions.validate()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Private);