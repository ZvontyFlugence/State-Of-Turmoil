/*global google*/
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import SoTApi from 'services/SoTApi';

// PrimeReact
import { GMap } from 'primereact/gmap';
import { Growl } from 'primereact/growl';

// Components
import Private from './layouts/private';

// Styles


const World = props => {
  let history = useHistory();
  const [overlays, setOverlays] = useState([]);
  const [gmapReady, setGMapReady] = useState(false);
  const [growl, setGrowl] = useState(null);

  useEffect(() => {
    if (!gmapReady) {
      loadGoogleMaps(() => {
        setGMapReady(true);
      });
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
  };

  const options = {
    center: {
      lat: 37.72886323155891,
      lng: -97.86977002071538,
    },
    zoom: 4,
    disableDefaultUI: true,
    styles: [
      {
          "featureType": "all",
          "elementType": "labels",
          "stylers": [
              {
                  "visibility": "off"
              },
              {
                  "lightness": "-100"
              }
          ]
      },
      {
          "featureType": "all",
          "elementType": "labels.text.fill",
          "stylers": [
              {
                  "saturation": 36
              },
              {
                  "color": "#000000"
              },
              {
                  "lightness": 40
              }
          ]
      },
      {
          "featureType": "all",
          "elementType": "labels.text.stroke",
          "stylers": [
              {
                  "visibility": "on"
              },
              {
                  "color": "#000000"
              },
              {
                  "lightness": 16
              }
          ]
      },
      {
          "featureType": "all",
          "elementType": "labels.icon",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "administrative",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "color": "#000000"
              },
              {
                  "lightness": 20
              }
          ]
      },
      {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
              {
                  "color": "#000000"
              },
              {
                  "lightness": 17
              },
              {
                  "weight": 1.2
              },
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "administrative",
          "elementType": "labels",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#000000"
              },
              {
                  "lightness": 20
              }
          ]
      },
      {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#000000"
              },
              {
                  "lightness": 21
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "color": "#000000"
              },
              {
                  "lightness": 17
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
              {
                  "color": "#000000"
              },
              {
                  "lightness": 29
              },
              {
                  "weight": 0.2
              }
          ]
      },
      {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#000000"
              },
              {
                  "lightness": 18
              }
          ]
      },
      {
          "featureType": "road.local",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#000000"
              },
              {
                  "lightness": 16
              }
          ]
      },
      {
          "featureType": "transit",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#000000"
              },
              {
                  "lightness": 19
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#000000"
              },
              {
                  "lightness": 17
              }
          ]
      }
  ],
  };

  const onMapReady = e => {
    if (overlays.length === 0) {
      SoTApi.getMapRegions().then(data => {
        if (data.regions) {    
          setOverlays(data.regions.map(region => {
            let paths = region.borders.map(path => ({ lat: path.lng, lng: path.lat }));
            let polygon = new google.maps.Polygon({ paths, strokeWeight: 1, fillColor: region.owner.color, fillOpacity: 0.9 });
            polygon.addListener('click', () => history.push(`/region/${region._id}`));
            polygon.addListener('mouseover', () => {
              growl.show({
                severity: 'info',
                summary: (
                  <span>{ region.name } <i className={`flag-icon flag-icon-${region.owner.flag_code}`} style={{ float: 'right', boxShadow: 'none' }} /></span>
                ),
                detail: (
                  <div className='p-grid p-fluid p-dir-col' style={{ margin: '0 auto' }}>
                    <span className='p-col-12' style={{ padding: '0.5em 0px' }}>
                      Core: <i className={`flag-icon flag-icon-${region.owner.flag_code}`} style={{ boxShadow: 'none' }} />
                    </span>
                    <p className='p-col-12'>Resource: { region.resource }</p>
                  </div>
                ),
                sticky: true,
              });
            });
            polygon.addListener('mouseout', () => {
              growl.clear();
            });
            return polygon;
          }));
        }
      });
    }
  }

  return (
    <Private>
      <div id='world' style={{ paddingLeft: '1vw', paddingRight: '1vw' }}>
        <h1>World Map</h1>
        <div className='p-grid'>
          <Growl ref={el => setGrowl(el)} />
          { gmapReady && <GMap overlays={overlays} options={options} onMapReady={onMapReady} style={{ width: '100%', minHeight: '500px' }} /> }
        </div>
      </div>
    </Private>
  );
};

export default World;