import React from 'react';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';

// PrimeReact
import { Button } from 'primereact/button';
import { ListBox } from 'primereact/listbox';
import { ProgressSpinner } from 'primereact/progressspinner';

// Components
import AlertItem from './components/alerts/AlertItem';
import Private from './layouts/private';

const Alerts = props => {
  let history = useHistory();

  const acceptFR = () => {
    console.log('Friendship Request Accepted!');
  }

  const declineFR = () => {
    console.log('Friendship Request Declined.');
  }

  const alertTemplate = alert => {
    return (
      <AlertItem alert={alert} />
    );
  };

  if (props.user) { 
    return (
      <Private>
        <div id='alerts' style={{ paddingLeft: '1vw', paddingRight: '1vw' }}>
          <h1>Alerts</h1>
          <div className='p-grid p-justify-center'>
            <div className='p-col-9'>
              <div className='p-grid p-justify-end' style={{ padding: '5px 10px' }}>
                <Button className='p-button-secondary' label='Select All' style={{ fontSize: '12px' }} />
                <div className='p-col'></div>
                <Button label='Mark as Read' style={{ fontSize: '12px', marginRight: '10px' }} />
                <Button className='p-button-danger' label='Delete Selected' style={{ fontSize: '12px' }} />
              </div>
              <ListBox value={null} options={props.user.alerts} itemTemplate={alertTemplate} style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </Private>
    );
  } else {
    return (
      <Private>
        <div id='alerts' style={{ paddingLeft: '1vw', paddingRight: '1vw' }}>
          <h1>Alerts</h1>
          <ProgressSpinner />
        </div>
      </Private>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
})

export default connect(mapStateToProps)(Alerts);