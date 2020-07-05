import React from 'react';
import { connect } from 'react-redux';

// PrimeReact
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DataView } from 'primereact/dataview';

// Components
import Private from './layouts/private';

const MyCompanies = props => {

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
    <Private>
      <div id='myCompanies' style={{ paddingLeft: '1vw', paddingRight: '1vw' }}>
        <h1>My Companies</h1>
        <div className='p-grid'>
          <div className='p-col-10 p-offset-1' style={{ textAlign: 'right' }}>
            <Button label='Create Company' />
          </div>
          <div className='p-col-10 p-offset-1'>
            {props.user && props.user.companies.length > 0 ? (
              <DataView
                value={props.user.companies}
                header={renderHeader()}
                itemTemplate={companyTemplate}
                rows={Math.min(props.user.companies.length, 10)}
                paginatorPosition='bottom'
                paginator
              />
            ) : (
              <Card>You don't own any Companies</Card>
            )}
          </div>
        </div>
      </div>
    </Private>
  );
}

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(MyCompanies);