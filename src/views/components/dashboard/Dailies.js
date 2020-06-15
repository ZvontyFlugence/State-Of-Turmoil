import React from 'react';

// PrimeReact
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Fieldset } from 'primereact/fieldset';

const Dailies = () => {
  return (
    <Fieldset legend='Dailies'>
      <div className='p-grid p-align-stretch'>
        <div className='p-col'>
          <Checkbox inputId='train' value='Train' checked={false} disabled />
          <label htmlFor='train' className='p-checkbox-label'>Train</label>
          <br />
          <br />
          <Checkbox inputId='work' value='Work' checked={false} disabled />
          <label htmlFor='work' className='p-checkbox-label'>Work</label>
        </div>
        <div className='p-col p-col-align-center' style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button className='p-button-success' label='Collect Rewards' disabled />
        </div>
      </div>
    </Fieldset>
  );
}

export default Dailies;