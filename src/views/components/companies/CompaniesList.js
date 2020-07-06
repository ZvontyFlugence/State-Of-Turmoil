import React from 'react';

// PrimeReact
import { DataView } from 'primereact/dataview';

const CompaniesList = props => {

  const renderHeader = () => (
    <div className='p-grid' style={{ margin: '0px' }}>
      <div className='p-col' style={{ padding: '0px', margin: '0px' }}>
        <span>Company</span>
      </div>
      <div className='p-col' style={{ padding: '0px', margin: '0px' }}>
        <span>Type</span>
      </div>
      <div className='p-col' style={{ padding: '0px', margin: '0px' }}>
        <span></span>
      </div>
    </div>
  );

  const companyTemplate = comp => (
    <div className='p-grid'>
      <div className='p-col'>
        { comp.name }
      </div>
      <div className='p-col'>
        { comp.type }
      </div>
    </div>
  );

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