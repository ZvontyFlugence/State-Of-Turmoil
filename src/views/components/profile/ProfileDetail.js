import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import SoTApi from 'services/SoTApi';

// PrimeReact
import { Card } from 'primereact/card';
import { DataView } from 'primereact/dataview';
import { Fieldset } from 'primereact/fieldset';
import { Panel } from 'primereact/panel';

const ProfileDetail = props => {
  let history = useHistory();
  const [friends, setFriends] = useState([]);
  const [reload, setReload] = useState(true);

  useEffect(() => {
    if (reload) {
      getFriends();
    }
  });

  const getFriends = async () => {
    let friends_list = await Promise.all(props.profile.friends.map(async friend_id => {
      return await SoTApi.getProfile(friend_id)
        .then(data => {
          if (data.profile) {
            return data.profile;
          } else {
            return null;
          }
        });
    }));

    setFriends(friends_list);
    setReload(false);
  }

  const friendTemplate = friend => {
    if (!friend) {
      return;
    }
    
    return (
      <div className='p-md-3' style={{ padding: '.5em' }} onClick={() => history.push(`/profile/${friend._id}`)}>
        <Panel header={friend.displayName} style={{ textAlign: 'center' }}>
          <img src={friend.image} width='100%' alt='' />
        </Panel>
      </div>
    );
  }

  return (
    <Card>
      <Fieldset legend='Stats'>

      </Fieldset>
      <Fieldset legend='Achievements'>

      </Fieldset>
      <Fieldset legend='Friends'>
        <DataView
          value={friends}
          layout='grid'
          itemTemplate={friendTemplate}
          emptyMessage={'No Friends 😢'}
        />
      </Fieldset>
    </Card>
  );
}

export default ProfileDetail;