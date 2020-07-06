import React, { useState } from 'react';
import { useHistory } from  'react-router';
import constants from 'util/constants';
import SoTApi from 'services/SoTApi';

// PrimeReact
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';

const CreateCompany = props => {
  let history = useHistory();
  const [name, setName] = useState('');  
  const [type, setType] = useState(0);

  const sufficientGold = () => props.gold >= 25;

  const create = () => {
    SoTApi.doAction({ action: 'create_company', comp: { name, type } })
      .then(data => {
        if (data.success) {
          history.push(`/company/${data.comp_id}`);
        }
      });
  }

  const typeTemplate = type => {
    if (type.value === 0) {
      return <span>{ type.label }</span>;
    }
    return (
      <span>
        { type.label }
        <i className={type.css} style={{ marginLeft: '10px' }} />
      </span>
    );
  }

  return (
    <Dialog header='Create Company' visible={props.show} onHide={props.hide} style={{ width: '25vw' }} modal>
      <div className='p-grid p-dir-col p-fluid'>
        <div class='p-col'>
          <span className='p-float-label'>
            <InputText id='name' value={name} onChange={e => setName(e.target.value)} />
            <label htmlFor='name'>Company Name</label>
          </span>
        </div>
        <div className='p-col'>
          <Dropdown
            value={type}
            options={constants.COMPANY_TYPES}
            itemTemplate={typeTemplate}
            onChange={e => setType(e.value)}
          />
        </div>
        <div className='p-col'>
          <p>
            Cost:
            <span style={{ float: 'right' }}>
              {Number.parseInt('25').toFixed(2)}
              <i className='sot-coin' style={{ marginLeft: '10px' }} />
            </span>
          </p>
          <p>
            You have:
            <span style={{ float: 'right' }}>
              {props.gold.toFixed(2)}
              <i className='sot-coin' style={{ marginLeft: '10px' }} />
            </span>
          </p>
        </div>
        <div className='p-col' style={{ margin: '0 auto' }}>
          {!sufficientGold() && (
            <Message
              severity='error'
              text='You dont have sufficient gold'
              style={{ marginBottom: '10px' }}
            />
          )}
          <Button label='Create Company' disabled={!sufficientGold() || type === 0} onClick={create} />
        </div>
      </div>
    </Dialog>
  );
}

export default CreateCompany;