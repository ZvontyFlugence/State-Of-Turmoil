import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import growlActions from 'store/growl/actions';

// PrimeReact
import { Growl } from 'primereact/growl';

// Components
import Index from 'views/Index';
import Login from 'views/Login';
import NotFound from 'views/NotFound';
import Register from 'views/Register';
import Dashboard from 'views/Dashboard';
import World from 'views/World';
import Home from 'views/Home';
import Settings from 'views/Settings';
import Profile from 'views/Profile';
import Alerts from 'views/Alerts';
import Rankings from 'views/Rankings';
import Region from 'views/Region';

function App(props) {
  return (
    <BrowserRouter>
      <Growl ref={props.setGrowl} />
      <Switch>
        <Route exact path='/' component={Index} />
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <Route path='/dashboard' component={Dashboard} />
        <Route path='/alerts' component={Alerts} />
        <Route path='/profile/:id' component={Profile} /> 
        <Route path='/settings' component={Settings} />
        <Route path='/home' component={Home} />
        <Route path='/rankings' component={Rankings} />
        <Route path='/region/:id' component={Region} />
        <Route path='/region'>
          <Redirect to={`/region/${props.user && props.user.location}`} />
        </Route>
        <Route path='/world' component={World} />
        <Route path='*' component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

const mapStateToProps = state => ({
  user: state.auth.user,
});

const mapDispatchToProps = dispatch => ({
  setGrowl: el => dispatch(growlActions.setGrowl(el)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
