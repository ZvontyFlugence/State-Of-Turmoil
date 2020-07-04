import React from 'react';
import { connect } from 'react-redux';
import SoTApi from 'services/SoTApi';
import actions from 'store/auth/actions';

// PrimeReact
import { Button } from 'primereact/button';
import { Fieldset } from 'primereact/fieldset';

// Components
import Private from './layouts/private';

const Home = props => {

  const handleTraining = () => {
    SoTApi.doAction({ action: 'train' }).then(data => {
      if (data.success) {
        props.growl.show({ severity: 'success', summary: 'Training Complete' });
        props.loadUser();
      }
    });
  }

  return (
    <Private>
      <div id='home' style={{ paddingLeft: '1vw', paddingRight: '1vw' }}>
        <h1>My Home</h1>
        <div className='p-grid p-dir-col'>
          <div className='p-col-10 p-offset-1'>
            <div className='p-grid'>
              <div className='p-col-3' style={{ textAlign: 'center' }}>
                <Fieldset legend='Gym'>
                  <p>Current Strength: { props.user && props.user.strength } <i className='sot-strength' /></p>
                  <Button label='Train' onClick={handleTraining} disabled={props.user && props.user.canTrain > new Date(Date.now())} />
                </Fieldset>
              </div>
              <div className='p-col'>
                <Fieldset legend='Work'>
                  
                </Fieldset>
              </div>
            </div>
          </div>
          <div className='p-col-10 p-offset-1'>
            <Fieldset legend='Inventory'>

            </Fieldset>
          </div>
        </div>
      </div>
    </Private>
  );
};

const mapStateToProps = state => ({
  growl: state.growl.el,
  user: state.auth.user,
});

const mapDispatchToProps = dispatch => ({
  loadUser: () => dispatch(actions.loadUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);