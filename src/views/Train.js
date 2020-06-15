import React from 'react';
import { connect } from 'react-redux';
import SoTApi from 'services/SoTApi';
import actions from 'store/auth/actions';

// PrimeReact
import { Button } from 'primereact/button';

// Components
import Private from './layouts/private';

const Train = props => {

  const handleTraining = () => {
    SoTApi.doAction({ action: 'TRAIN' }).then(data => {
      if (data.success) {
        props.loadUser();
      }
    });
  }

  return (
    <Private>
      <div id='train' style={{ paddingLeft: '1vw', paddingRight: '1vw' }}>
        <h1>Training Center</h1>
        <div className='p-grid p-dir-col' style={{ margin: '0 auto', textAlign: 'center' }}>
          <div className='p-col'>
            <p>Current Strength: { props.user && props.user.strength }</p>
          </div>
          <div className='p-col'>
            <Button label='Train' onClick={handleTraining} />
          </div>
        </div>
      </div>
    </Private>
  );
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

const mapDispatchToProps = dispatch => ({
  loadUser: () => dispatch(actions.loadUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Train);