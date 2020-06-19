import React from 'react';
import { useHistory } from 'react-router';

// PrimeReact
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Fieldset } from 'primereact/fieldset';

const Dailies = () => {
  let history = useHistory();

  return (
    <Fieldset legend='Dailies'>
      <div className='p-grid p-align-stretch'>
        <div className='p-col'>
          <div className='p-grid p-dir-col'>
            <div className='p-col'>
              <Checkbox inputId='train' value='Train' checked={false} disabled />
              <label htmlFor='train' className='p-checkbox-label'>Train</label>
            </div>
            <div className='p-col'>
              <Checkbox inputId='work' value='Work' checked={false} disabled />
              <label htmlFor='work' className='p-checkbox-label'>Work</label>
            </div>
          </div>
          
        </div>
        <div className='p-col p-col-align-center' style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {false ? (
            <Button className='p-button-success' label='Collect Rewards' disabled />
          ) : (
            <Button label='Complete Tasks' onClick={() => history.push('/home')} />
          )}
        </div>
      </div>
    </Fieldset>
  );
}

export default Dailies;