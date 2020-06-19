import React from 'react';
import { connect } from 'react-redux';
import SoTApi from 'services/SoTApi';
import authActions from 'store/auth/actions';

// PrimeReact
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ListBox } from 'primereact/listbox';
import { ProgressSpinner } from 'primereact/progressspinner';

// Components
import AlertItem from './components/alerts/AlertItem';
import Private from './layouts/private';

const Alerts = props => {

  const markAllAsRead = () => {
    Promise.all(props.user.alerts.forEach(async (alert, index) => {
      alert.index = index;
      return await SoTApi.doAction({ action: 'read_alert', alert });
    }))
      .then(values => {
        if (values.every(d => d.success)) {
          props.loadUser();
        }
      });
  }

  const deleteAll = () => {
    Promise.all(props.user.alerts.forEach(async (alert, index) => {
      alert.index = index;
      return await SoTApi.doAction({ action: 'delete_alert', alert });
    }))
      .then(values => {
        if (values.every(d => d.success)) {
          props.loadUser();
        }
      })
  }

  const alertTemplate = alert => {
    let index = props.user.alerts.indexOf(alert);

    return (
      <AlertItem alert={alert} index={index} />
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
                <Button label='Mark All as Read' style={{ fontSize: '12px', marginRight: '10px' }} onClick={markAllAsRead} />
                <Button className='p-button-danger' label='Delete All' style={{ fontSize: '12px' }} onClick={deleteAll} />
              </div>
              {(props.user.alerts.length > 0) ? (
                <ListBox value={null} options={props.user.alerts} itemTemplate={alertTemplate} style={{ width: '100%' }} />
              ) : (
                <Card>
                  You do not have any alerts
                </Card>
              )}
              
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
});

const mapDispatchToProps = dispatch => ({
  loadUser: () => dispatch(authActions.loadUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);