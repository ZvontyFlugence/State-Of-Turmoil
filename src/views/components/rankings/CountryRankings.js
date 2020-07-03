import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import SoTApi from 'services/SoTApi';
import constants from 'util/constants';

// PrimeReact
import { Card } from 'primereact/card';
import { DataView } from 'primereact/dataview';
import { Toolbar } from 'primereact/toolbar';
import { SelectButton } from 'primereact/selectbutton'

const CountryRankings = () => {
  let history = useHistory();
  const [stat, setStat] = useState('population');
  const [countries, setCountries] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      SoTApi.getCountryStats({ stat })
        .then(data => {
          if (data.countries) {
            setCountries(data.countries);
            setLoaded(true);
          }
        })
    }
  });

  const handleChangeStat = value => {
    setStat(value);
    setLoaded(false);
  }

  const getStatName = () => {
    switch (stat) {
      case 'population':
        return 'Citizens';
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
          <span>Country</span>
        </div>
        <div className='p-col' style={{ padding: '0px', margin: '0px', textAlign: 'right' }}>
          <span>{ getStatName() }</span>
        </div>
      </div>
    );
  }

  const countryTemplate = country => {
    const rank = countries.indexOf(country) + 1;

    return (
      <div className='p-grid' style={{ paddingTop: rank === 1 ? '10px' : '5px' }}>
        <div className='p-col-fixed' style={{ width: '65px' }}>
          <p style={{ textAlign: 'center' }}>{ rank }</p>
        </div>
        <div className='p-col' style={{ cursor: 'pointer' }} onClick={() => history.push(`/country/${country._id}`)}>
          <i className={`flag-icon flag-icon-${country.flag_code}`} style={{ float: 'none', marginRight: '10px', fontSize: '32px', verticalAlign: 'middle' }} />
          <span style={{ fontSize: '18px' }}>{ country.name }</span>
        </div>
        <div className='p-col' style={{ textAlign: 'right' }}>
          <p>{ country[stat] } { getStatName() }</p>
        </div>
      </div>
    );
  }

  if (countries.length > 0) {
    return (
      <>
        <Toolbar style={{ marginBottom: '10px' }}>
          <div className='p-toolbar-group-right' style={{ width: '50%', textAlign: 'right' }}>
            <div className='p-grid p-nogutter p-justify-end p-align-center'>
              <SelectButton value={stat} options={constants.COUNTRY_RANKINGS} onChange={e => handleChangeStat(e.value)} />
            </div>
          </div>
        </Toolbar>
        <DataView
          value={countries}
          header={renderHeader()}
          itemTemplate={countryTemplate}
          rows={Math.min(countries.length, 10)}
          paginatorPosition='bottom'
          paginator
        />
      </>
    );
  } else {
    return <Card>No Countries Found</Card>;
  }
}

export default CountryRankings;