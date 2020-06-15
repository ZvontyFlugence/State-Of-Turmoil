import React from 'react';
import { useHistory } from 'react-router';

// PrimeReact
import { Button } from 'primereact/button';

// Styles
import 'styles/dropbutton.css';

const DropButton = props => {
  let history = useHistory();

  return (
    <div className='sot-dropdown'>
      <Button
        className={`${props.classes} sot-dropbtn`}
        icon={props.icon}
        tooltip={props.tooltip}
        tooltipOptions={{ position: props.position }}
        onClick={props.handleClick}
        label={props.label}
      />
      <div className='sot-dropbtn-content'>
        {props.items.map((item, id) => (
          <p key={id} onClick={() => history.push(item.link)}>{ item.label }</p>
        ))}
      </div>
    </div>
  );
};

export default DropButton;