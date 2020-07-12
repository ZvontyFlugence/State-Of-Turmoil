import React from 'react';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import SoTApi from 'services/SoTApi';
import authActions from 'store/auth/actions';

// PrimeReact
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const ProfileHead = props => {
  let history = useHistory();

  const sendFriendRequest = () => {
    SoTApi.doAction({ action: 'send_friend_request', friend_id: props.profile._id })
      .then(data => {
        if (data.success) {
          props.growl.show({ severity: 'success', summary: 'Friend Request Sent' });
        } else {
          props.growl.show({ severity: 'error', summary: 'Friend Request Failed', detail: 'Something went wrong' });
        }
      });
  }

  const removeFriend = () => {
    SoTApi.doAction({ action: 'remove_friend', friend_id: props.profile._id })
      .then(data => {
        if (data.success) {
          props.growl.show({ severity: 'success', summary: 'Removed Friend' });
          props.loadUser();
        }
      });
  }

  return (
    <Card>
      <div className='p-grid'>
        <div className='p-col-fixed' width='160'>
          <img src={props.profile.image}  height='150' style={{ borderRadius: '10px' }} alt='' />
        </div>
        <div className='p-col'>
          <h1 style={{ fontWeight: 'lighter', marginTop: '0px', textAlign: 'left !important' }}>
            <span>
              { `${props.profile.displayName}` }
              <i
                className={`flag-icon flag-icon-${props.profile.country_info.flag}`}
                style={{ float: 'none', verticalAlign: 'middle', fontSize: '28px', marginLeft: '1vw' }}
              />
            </span>
          </h1>
          <p>Level: { props.profile.level }</p>
          <p>Experience: { props.profile.xp }</p>
          <p>
            Location: { `${props.profile.location_info.name}, ${ props.profile.location_info.owner.nick }` }
            <i
              className={`flag-icon flag-icon-${props.profile.location_info.owner.flag}`}
              style={{ float: 'none', verticalAlign: 'middle', marginLeft: '1vw' }}
            />
          </p>
        </div>
        <div className='p-col-1'>
          <div className='p-grid p-dir-col p-nogutter' style={{ textAlign: 'right' }}>
            {props.user._id !== props.profile._id ? (
              <>
                <div className='p-col'>
                  {props.user.friends.indexOf(props.profile._id) === -1 ? (
                    <Button className='side-nav-item' icon='pi pi-user-plus' onClick={sendFriendRequest} disabled={props.user.pendingFriends.indexOf(props.profile._id) >= 0} />
                  ) : (
                    <Button className='side-nav-item' icon='pi pi-user-minus' onClick={removeFriend} />
                  )}
                  </div>
                <div className='p-col'>
                  <Button className='side-nav-item' icon='pi pi-envelope' />
                </div>
                <div className='p-col'>
                  <Button className='side-nav-item' icon='pi pi-dollar' />
                </div>
              </>
            ) : (
              <>
                <div className='p-col'>
                  <Button className='side-nav-item' icon='pi pi-user-edit' onClick={() => history.push('/settings')} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

const mapStateToProps = state => ({
  growl: state.growl.el,
});

const mapDispatchToProps = dispatch => ({
  loadUser: () => dispatch(authActions.loadUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileHead);