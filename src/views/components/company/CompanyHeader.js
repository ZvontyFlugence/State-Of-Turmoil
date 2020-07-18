import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import SoTApi from 'services/SoTApi';
import constants from 'util/constants';

// PrimeReact
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

const CompanyHeader = props => {
  let history = useHistory();
  let type = constants.COMPANY_TYPES[props.company.type];
  const [regionInfo, setRegionInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  
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
              <span>Worth: {displayWorth()} USD</span>
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
      <Dialog header='Update Company Details' visible={showModal} onHide={() => setShowModal(false)} modal>
        <div className='p-grid p-fluid'>
          <div className='p-col-12'>
            <span className='p-float-label'>
              <InputText id='comp-name' value={name} onChange={e => setName(e.target.value)} />
              <label htmlFor='comp-name'>Company Name</label>
            </span>
          </div>
          <div className='p-col'>
            <Button label='Update' onClick={handleUpdate} />
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