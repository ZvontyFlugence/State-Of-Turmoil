import React from 'react';

// PrimeReact
import { Card } from 'primereact/card';
import { Fieldset } from 'primereact/fieldset';

const ProfileDetail = props => {
  return (
    <Card>
      <Fieldset legend='Description'>
        <div style={{ textAlign: 'left' }}>{ props.profile.description }</div>
      </Fieldset>
      <Fieldset legend='Stats'>

      </Fieldset>
      <Fieldset legend='Achievements'>

      </Fieldset>
      <Fieldset legend='Friends'>

      </Fieldset>
    </Card>
  );
}

export default ProfileDetail;