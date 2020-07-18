import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SoTApi from 'services/SoTApi';
import authActions from 'store/auth/actions';

// Components
import Private from './layouts/private';
import RegionHeader from './components/region/RegionHeader';
import 'styles/region.css';

const Region = props => {
  let id = Number.parseInt(props.match.params.id);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    if (!region) {
      SoTApi.getRegion(id).then(data => {
        if (data.region) {
          setRegion(data.region);
        }
      });
    }
  });

  return (
    <Private>
      <div id='region' style={{ paddingLeft: '10vw', paddingRight: '10vw', marginTop: '5vh' }}>
        <RegionHeader region={region} user={props.user} growl={props.growl} loadUser={props.loadUser} />
      </div>
    </Private>
  );
}

const mapStateToProps = state => ({
  growl: state.growl.el,
  user: state.auth.user,
});

const mapDispatchToProps = dispatch => ({
  loadUser: () => dispatch(authActions.loadUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Region);