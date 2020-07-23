import React from 'react';
import constants from 'util/constants';

// PrimeReact
import { DataView } from 'primereact/dataview';
import { Panel } from 'primereact/panel';

const Inventory = props => {

  const renderHeader = (item, quantity) => {
    let stars = [];

    if (item.quality > 0) {
      for (let i = 1; i <= 5; i++) {
        stars.push(<i className={`pi pi-star${i > item.quality && '-o' }`} />);
      }
    }

    return (
      <div>
        <span>{ item.label } x { quantity }</span>
        { quantity > 0 && (
          <>
            <br />
            { stars }
          </>
        )}
      </div>
    );
  }

  const setupContext = (e, item, invItem) => {
    props.cm.current.show(e);
    let selected = { label: item.label, image: item.image, quantity: invItem.quantity };
    props.setSelected(selected);
  }

  const inventoryItemTemplate = invItem => {
    if (!invItem) {
      return;
    }

    const item = constants.ITEMS[invItem.id];

    return (
      <div className='p-md-2' style={{ padding: '.5em' }} onContextMenu={e => setupContext(e, item, invItem)}>
        <Panel header={renderHeader(item, invItem.quantity)} style={{ textAlign: 'center' }}>
          <i className={item.image} alt='' />
        </Panel>
      </div>
    );
  }

  return (
    <DataView
      value={props.items}
      layout='grid'
      itemTemplate={inventoryItemTemplate}
      emptyMessage={props.emptyMessage}
    />
  );
}

export default Inventory;