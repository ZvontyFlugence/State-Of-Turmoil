import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SoTApi from 'services/SoTApi';

// PrimeReact
import { ProgressSpinner } from 'primereact/progressspinner';

// Components
import CompanyHeader from './components/company/CompanyHeader';
import CompanyInfo from './components/company/CompanyInfo';
import Private from './layouts/private';

const Company = props => {
  const id = props.match.params.id;
  const [company, setCompany] = useState(null);
  const [manageMode, setManageMode] = useState(false);
  const [reload, setReload] = useState(true);

  useEffect(() => {
    if (reload) {
      SoTApi.getCompany(id)
        .then(data => {
          if (data.company) {
            setCompany(data.company);
            setReload(false);
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
              <CompanyHeader
                user={props.user}
                company={company}
                manageMode={manageMode}
                setManageMode={setManageMode}
                setReload={setReload}
              />
            </div>
            <div className='p-col-12'>
              <CompanyInfo inventory={company.inventory} funds={company.funds} manageMode={manageMode} setReload={bool => setReload(bool)} />
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