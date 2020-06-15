import React from 'react';
import { connect } from 'react-redux';
import SoTApi from 'services/SoTApi';
import authActions from 'store/auth/actions';

// PrimeReact
import { Fieldset } from 'primereact/fieldset';
import { FileUpload } from 'primereact/fileupload';
import { Message } from 'primereact/message';

// Components
import Private from './layouts/private';

const Settings = props => {

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

  return (
    <Private>
      <div id='settings' style={{ paddingLeft: '1vw', paddingRight: '1vw' }}>
        <h1>Settings</h1>
        <div className='p-grid p-dir-col'>
          <div className='p-col' style={{ margin: '0 auto' }}>
            <Message severity='warn' text='Certain settings can only be edited from your Turmoil Studios Account' />
          </div>
          <div className='p-col-3 p-offset-1'>
            <Fieldset legend='Update Profile Picture'>
              <FileUpload
                mode='basic'
                name='picture'
                url='./upload'
                accept='image/*'
                maxFileSize={100000000}
                customUpload
                uploadHandler={handleUpload}
                auto
              />
            </Fieldset>
          </div>
        </div>
      </div>
    </Private>
  );
};

const mapDispatchToProps = dispatch => ({
  loadUser: () => dispatch(authActions.loadUser()),
});

export default connect(null, mapDispatchToProps)(Settings);