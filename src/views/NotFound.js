import React from 'react';
import { useHistory } from 'react-router';

// PrimeReact
import { Button } from 'primereact/button';

const NotFound = () => {
  let history = useHistory();

  return (
    <div id='404NotFound' className='p-grid p-dir-col p-justify-center p-align-center' style={{ marginTop: 20 }}>
      <div className='p-col'>
        <img src='/SoT.svg' alt='' height={300} />
      </div>
      <div className='p-col'>
        <h1>Error: Page Not Found</h1>
        <p>The page you were looking for seems to not exist</p>
      </div>
      <div className='p-col'>
        <Button className='p-button-info' label='Go Back' onClick={() => history.goBack()} />
      </div>
    </div>
  );
}

export default NotFound;