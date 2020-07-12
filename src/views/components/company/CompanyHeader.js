import React from 'react';
import constants from 'util/constants';

// PrimeReact
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const CompanyHeader = props => {
  let type = constants.COMPANY_TYPES[props.company.type];
  
  const displayWorth = () => {
    let worth = 0;
    return worth.toFixed(2);
  }

  return (
    <Card>
      <div className='p-grid'>
        <div className='p-col-fixed' width='160'>
          <img src={props.company.image} height='150' style={{ borderRadius: '10px' }} alt='' />
        </div>
        <div className='p-col'>
          <div className='p-grid'>
            <div className='p-col-12' style={{ textAlign: 'left' }}>
              <h1 style={{ fontWeight: 'lighter', margin: '0px' }}>
                { props.company.name }
              </h1>
            </div>
            <div className='p-col' style={{ fontSize: '16px' }}>
              <span>Company Type: { type.label } <i className={`${type.css}`} /></span>
              <br />
              <br />
              <span>
                CEO:
                <span>
                  <img
                    src={props.company.ceo.image}
                    alt=''
                    style={{ height: '35px', marginLeft: '10px', marginRight: '10px', verticalAlign: 'middle', borderRadius: '5px' }}
                  />
                  { props.company.ceo.displayName }
                </span>
              </span>
            </div>
            <div className='p-col'>
              <span>Employees: { props.company.employees.length }</span>
              <br />
              <br />
              <span>Worth: {displayWorth()} USD</span>
            </div>
          </div>
        </div>
        {props.user && props.user._id === props.company.ceo._id && (
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