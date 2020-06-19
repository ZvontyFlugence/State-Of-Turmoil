import React from 'react'

// PrimeReact
import { Card } from 'primereact/card';
import { ListBox } from 'primereact/listbox';

const options = [
  { name: 'United States', code: 'us'},
  { name: 'Serbia', code: 'rs' },
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

const TopCountries = () => (
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

export default TopCountries;
