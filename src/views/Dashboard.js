import React from 'react';

// PrimeReact
import { Fieldset } from 'primereact/fieldset';

// Components
import Private from './layouts/private';
import Dailies from './components/dashboard/Dailies';
import Shouts from './components/dashboard/Shouts';

// Styles
import 'styles/dashboard.css';

const Dashboard = () => {
  return (
    <Private>
      <div id='dashboard' style={{ paddingLeft: '1vw', paddingRight: '1vw' }}>
        <h1>Dashboard</h1>
        <div className='p-grid'>
          <div className='p-col p-md-6'>
            <div className='p-grid p-dir-col'>
              <div className='p-col-10 p-offset-1'>
                <Dailies />
              </div>
              <div className='p-col-10 p-offset-1'>
                <Fieldset legend='Battles'>
                  
                </Fieldset>
              </div>
              <div className='p-col-10 p-offset-1'>
                <Fieldset legend='News'>
                  
                </Fieldset>
              </div>
            </div>
          </div>
          <div className='p-col p-md-6'>
            <div className='p-grid p-dir-col'>
              <div className='p-col-10 p-offset-1'>
                <Shouts />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Private>
  );
}

export default Dashboard;