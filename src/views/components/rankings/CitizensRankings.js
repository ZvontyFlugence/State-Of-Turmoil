import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import SoTApi from 'services/SoTApi';
import constants from 'util/constants';

// PrimeReact
import { Card } from 'primereact/card';
import { DataView } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { Toolbar } from 'primereact/toolbar';
import { SelectButton } from 'primereact/selectbutton';

const CitizensRankings = () => {
  let history = useHistory();
  const [stat, setStat] = useState('xp');
  const [citizens, setCitizens] = useState([]);
  const [country, setCountry] = useState('global');

  useEffect(() => {
    if (citizens.length === 0) {
      let payload = { stat };

      if (country !== 'global') {
        payload.country = country;
      }

      SoTApi.getCitizenStats(payload).then(data => {
        if (data.citizens) {
          setCitizens(data.citizens);
        }
      });
    }
  });

  const handleChangeCountry = value => {
    setCountry(value);
    setCitizens([]);
  }

  const handleChangeStat = value => {
    setStat(value);
    setCitizens([]);
  }

  const getStatName = () => {
    switch (stat) {
      case 'strength':
        return 'Strength';
      case 'xp':
        return 'XP';
      default:
        return undefined;
    }
  }

  const renderHeader = () => {
    return (
      <div className='p-grid' style={{ margin: '0px' }}>
        <div className='p-col-fixed' style={{ padding: '0px', margin: '0px', width: '45px', textAlign: 'left' }}>
          <span>Rank</span>
        </div>
        <div className='p-col' style={{ padding: '0px', margin: '0px' }}>
          <span>Citizen</span>
        </div>
        <div className='p-col' style={{ padding: '0px', margin: '0px' }}>
          <span>Country</span>
        </div>
        <div className='p-col' style={{ padding: '0px', margin: '0px', textAlign: 'right' }}>
          <span>{ getStatName() }</span>
        </div>
      </div>
    );
  }

  const countryTemplate = country => {
    return (
      <div className='p-grid' style={{ margin: '0px' }}>
        {country.code !== 'global' && (
          <i className={`flag-icon flag-icon-${country.code}`} style={{ marginRight: '5px' }}/>
        )}
        <p style={{ margin: '0px' }}>{ country.label }</p>
      </div>
    );
  }

  const citizenTemplate = citizen => {
    const rank = citizens.indexOf(citizen) + 1;

    return (
      <div className='p-grid' style={{ paddingTop: rank === 1 ? '10px' : '5px' }}>
        <div className='p-col-fixed' style={{ width: '65px' }}>
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
          <p>{ citizen[stat] } { getStatName() === 'Strength' ? <i className='sot-strength' /> : getStatName()}</p>
        </div>
      </div>
    );
  }

  if (citizens.length > 0) {
    return (
      <>
        <Toolbar style={{ marginBottom: '10px' }}>
          <div className='p-toolbar-group-left' style={{ width: '50%' }}>
            <Dropdown
              value={country}
              options={constants.COUNTRIES}
              onChange={e => handleChangeCountry(e.value)}
              itemTemplate={countryTemplate}
              style={{ width: '200px' }}
            />
          </div>
          <div className='p-toolbar-group-right' style={{ width: '50%', textAlign: 'right' }}>
            <div className='p-grid p-nogutter p-justify-end p-align-center'>
              <SelectButton
                value={stat}
                options={constants.CITIZEN_RANKINGS}
                onChange={e => handleChangeStat(e.value)}
              />
            </div>
          </div>
        </Toolbar>
        <DataView
          value={citizens}
          header={renderHeader()}
          itemTemplate={citizenTemplate}
          rows={Math.min(citizens.length, 10)}
          paginatorPosition='bottom'
          paginator
        />
      </>
    );
  } else {
    return <Card>No Citizens Found</Card>;
  }
}

export default CitizensRankings;