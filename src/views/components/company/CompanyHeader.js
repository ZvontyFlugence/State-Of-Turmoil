import React from 'react';
import constants from 'util/constants';

// PrimeReact
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const CompanyHeader = props => {
  let type = constants.COMPANY_TYPES[props.company.type];
  console.log('TYPE:', props.company);
  return (
    <Card>
      <div className='p-grid'>
        <div className='p-col-fixed' width='160'>
          <img src={props.company.image} height='150' style={{ borderRadius: '10px' }} alt='' />
        </div>
        <div className='p-col'>
          <h1 style={{ fontWeight: 'lighter', marginTop: '0px', textAlign: 'left' }}>
            { props.company.name }
          </h1>
          <p>Company Type: { type.label } <i className={`${type.css}`} /></p>
          <p>CEO ID: { props.company.ceo }</p>
        </div>
        {props.user && props.user._id === props.company.ceo && (
          <div className='p-col-1'>
            <div className='p-gid p-dir-col p-nogutter' style={{ textAlign: 'right' }}>
              <Button icon='pi pi-pencil' />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default CompanyHeader;