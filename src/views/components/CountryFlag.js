import React from 'react';

const CountryFlag = props => (
  <a href={`/country/${props.countryID}`}>
    <i className={`flag-icon flag-icon-${props.code}`} style={props.flagStyle} />
  </a>
);

export default CountryFlag;