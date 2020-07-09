import React from 'react';
import { useHistory } from 'react-router';
import constants from 'util/constants';

// PrimeReact
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';

const CompaniesList = props => {
  let history = useHistory();

  const renderHeader = () => (
    <div className='p-grid' style={{ margin: '0px', textAlign: 'left' }}>
      <div className='p-col' style={{ padding: '0px', margin: '0px' }}>
        <span>Company</span>
      </div>
      <div className='p-col' style={{ padding: '0px', margin: '0px' }}>
        <span>Type</span>
      </div>
      <div className='p-col-1' style={{ padding: '0px', margin: '0px' }}>
        <span></span>
      </div>
    </div>
  );

  const companyTemplate = comp => {
    let type = constants.COMPANY_TYPES[comp.type];
    let isFirst = props.companies.indexOf(comp) === 0;
    return (
      <div className='p-grid p-align-center' style={{ fontSize: '16px', paddingTop: isFirst ? '10px' : '5px' }}>
        <div className='p-col'>
          <img src={comp.image} alt='' style={{ height: '50px', verticalAlign: 'middle', marginRight: '10px' }} />
          { comp.name }
        </div>
        <div className='p-col'>
          { type.label }
          <i className={type.css} style={{ marginLeft: '10px' }} />
        </div>
        <div className='p-col-1' style={{ textAlign: 'center' }}>
          <Button label='View' onClick={() => history.push(`/company/${comp._id}`)} />
        </div>
      </div>
    );
  }

  return (
    <DataView
      value={props.companies}
      header={renderHeader()}
      itemTemplate={companyTemplate}
      rows={Math.min(props.companies.length, 10)}
      paginatorPosition='bottom'
      paginator
    />
  );
}

export default CompaniesList;