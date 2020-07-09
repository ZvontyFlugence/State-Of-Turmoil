import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SoTApi from 'services/SoTApi';

// PrimeReact
import { ProgressSpinner } from 'primereact/progressspinner';

// Components
import CompanyHeader from './components/company/CompanyHeader';
import Private from './layouts/private';

const Company = props => {
  const id = props.match.params.id;
  const [company, setCompany] = useState(null);

  useEffect(() => {
    if (!company) {
      SoTApi.getCompany(id)
        .then(data => {
          if (data.company) {
            setCompany(data.company);
          }
        });
    }
  });

  if (company) {
    return (
      <Private>
        <div id='company' style={{ paddingLeft: '1vw', paddingRight: '1vw' }}>
          <div className='p-grid p-dir-col'>
            <div className='p-col-12'>
              <CompanyHeader user={props.user} company={company} />
            </div>
            <div className='p-col-12'>
              <div classame='p-grid'>
                Info Sections Here
              </div>
            </div>
          </div>
        </div>
      </Private>
    );
  } else {
    return <ProgressSpinner />
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Company);