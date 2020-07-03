import React, { useState, useEffect } from 'react';
import moment from 'moment';
import SoTApi from 'services/SoTApi';

// PrimeReact
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { TabView, TabPanel } from 'primereact/tabview';

const Shouts = props => {
  const [shout, setShout] = useState('');
  const [shouts, setShouts] = useState([]);
  const [reload, setReload] = useState(true);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reload) {
      let scope = undefined;
      let country, party, unit = undefined;

      switch (active) {
        case 0:
          scope = 'global';
          break;
        case 1:
          country = props.regionOwner;
          scope = 'country';
          break;
        case 2:
          party = props.party;
          scope = 'party';
          break;
        case 3:
          party = props.unit;
          scope = 'unit';
          break;
        default:
          break;
      }

      if (scope) {
        SoTApi.getShouts({ scope, country, party, unit })
          .then(data => {
            if (data.shouts) {
              setShouts(data.shouts);
              setReload(false);
            }
          });
      }
    }
  });

  const handleTabChange = e => {
    setActive(e.index);
    setReload(true);
  }

  const handleShout = () => {
    let scope = 'global';
    let country, party, unit = undefined;

    switch (active) {
      case 1:
        scope = 'country';
        country = props.country;
        break;
      case 2:
        scope = 'party';
        party = props.party;
        break;
      case 3:
        scope = 'unit';
        unit = props.unit;
        break;
      default:
        break;
    }

    let payload = {
      action: 'shout',
      shout: {
        scope,
        message: shout,
        country,
        party,
        unit,
      },
    };

    SoTApi.doAction(payload)
      .then(data => {
        if (data.success) {
          setReload(true);
        }
      });
  }

  const shoutBox = (
    <>
      <div className='p-col-12' style={{ textAlign: 'right' }}>
        <a href="/shouts" style={{ width: '100%' }}>View All</a>
      </div>
      <div className='p-col-12'>
        <InputTextarea
          rows={2}
          col={30}
          value={shout}
          style={{ width: '100%' }}
          placeholder='Enter Message...'
          onChange={e => setShout(e.target.value)}
          maxLength={140}
          autoResize
        />
      </div>
      <div className='p-col-3 p-offset-9'>
        <Button
          className='p-button-info'
          label='Shout'
          style={{ width: '100%' }}
          onClick={handleShout}
        />
      </div>
      <hr style={{ borderColor: '#666666', width: '100%' }} />
    </>
  );

  // TODO: Add inline Reply functionality
  // TODO: Allow users to like a shout and update in DB
  const shoutItem = (item, index) => (
    <div key={index} className='p-grid'>
      <div className='p-col-2'>
        <a href={`/profile/${item.user}`}>
          <img src={item.user_img} alt="" style={{ width: '100%', margin: '0 auto' }} />
        </a>
      </div>
      <div className='p-col'>{item.message}</div>
      <div className='p-col-12'>
        <div className='p-grid'>
          <div className='p-col'>
            <span>{moment(item.posted).fromNow()}</span>
          </div>
          <div className='p-col' style={{ textAlign: 'right' }}>
            <span><i className='pi pi-thumbs-up' /> {item.likes}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <TabView activeIndex={active} onTabChange={handleTabChange}>
      <TabPanel header='Global'>
        <div className='p-grid p-dir-col'>
          {shoutBox}
          <div className='p-col-12'>
            {shouts && shouts.length > 0 ? shouts.map((s, idx) => shoutItem(s, idx)) : (<span>No Shouts</span>)}
          </div>
        </div>
      </TabPanel>
      <TabPanel header='Country' disabled></TabPanel>
      <TabPanel header='Party' disabled></TabPanel>
      <TabPanel header='Unit' disabled></TabPanel>
    </TabView>
  );
}

export default Shouts;