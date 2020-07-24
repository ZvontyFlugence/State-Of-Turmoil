import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import constants from 'util/constants';

// PrimeReact
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ContextMenu } from 'primereact/contextmenu';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Slider } from 'primereact/slider';
import { TabView, TabPanel } from 'primereact/tabview';

// Components
import Inventory from '../shared/Inventory';
import SoTApi from 'services/SoTApi';

const CompanyInfo = props => {
  let context = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [sellAmount, setSellAmount] = useState(0);
  const [sellPrice, setSellPrice] = useState(0.00);

  const contextMenuItems = [
    { label: 'Sell Item', command: () => setShowModal(true) }
  ];

  const getInventoryItems = () => {
    let items = [];

    for (let i = 0; i < props.inventory.length; i++) {
      let item = constants.ITEMS[props.inventory[i].id];
      items.push({
        id: item.id,
        label: item.label,
        image: item.image,
        quantity: props.inventory[i].quantity,
      });
    }

    return items;
  }

  const hideModal = () => {
    setShowModal(false);
    setSelected(null);
  }

  const sellProduct = () => {
    let payload = {
      action: 'sell_product',
      productOffer: { id: selected.id, quantity: sellAmount, price: sellPrice },
    };

    SoTApi.doCompAction(props.compId, payload)
      .then(data => {
        if (data.success) {
          props.growl.show({ severity: 'success', summary: 'Product Listed For Sell' });
          hideModal(true);
          props.setReload(true);
        }
      });
  }

  return props.manageMode ? (
    <>
      <TabView>
        <TabPanel header='Inventory'>
          <div className='p-grid'>
            <div className='p-col'>
              <ContextMenu className='comp-inv-context' model={contextMenuItems} ref={context} />
              <Inventory items={props.inventory} emptyMessage='No items' cm={context} setSelected={setSelected} />
            </div>
          </div>
        </TabPanel>
        <TabPanel header='Employees'>
          Employee List and Management Here
        </TabPanel>
        <TabPanel header='Treasury'>
          Treasury Info Here
        </TabPanel>
      </TabView>
      <Dialog header='Create Product Offer' visible={showModal} onHide={hideModal} modal>
        {selected ? (
          <div className='p-grid p-dir-col p-fluid'>
            <div className='p-col'>
              <label htmlFor='item'>Product:</label>
              <Dropdown id='item' value={selected} options={getInventoryItems()} onChange={e => setSelected(e.value)} />
            </div>
            <div className='p-col'>
              <label htmlFor='amount'>Amount: { sellAmount }</label>
              <Slider id='amount' value={sellAmount} onChange={e => setSellAmount(e.value)} max={selected.quantity} style={{ marginTop: '10px' }} />
            </div>
            <div className='p-col'>
              <label htmlFor='price'>Price:</label>
              <InputNumber value={sellPrice} onChange={e => setSellPrice(e.value)} mode='currency' currency={props.funds && props.funds.currency} currencyDisplay='code' />
            </div>
            <div className='p-col'>
              <Button label='Sell Product' onClick={sellProduct} />
            </div>
          </div>
        ) : (
          <ProgressSpinner />
        )}
      </Dialog>
    </>
  ) : (
    <Card>
      <div className='p-grid'>
        Product and Job Listings Here
      </div>
    </Card>
  );
}

const mapStateToDispatch = state => ({
  growl: state.growl.el,
});

export default connect(mapStateToDispatch)(CompanyInfo);