/*global google*/
import React, { useState, useEffect } from 'react';
import SoTApi from 'services/SoTApi';
import constants from 'util/constants';

// PrimeReact
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { GMap } from 'primereact/gmap';

// Components
import Private from './layouts/private';
import 'styles/region.css';

const Region = props => {
  const [region, setRegion] = useState(null);
  const [overlays, setOverlays] = useState([]);
  const [gmapReady, setGMapReady] = useState(false);

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
    if (!region) {
      SoTApi.getRegion(props.match.params.id).then(data => {
        if (data.region) {
          setRegion(data.region);
        }
      });
    }

    if (region && !gmapReady) {
      loadGoogleMaps(() => {
        setGMapReady(true);
      })
    }
  });

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
      let paths = region.borders.map(path => ({ lat: path.lng, lng: path.lat }));
      let bounds = new google.maps.LatLngBounds();
      paths.map(path => bounds.extend(path));
      e.map.setCenter(bounds.getCenter());
      let polygon = new google.maps.Polygon({ paths, strokeWeight: 1, fillColor: '#777777', fillOpacity: 1 });
      setOverlays([ polygon ]);
    }
  }

  return (
    <Private>
      <div id='region' style={{ paddingLeft: '10vw', paddingRight: '10vw', marginTop: '5vh' }}>
        {region ? (
          <>
            <Card>
              <div className='p-grid'>
                <div className='p-col-fixed' width='160'>
                  { gmapReady && <GMap className='sot-map-img' overlays={overlays} options={options} onMapReady={onMapReady} style={{ width: '160px', height: '160px' }} /> }
                </div>
                <div className='p-col'>
                  <h1 style={{ fontWeight: 'lighter', marginTop: '0px', textAlign: 'left' }}>
                    { region.name }
                  </h1>
                  <p>Owner: { region.owner.name } <i className={`flag-icon flag-icon-${region.owner.flag} flag-inline-right`} /></p>
                  <p>Resource: { region.resource }</p>
                </div>
                <div className='p-col-1' style={{ textAlign: 'right' }}>
                  {/* TODO: Hide if user is in this region */}
                  <Button icon='pi pi-ticket' />
                </div>
              </div>
            </Card>
          </>
        ) : (
          <></>
        )}
        <span style={{ color: 'white' }}>
          Map Data &copy; 2020 Google, INEGI |
          <a href='https://www.google.com/intl/en-US_US/help/terms_maps/'> Terms of Use</a>
        </span>
      </div>
    </Private>
  );
}

export default Region;