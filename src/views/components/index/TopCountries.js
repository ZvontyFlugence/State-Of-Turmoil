import React, { useState, useEffect } from 'react'
import SoTApi from 'services/SoTApi';

// PrimeReact
import { Card } from 'primereact/card';
import { ListBox } from 'primereact/listbox';

const defaultOptions = [
  { name: 'United States', code: 'us'},
  { name: 'Spain', code: 'es' },
  { name: 'Brazil', code: 'br' },
  { name: 'Poland', code: 'pl' },
  { name: 'Iran', code: 'ir' }
];

const template = option => (
  <div className='country'>
    <i className={`flag-icon flag-icon-${option.code} top-countries-flag`} />
    <span>{ option.name }</span>
  </div>
);

const TopCountries = () => {
  const [options, setOptions] = useState(defaultOptions);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      SoTApi.getCountryStats({ stat: 'population', limit: 5 })
        .then(data => {
          if (data.countries) {
            let countries = data.countries.map(c => ({ name: c.name, code: c.flag_code }));
            setOptions(countries);
            setLoaded(true);
          }
        });
    }
  });

  return (
    <Card title='Top Countries'>
      <ListBox
        className='sot-fake-disabled'
        options={options}
        itemTemplate={template}
        optionLabel='name'
        optionValue='code'
        style={{ width: 'inherit' }}
        listStyle={{ overflow: 'hidden' }}
        disabled
      />
    </Card>
  );
};

export default TopCountries;
