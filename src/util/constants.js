const constants = {
  MY_PLACES: [
    { label: 'My Home', link: '/home' },
    { label: 'My Companies', link: '/companies' },
    { label: 'My Party', link: `/party` },
    { label: 'My Unit', link: `/unit` },
    { label: 'My Newspaper', link: `/news` },
  ],
  MARKETS: [
    { label: 'Goods', link: '/markets/goods' },
    { label: 'Exchange', link: '/markets/exchange' },
    { label: 'Companies', link: '/markets/companies' },
  ],
  SOCIETY: [
    { label: 'Region', link: '/region' },
    { label: 'Country', link: '/country' },
    { label: 'Elections', link: '/elections' },
    { label: 'Rankings', link: '/rankings' },
  ],
  COUNTRIES: [
    { label: 'Global', code: 'global', value: 0 },
    { label: 'Canada', code: 'ca', value: 2 },
    { label: 'Ireland', code: 'ie', value: 5 },
    { label: 'Mexico', code: 'mx', value: 3 },
    { label: 'United Kingdom', code: 'gb', value: 4 },
    { label: 'United States', code: 'us', value: 1 }
  ],
  CITIZEN_RANKINGS: [
    { label: 'Experience', value: 'xp' },
    { label: 'Strength', value: 'strength' },
  ],
  COUNTRY_RANKINGS: [
      { label: 'Population', value: 'population' },
  ],
  MAP_STYLE: [
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

export default constants;