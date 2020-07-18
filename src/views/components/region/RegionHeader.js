/* global google */
import React, { useState, useEffect } from 'react';
import SoTApi from 'services/SoTApi';
import constants from 'util/constants';

// PrimeReact
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { GMap } from 'primereact/gmap';
import { Message } from 'primereact/message';

const RegionHeader = props => {
  const [overlays, setOverlays] = useState([]);
  const [gmapReady, setGMapReady] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [travelInfo, setTravelInfo] = useState(null);

  const options = {
    center: {
      lat: 28.13483785,
      lng: -81.6831293426425,
    },
    zoom: 4,
    disableDefaultUI: true,
    fullscreenControl: false,
    styles: constants.MAP_STYLE,
  };

  useEffect(() => {
    if (props.region && !gmapReady) {
      loadGoogleMaps(() => {
        setGMapReady(true);
      });
    }
  });

  const getResource = () => {
    let resource = constants.RESOURCES[props.region.resource];

    if (resource.css) {
      return (
        <span>
          { resource.label }
          <i className={resource.css} style={{ marginLeft: '10px' }} />
        </span>
      );
    } else {
      return <span>{ resource.label }</span>
    }
  }

  const loadGoogleMaps = callback => {
    const existingScript = document.getElementById('googleMaps');

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GMAP_KEY}`;
      script.id = 'googleMaps';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
  
      script.onload = () => {
        if (callback) callback();
      };
    }

    if (existingScript && callback) callback();
  }

  const onMapReady = e => {
    if (overlays.length === 0) {
      let paths = props.region.borders.map(path => ({ lat: path.lng, lng: path.lat }));
      let bounds = new google.maps.LatLngBounds();
      paths.map(path => bounds.extend(path));
      e.map.setCenter(bounds.getCenter());
      let polygon = new google.maps.Polygon({ paths, strokeWeight: 1, fillColor: '#777777', fillOpacity: 1 });
      setOverlays([ polygon ]);
    }
  }

  const confirmTravel = () => {
    let payload = {
      src: props.user.location,
      dest: props.region._id,
    };

    SoTApi.getTravelDistance(payload)
      .then(data => {
        if (data.distance) {
          setTravelInfo(data);
          setShowModal(true);
        }
      });
  }

  const handleTravel = () => {
    let payload = {
      action: 'travel',
      travelInfo: {
        dest: props.region._id
      },
    };

    SoTApi.doAction(payload).then(data => {
      if (data.success) {
        props.growl.show({ severity: 'success', summary: 'Travel Successful', detail: `You have relocated to ${props.region.name}` });
        props.loadUser();
      }
    });
  }

  return (
    <div>
      {props.region ? (
          <Card>
            <div className='p-grid'>
              <div className='p-col-fixed' width='160'>
                { gmapReady && <GMap className='sot-map-img' overlays={overlays} options={options} onMapReady={onMapReady} style={{ width: '160px', height: '160px' }} /> }
              </div>
              <div className='p-col'>
                <h1 style={{ fontWeight: 'lighter', marginTop: '0px', textAlign: 'left' }}>
                  { props.region.name } <i className={`flag-icon flag-icon-${props.region.owner.flag} flag-inline-right`} style={{ fontSize: '28px' }}/>
                </h1>
                <p>Core: { props.region.core.name } <i className={`flag-icon flag-icon-${props.region.core.flag} flag-inline-right`} /></p>
                <p>Resource: { getResource() }</p>
              </div>
              {props.user && (props.user.location !== props.region._id) && (
                <div className='p-col-1' style={{ textAlign: 'right' }}>
                  <Button icon='pi pi-ticket' onClick={confirmTravel} />
                </div>
              )}
            </div>
          </Card>
      ) : (
        <></>
      )}
      <span style={{ color: 'white' }}>
        Map Data &copy; 2020 Google, INEGI |
        <a href='https://www.google.com/intl/en-US_US/help/terms_maps/'> Terms of Use</a>
      </span>
      <Dialog header='Confirm Travel Details' visible={showModal} onHide={() => setShowModal(false)} modal>
          {travelInfo && (
            <div className='p-grid p-dir-col p-fluid'>
              <div className='p-col'>
                <span>Confirm travel from { travelInfo.from.name } to { travelInfo.to.name }</span>
              </div>
              <div className='p-col'>
                <span>Distance:</span>
                <span style={{ float: 'right' }}>{ travelInfo.distance }</span>
              </div>
              <div className='p-col'>
                <span>Travel Costs:</span>
                <span style={{ float: 'right' }}>{ travelInfo.cost.toFixed(2) } <i className='sot-coin' /></span>
              </div>
              <div className='p-col'>
                <span>You Have:</span>
                <span style={{ float: 'right' }}>{ props.user.gold && props.user.gold.toFixed(2) } <i className='sot-coin' /></span>
              </div>
              {props.user.gold < travelInfo.cost && (
                <Message severity='warning' text='Insufficient Funds' />
              )}
              <div className='p-col'>
                <Button label='Confirm' onClick={handleTravel} disabled={props.user.gold < travelInfo.cost} />
              </div>
            </div>
          )}
        </Dialog>
    </div>
  );
}

export default RegionHeader;