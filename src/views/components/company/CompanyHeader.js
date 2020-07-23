import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import SoTApi from 'services/SoTApi';
import constants from 'util/constants';

// PrimeReact
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';

const CompanyHeader = props => {
  let history = useHistory();
  let type = constants.COMPANY_TYPES[props.company.type];
  const [regionInfo, setRegionInfo] = useState(null);
  const [regions, setRegions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState(0);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    if (props.company && !regionInfo) {
      SoTApi.getRegion(props.company.location)
        .then(data => {
          if (data.region) {
            setRegionInfo(data.region);
          }
        });
    }
  });

  const displayWorth = () => {
    let worth = 0;
    return worth.toFixed(2);
  }

  const handleDelete = () => {
    SoTApi.deleteCompany(props.region._id)
      .then(data => {
        if (data.success) {
          history.push('/companies');
          props.loadUser();
        }
      });
  }

  const handleUpdate = () => {
    let payload = { name }
    SoTApi.updateCompDetails(props.region._id, payload)
      .then(data => {
        if (data.success) {
          props.setReload(true);
        }
      });
  }

  const getRegions = () => {
    SoTApi.getRegions().then(data => {
      if (data.regions) {
        setRegions(data.regions);
      }
    });
  }

  const regionTemplate = region => {
    return (
      <span>
        { region.name }
        <i className={`flag-icon flag-icon-${region.owner.flag_code}`} />
      </span>
    );
  }

  const handleSetUpdateError = error => {
    if (updateError !== error) {
      setUpdateError(error);
    }
  }

  const updateDisabled = () => {
    let hasName = !!name;
    let notRelocating = location === 0;
    let invalidLocation = location === (props.company && props.company.location);
    let sufficientFunds = (props.user && props.user.gold) >= 10;

    if (notRelocating && !hasName) {
      handleSetUpdateError('No updates detected!');
      return true;
    } else if (!notRelocating && invalidLocation) {
      handleSetUpdateError('Cannot relocate to current location!');
      return true;
    } else if (!notRelocating && !sufficientFunds) {
      handleSetUpdateError('Insufficient funds for relocation!');
      return true;
    } else {
      handleSetUpdateError('');
      return false;
    }
  }

  const clearRelocation = () => {
    setLocation(0);
    setUpdateError('');
  }

  const handleHideModal = () => {
    clearRelocation();
    setShowModal(false);
  }

  return (
    <Card>
      <div className='p-grid'>
        <div className='p-col-fixed' width='160'>
          <img src={props.company.image} height='150' style={{ borderRadius: '10px' }} alt='' />
        </div>
        <div className='p-col'>
          <div className='p-grid'>
            <div className='p-col-12' style={{ textAlign: 'left' }}>
              <h1 style={{ fontWeight: 'lighter', margin: '0px' }}>
                { props.company.name }
              </h1>
            </div>
            <div className='p-col'>
              {regionInfo && (
                <div>
                  <span>Location: </span>
                  <a href={`/region/${regionInfo._id}`}>{ regionInfo.name }</a>
                  <span>, </span>
                  <a href={`/country/${regionInfo.owner._id}`}>
                    {regionInfo.owner.name}
                    <i
                      className={`flag-icon flag-icon-${regionInfo.owner.flag}`}
                      style={{ float: 'none', marginLeft: '10px', verticalAlign: 'middle' }}
                    />
                  </a>
                </div>
              )}
              <br />
              <div>
                <span>CEO: </span>
                <span>
                  <img
                    src={props.company.ceo.image}
                    alt=''
                    style={{ height: '35px', margin: '0px 10px', verticalAlign: 'middle', borderRadius: '5px' }}
                  />
                  { props.company.ceo.displayName }
                </span>
              </div>
            </div>
            <div className='p-col'>
              <span>Company Type: { type.label } <i className={`${type.css}`} /></span>
              <br />
              <span>Employees: { props.company.employees.length }</span>
              <br />
              <span>Worth: {displayWorth()} <i className='sot-coin' /></span>
            </div>
          </div>
        </div>
        {props.user && props.user._id === props.company.ceo._id && (
          <div className='p-col-1'>
            <div className='p-gid p-dir-col' style={{ textAlign: 'right' }}>
              <div className='p-col'>
                <Button icon='pi pi-pencil' onClick={() => setShowModal(true)} />
              </div>
              <div className='p-col'>
                <Button icon='pi pi-sliders-h' onClick={() => props.setManageMode(!props.manageMode)} />
              </div>
            </div>
          </div>
        )}
      </div>
      <Dialog header='Update Company Details' visible={showModal} onHide={handleHideModal} style={{ width: '50%' }} modal>
        <div className='p-grid p-fluid'>
          <div className='p-col-12'>
            <span className='p-float-label'>
              <InputText id='comp-name' value={name} onChange={e => setName(e.target.value)} />
              <label htmlFor='comp-name'>Company Name</label>
            </span>
          </div>
          <div className='p-col-12'>              
            <Inplace onOpen={getRegions} onClose={clearRelocation} closable>
              <InplaceDisplay>
                <span>Click to Relocate</span>
              </InplaceDisplay>
              <InplaceContent>
                <label>Select New Location:</label>
                <br />
                <Dropdown
                  optionLabel='name'
                  optionValue='_id'
                  value={location}
                  options={regions}
                  itemTemplate={regionTemplate}
                  onChange={e => setLocation(e.value)}
                />
                {location !== 0 && location !== (props.company && props.company.location) && (
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ marginTop: '10px' }}>
                      <span>Cost to Relocate: </span>
                      <span style={{ float: 'right' }}>10.00 <i className='sot-coin' /></span>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <span>You have: </span>
                      <span style={{ float: 'right' }}>{props.user && props.user.gold.toFixed(2)} <i className='sot-coin' /></span>
                    </div>
                  </div>
                )}                
              </InplaceContent>
            </Inplace>
          </div>
          {!!updateError && (
            <div className='p-col-12'>
              <Message severity='warn' text={updateError} />
            </div>
          )}
          <div className='p-col'>
            <Button label='Update' onClick={handleUpdate} disabled={updateDisabled()} />
          </div>
          <div className='p-col'>
            <Button className='p-button-danger' label='Delete' onClick={handleDelete} />
          </div>
        </div>
      </Dialog>
    </Card>
  );
}

export default CompanyHeader;