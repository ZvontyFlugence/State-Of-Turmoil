import React from 'react';

// PrimeReact
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';

const CompanyInfo = props => {

  return props.manageMode ? (
    <TabView>
      <TabPanel header='Inventory'>
        Inventory and Product Offerings Here
      </TabPanel>
      <TabPanel header='Employees'>
        Employee List and Management Here
      </TabPanel>
      <TabPanel header='Treasury'>
        Treasury Info Here
      </TabPanel>
    </TabView>
  ) : (
    <Card>
      <div className='p-grid'>
        Product and Job Listings Here
      </div>
    </Card>
  );
}

export default CompanyInfo;