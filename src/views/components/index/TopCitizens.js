import React, { useState, useEffect } from 'react';
import SoTApi from 'services/SoTApi';

// PrimeReact
import { Card } from 'primereact/card';
import { ListBox } from 'primereact/listbox';

const TopCitizens = () => {
  const [options, setOptions] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      SoTApi.getCitizenStats({ stat: 'xp', limit: 5 })
        .then(data => {
          if (data.citizens) {
            let citizens = data.citizens.map(c => ({ id: c._id, name: c.displayName, image: c.image, xp: c.xp }));
            setOptions(citizens);
            setLoaded(true);
          }
        });
    }
  });

  const template = citizen => (
    <div className='p-grid p-align-center'>
      <div className='p-col-3' style={{ paddingBottom: '0px', paddingTop: '10px' }}>
        <img src={citizen.image} alt='' style={{ width: '50px' }} />
      </div>
      <div className='p-col'>
        <span style={{ textAlign: 'center', fontSize: '24px' }}>{ citizen.name }</span>
      </div>
    </div>
  );

  return (
    <Card title='Top Citizens'>
      <ListBox
        className='sot-fake-disabled'
        options={options}
        itemTemplate={template}
        optionLabel='name'
        optionValue='id'
        style={{ width: 'inherit' }}
        listStyle={{ overflow: 'hidden' }}
        disabled
      />
    </Card>
  );
}

export default TopCitizens;