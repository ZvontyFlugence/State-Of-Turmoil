import React, { useRef } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import SoTApi from 'services/SoTApi';
import authActions from 'store/auth/actions';

// PrimeReact
import { Button } from 'primereact/button';
import { ContextMenu } from 'primereact/contextmenu';

const AlertItem = props => {
  let cm = useRef(null);

  const items = [
    {
      label: 'Mark as Read',
      icon: 'pi pi-eye',
      command: () => {
        props.alert.index = props.index;
        SoTApi.doAction({ action: 'read_alert', alert: props.alert })
          .then(data => {
            if (data.success) {
              props.loadUser();
            }
          });
      }
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => {
        props.alert.index = props.index;
        SoTApi.doAction({ action: 'delete_alert', alert: props.alert })
          .then(data => {
            if (data.success) {
              props.loadUser();
            }
          });
      }
    },
  ];

  const getTimestamp = () => {
    return <span>{ moment(props.alert.timestamp).fromNow() }</span>
  }

  const getActions = type => {
    switch (type) {
      case 'SEND_FRIEND_REQUEST':
        return (
          <>
            <Button className='p-button-success' icon='pi pi-check' style={{ marginRight: '10px' }} onClick={acceptFR} />
            <Button className='p-button-danger' icon='pi pi-times' onClick={declineFR} />
          </>
        );
      default:
        return <></>;
    }
  };

  const acceptFR = () => {
    let payload = {
      action: 'friend_request_response',
      response_data: {
        response: 'accept',
        alert_index: props.index,
        friend_id: props.alert.from,
      }
    };
    SoTApi.doAction(payload)
      .then(data => {
        if (data.success) {
          props.loadUser();
        }
      });
  }

  const declineFR = () => {
    let payload = {
      action: 'friend_request_response',
      response_data: {
        response: 'decline',
        alert_index: props.index,
        friend_id: props.alert.from,
      },
    };
    SoTApi.doAction(payload)
      .then(data => {
        if (data.success) {
          props.loadUser();
        }
      });
  }

  return (
    <>
      <ContextMenu className='alert-context' model={items} ref={cm} />
      <div className='p-clearfix' onContextMenu={e => cm.current.show(e)}>
        <div className='p-grid p-justify-start' style={{ textAlign: 'left' }}>
          <div className='p-col-2 p-col-align-center' style={{ paddingBottom: '0px' }}>
            { getTimestamp() }
          </div>
          <div className='p-col p-col-align-center' style={{ paddingBottom: '0px', fontWeight: props.alert.read ? 'lighter' : 'bold' }}>
            { props.alert.message }
          </div>
          <div className='p-col-2' style={{ paddingBottom: '0px', textAlign: 'right' }}>
            { getActions(props.alert.type) }
          </div>
        </div>
      </div>
    </>
  );
};

const mapDispatchToProps = dispatch => ({
  loadUser: () => dispatch(authActions.loadUser()),
});

export default connect(null, mapDispatchToProps)(AlertItem);