import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import growlActions from 'store/growl/actions';

// PrimeReact
import { Growl } from 'primereact/growl';

// Components
import Home from 'views/Home';
import Login from 'views/Login';
import NotFound from 'views/NotFound';
import Register from 'views/Register';
import Dashboard from 'views/Dashboard';
import World from 'views/World';
import Train from 'views/Train';
import Settings from 'views/Settings';
import Profile from 'views/Profile';
import Alerts from 'views/Alerts';

function App(props) {
  return (
    <BrowserRouter>
      <Growl ref={props.setGrowl} />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <Route path='/dashboard' component={Dashboard} />
        <Route path='/alerts' component={Alerts} />
        <Route path='/profile/:id' component={Profile} /> 
        <Route path='/settings' component={Settings} />
        <Route path='/train' component={Train} />
        <Route path='/world' component={World} />
        <Route path='*' component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

const mapDispatchToProps = dispatch => ({
  setGrowl: el => dispatch(growlActions.setGrowl(el)),
});

export default connect(null, mapDispatchToProps)(App);
