import React, { useState } from 'react';
import moment from 'moment';

// PrimeReact
import { Checkbox } from 'primereact/checkbox';

const AlertItem = props => {
  const [checked, setChecked] = useState(false);

  const handleCheck = e => {
    setChecked(e.checked);
    // TODO: Call Parent Funtion to add alert to selected array
  }

  const getTimestamp = () => {
    return <span>{ moment(props.alert.timestamp).fromNow() }</span>
  }

  const getActions = type => {
    switch (type) {
      case 'SEND_FRIEND_REQUEST':
        return (
          <>
            <i className='pi pi-check' style={{ color: 'green', marginRight: '10px' }} />
            <i className='pi pi-times' style={{ color: 'red' }} />
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <div className='p-clearfix'>
      <div className='p-grid p-justify-start' style={{ textAlign: 'left' }}>
        <div className='p-col-fixed' style={{ width: '30px', paddingBottom: '0px' }}>
          <Checkbox onChange={handleCheck} checked={checked} />
        </div>
        <div className='p-col-2' style={{ paddingBottom: '0px' }}>
          { getTimestamp() }
        </div>
        <div className='p-col' style={{ paddingBottom: '0px', fontWeight: props.alert.read ? 'lighter' : 'bold' }}>
          { props.alert.message }
        </div>
        <div className='p-col-2' style={{ paddingBottom: '0px', textAlign: 'right' }}>
          { getActions(props.alert.type) }
        </div>
      </div>
    </div>
  );
};

export default AlertItem;