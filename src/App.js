import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import growlActions from 'store/growl/actions';

// PrimeReact
import { Growl } from 'primereact/growl';

// Components
import Alerts from 'views/Alerts';
import Dashboard from 'views/Dashboard';
import Home from 'views/Home';
import Index from 'views/Index';
import Login from 'views/Login';
import MyCompanies from 'views/MyCompanies';
import NotFound from 'views/NotFound';
import Profile from 'views/Profile';
import Rankings from 'views/Rankings';
import Region from 'views/Region';
import Register from 'views/Register';
import Settings from 'views/Settings';
import World from 'views/World';

function App(props) {
  return (
    <BrowserRouter>
      <Growl ref={props.setGrowl} />
      <Switch>
        <Route exact path='/' component={Index} />
        <Route path='/alerts' component={Alerts} />
        <Route path='/companies' component={MyCompanies} />
        <Route path='/dashboard' component={Dashboard} />
        <Route path='/home' component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/profile/:id' component={Profile} /> 
        <Route path='/profile'>
          <Redirect to={`/profile/${props.user && props.user._id}`} />
        </Route>
        <Route path='/rankings' component={Rankings} />
        <Route path='/region/:id' component={Region} />
        <Route path='/region'>
          <Redirect to={`/region/${props.user && props.user.location}`} />
        </Route>
        <Route path='/register' component={Register} />
        <Route path='/settings' component={Settings} />
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
