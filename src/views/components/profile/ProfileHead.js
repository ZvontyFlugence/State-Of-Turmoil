import React from 'react';
import SoTApi from 'services/SoTApi';

// PrimeReact
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const ProfileHead = props => {

  const sendFriendRequest = () => {
    SoTApi.doAction({ action: 'send_friend_request', friend_id: props.profile._id })
      .then(data => {
        console.log('DATA:', data);
        if (data.success) {
          // TODO: Display Message OR Growl
        } else {
          // TODO: Display Message OR Growl
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
          {props.user._id !== props.profile._id ? (
            <div className='p-grid p-dir-col p-nogutter' style={{ textAlign: 'right' }}>
              <div className='p-col'>
                <Button className='side-nav-item' icon='pi pi-user-plus' onClick={sendFriendRequest} />
              </div>
              <div className='p-col'>
                <Button className='side-nav-item' icon='pi pi-envelope' />
              </div>
              <div className='p-col'>
                <Button className='side-nav-item' icon='pi pi-dollar' />
              </div>
            </div>
          ) : (<></>)}
        </div>
      </div>
    </Card>
  );
}

export default ProfileHead;