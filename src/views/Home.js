import React from 'react';
import { useHistory } from 'react-router';

// PrimeReact
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

// Components
import Public from './layouts/public';
import TopCountries from './components/home/TopCountries';

// Styles
import 'styles/home.css';

const Home = () => {
  let history = useHistory();

  return (
    <Public>
      <div id='home'>
        <div className='p-col home-centered'>
          <img id='logo' src='/SoT.svg' alt='' />
        </div>
        <div className='home-centered'>
          <h1>State of Turmoil</h1>
        </div>
        <div className='p-col home-centered'>
          <Button label='Login' className='p-button-success gutter' onClick={() => history.push('/login')} />
          <Button label='Register' onClick={() => history.push('/register')} />
        </div>
        <br />
        <div className='p-grid p-justify-even'> 
          <div className='p-col-12 p-md-3'>
            <TopCountries />
          </div>
          <div className='p-col-12 p-md-4'>
            <Card>
              Features
            </Card>
          </div>
          <div className='p-col-12 p-md-3'>
            <Card>
              Top Players
            </Card>
          </div>
        </div>
      </div>
    </Public>
  );
}

export default Home;