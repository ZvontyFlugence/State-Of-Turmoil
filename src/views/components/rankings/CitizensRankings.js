import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import SoTApi from 'services/SoTApi';

// PrimeReact
import { Card } from 'primereact/card';
import { DataView } from 'primereact/dataview';

const CitizensRankings = props => {
  let history = useHistory();
  const [citizens, setCitizens] = useState([]);

  useEffect(() => {
    if (citizens.length === 0) {
      SoTApi.getCitizenStats({ stat: 'xp' }).then(data => {
        if (data.citizens) {
          setCitizens(data.citizens);
        }
      });
    } else {
      console.log(citizens);
    }
  });

  const renderHeader = () => {
    return (
      <div className='p-grid'>
        <h2 style={{ margin: '10px 10px 0px' }}>Citizen Rankings</h2>
      </div>
    );
  }

  const citizenTemplate = citizen => {
    const rank = citizens.indexOf(citizen) + 1;

    return (
      <div className='p-grid' style={{ paddingTop: rank === 1 ? '10px' : '5px' }}>
        <div className='p-col-1'>
          <p style={{ textAlign: 'center' }}>{ rank }</p>
        </div>
        <div className='p-col' style={{ cursor: 'pointer' }} onClick={() => history.push(`/profile/${citizen._id}`)}>
          <img src={citizen.image} alt={citizen.displayName} style={{ height: '40px', verticalAlign: 'middle', marginRight: '15px' }} />
          <span style={{ fontSize: '18px' }}>{ citizen.displayName }</span>
        </div>
        <div className='p-col' style={{ cursor: 'pointer' }} onClick={() => history.push(`/country/${citizen.country._id}`)}>
          <i className={`flag-icon flag-icon-${citizen.country.flag}`} style={{ float: 'none', marginRight: '10px', fontSize: '32px', verticalAlign: 'middle' }} />
          <span style={{ fontSize: '18px' }}>{ citizen.country.name }</span>
        </div>
        <div className='p-col' style={{ textAlign: 'right' }}>
          <p>{ citizen.xp } XP</p>
        </div>
      </div>
    );
  }

  if (citizens.length > 0) {
    return (
      <DataView
        value={citizens}
        header={renderHeader()}
        itemTemplate={citizenTemplate}
        rows={Math.min(citizens.length, 10)}
        paginatorPosition='bottom'
        paginator
      />
    );
  } else {
    return <Card>No Citizens Found</Card>;
  }
}

export default CitizensRankings;