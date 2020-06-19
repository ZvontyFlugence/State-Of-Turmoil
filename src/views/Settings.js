import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SoTApi from 'services/SoTApi';
import authActions from 'store/auth/actions';

// PrimeReact
import { Button } from 'primereact/button';
import { Fieldset } from 'primereact/fieldset';
import { FileUpload } from 'primereact/fileupload';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';

// Components
import Private from './layouts/private';

const Settings = props => {
  const [desc, setDesc] = useState(null);

  useEffect(() => {
    if (desc == null && props.user) {
      setDesc(props.user.description);
    }
  }, [props.user, desc]);

  const handleUpload = async event => {
    // event.files == files to upload
    const file = event.files[0];
    await fetch(file.objectURL)
    .then(img => img.blob())
    .then(blob => {
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        var base64 = reader.result;
        SoTApi.doAction({ action: 'upload', image: base64 })
      .then(data => {
        if (data.success) {
          props.loadUser();
        }
      });
      }
    });
  }

  const updateDesc = () => {
    SoTApi.doAction({ action: 'update_desc', desc })
      .then(data => {
        if (data.success) {
          props.growl.show({ severity: 'success', summary: 'Success', detail: 'Your Description Has Been Updated' });
          props.loadUser();
        }
      })
  }

  return (
    <Private>
      <div id='settings' style={{ paddingLeft: '1vw', paddingRight: '1vw' }}>
        <h1>Settings</h1>
        <div className='p-grid p-dir-col'>
          <div className='p-col' style={{ margin: '0 auto' }}>
            <Message severity='warn' text='Certain settings can only be edited from your Turmoil Studios Account' />
          </div>
          <div className='p-col' style={{ margin: '0 auto' }}>
            <Fieldset legend='Update Profile Picture' style={{ width: '425px' }}>
              <FileUpload
                name='picture'
                url='./upload'
                accept='image/*'
                maxFileSize={100000000}
                customUpload
                uploadHandler={handleUpload}
              />
            </Fieldset>
          </div>
          <div className='p-col' style={{ margin: '0 auto'}}>
            <Fieldset legend='Update Description'>
              <InputTextarea
                cols={50}
                value={desc || ''}
                onChange={e => setDesc(e.target.value)}
                autoResize
              />
              <div className='p-grid p-justify-end' style={{ paddingTop: '10px', paddingRight: '5px' }}>
                <Button label='Submit' onClick={updateDesc} />
              </div>
            </Fieldset>
          </div>
        </div>
      </div>
    </Private>
  );
};

const mapStateToProps = state => ({
  growl: state.growl.el,
  user: state.auth.user,
});

const mapDispatchToProps = dispatch => ({
  loadUser: () => dispatch(authActions.loadUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);