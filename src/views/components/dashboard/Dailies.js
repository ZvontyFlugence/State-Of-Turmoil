import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';

// PrimeReact
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Fieldset } from 'primereact/fieldset';

const Dailies = props => {
  let history = useHistory();

  const hasTrained = () => props.user && props.user.canTrain > new Date(Date.now());
  const hasWorked = () => props.user && props.user.canWork > new Date(Date.now());
  const hasCollectedRewards = () => props.user && props.user.canCollectRewards > new Date(Date.now());

  return (
    <Fieldset legend='Dailies'>
      <div className='p-grid p-align-stretch'>
        <div className='p-col'>
          <div className='p-grid p-dir-col'>
            <div className='p-col'>
              <Checkbox inputId='train' value='Train' checked={hasTrained()} disabled />
              <label htmlFor='train' className='p-checkbox-label'>Train</label>
            </div>
            <div className='p-col'>
              <Checkbox inputId='work' value='Work' checked={hasWorked()} disabled />
              <label htmlFor='work' className='p-checkbox-label'>Work</label>
            </div>
          </div>
          
        </div>
        <div className='p-col p-col-align-center' style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {hasTrained() && hasWorked() ? (
            <Button className='p-button-success' label='Collect Rewards' disabled={hasCollectedRewards()} />
          ) : (
            <Button label='Complete Tasks' onClick={() => history.push('/home')} />
          )}
        </div>
      </div>
    </Fieldset>
  );
}

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Dailies);