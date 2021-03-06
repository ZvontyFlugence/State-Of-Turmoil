import React from 'react';

// PrimeReact
import { TabView, TabPanel } from 'primereact/tabview';

// Components
import Private from './layouts/private';
import CitizensRankings from './components/rankings/CitizensRankings';
import CountryRankings from './components/rankings/CountryRankings';

const Rankings = () => {
  return (
    <Private>
      <div id='rankings' style={{ paddingLeft: '1vw', paddingRight: '1vw' }}>
        <h1>Rankings</h1>
        <div className='p-grid'>
          <div className='p-col-10 p-offset-1'>
            <TabView>
              <TabPanel header='Citizens'>
                <CitizensRankings />
              </TabPanel>
              <TabPanel header='Countries'>
                <CountryRankings />
              </TabPanel>
              <TabPanel header='Parties' disabled></TabPanel>
              <TabPanel header='Military Units' disabled></TabPanel>
              <TabPanel header='Newspapers' disabled></TabPanel>
            </TabView>
          </div>
        </div>
      </div>
    </Private>
  );
}

export default Rankings;