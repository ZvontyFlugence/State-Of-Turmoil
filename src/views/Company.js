import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SoTApi from 'services/SoTApi';

// Components
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
        })
    }
  });


  return (
    <Private>
      <div id='company' style={{ paddingLeft: '1vw', paddingRight: '1vw' }}>
        <div className='p-grid p-dir-col'>
          <div className='p-col-12'>
            Company Header Here
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
}

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Company);