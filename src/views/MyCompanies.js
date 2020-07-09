import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SoTApi from 'services/SoTApi';

// PrimeReact
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

// Components
import CompaniesList from './components/companies/CompaniesList';
import CreateCompany from './components/companies/CreateCompany';
import Private from './layouts/private';

const MyCompanies = props => {
  const [showModal, setShowModal] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [reload, setReload] = useState(true);

  useEffect(() => {
    if (props.user && reload) {
      // TODO: Get Companies with matching CEO
      SoTApi.getCompanies(props.user._id)
        .then(data => {
          if (data.companies) {
            setCompanies(data.companies);
          }
        });
      setReload(false);
    }
  }, [props.user, reload]);

  return (
    <Private>
      <div id='myCompanies' style={{ paddingLeft: '1vw', paddingRight: '1vw' }}>
        <h1>My Companies</h1>
        <div className='p-grid'>
          <div className='p-col-10 p-offset-1' style={{ textAlign: 'right' }}>
            <Button label='Create Company' onClick={() => setShowModal(true)} />
          </div>
          <div className='p-col-10 p-offset-1'>
            {companies.length > 0 ? (
              <CompaniesList companies={companies} />
            ) : (
              <Card>You don't own any Companies</Card>
            )}
          </div>
        </div>
      </div>
      <CreateCompany show={showModal} hide={() => setShowModal(false)} gold={(props.user && props.user.gold) || 0} />
    </Private>
  );
}

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(MyCompanies);