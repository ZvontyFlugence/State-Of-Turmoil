import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SoTApi from 'services/SoTApi';

// PrimeReact
import { ProgressSpinner } from 'primereact/progressspinner';

// Components
import Private from './layouts/private';
import ProfileHead from './components/profile/ProfileHead';
import ProfileActivities from './components/profile/ProfileActivities';
import ProfileDetail from './components/profile/ProfileDetail';

const Profile = props => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!profile) {
      SoTApi.getProfile(props.match.params.id)
        .then(data => {
          if (data.profile) {
            setProfile(data.profile);
          }
        });
    }

    if (profile && profile._id !== Number.parseInt(props.match.params.id)) {
      setProfile(null);
    }
  }, [profile, props.match.params.id]);

  if (profile && props.user) {
    return (
      <Private>
        <div id='profile' style={{ paddingLeft: '10vw', paddingRight: '10vw', paddingTop: '5vh' }}>
          <div className='p-grid p-dir-col'>
            <div className='p-col-12'>
              <ProfileHead profile={profile} user={props.user} />  
            </div>
            <div className='p-col-12'>
              <div className='p-grid'>
                <div className='p-col-3' style={{ textAlign: 'center' }}>
                  <ProfileActivities profile={profile} />
                </div>
                <div className='p-col' style={{ textAlign: 'center' }}>
                  <ProfileDetail profile={profile} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Private>
    );
  } else {
    return (
      <Private>
        <div id='profile' style={{ paddingLeft: '1vw', paddingRight: '1vw' }}>
          <div className='p-grid p-justify-center p-align-stretch' style={{ height: '80vh' }}>
            <ProgressSpinner style={{ marginTop: '25vh' }}/>
          </div>
        </div>
      </Private>
    );
  }
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Profile);