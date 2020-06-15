import React, { useState } from 'react';

// PrimeReact
import { Button } from 'primereact/button';
import { Fieldset } from 'primereact/fieldset';
import { InputTextarea } from 'primereact/inputtextarea';

const Shouts = () => {
  const [shout, setShout] = useState('');

  return (
    <Fieldset legend='Shouts'>
      <div className='p-grid p-dir-col'>
        <div className='p-col-12'>
          <InputTextarea
            rows={2}
            col={30}
            value={shout}
            style={{ width: '100%' }}
            onChange={e => setShout(e.target.value)}
            maxLength={140}
            autoResize
          />
        </div>
        <div className='p-col-3 p-offset-9'>
          <Button className='p-button-info' label='Shout' style={{ width: '100%' }} />
        </div>
      <hr style={{ borderColor: '#666666', width: '100%' }} />
      </div>
    </Fieldset>
  );
}

export default Shouts;