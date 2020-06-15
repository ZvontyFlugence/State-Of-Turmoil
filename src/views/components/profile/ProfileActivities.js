import React from 'react';

// PrimeReact
import { Card } from 'primereact/card';
import { Fieldset } from 'primereact/fieldset';

const ProfileActivities = props => {

  const getJoinDate = () => {
    let date = new Date(props.profile.createdOn);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };

  return (
    <Card>
      <Fieldset legend='Politics'>

      </Fieldset>
      <Fieldset legend='Military'>

      </Fieldset>
      <Fieldset legend='Newspaper'>

      </Fieldset>
      <br />
      <span>
        Joined on: { getJoinDate() }
      </span>
    </Card>
  );
};

export default ProfileActivities;