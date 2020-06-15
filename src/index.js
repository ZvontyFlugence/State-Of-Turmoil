import React from 'react';
import ReactDOM from 'react-dom';
import 'styles/index.css';
import { Provider } from 'react-redux';
import store from 'store';
import App from './App';
import * as serviceWorker from './serviceWorker';

import 'primeflex/primeflex.css';
import 'primereact/resources/themes/luna-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'flag-icon-css/css/flag-icon.min.css';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
