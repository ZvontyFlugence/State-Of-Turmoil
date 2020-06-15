import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import { getNeededXp } from 'util/config';
import constants from 'util/constants';
import SoTApi from 'services/SoTApi';
import appActions from 'store/app/actions';
import authActions from 'store/auth/actions';

// PrimeReact
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Fieldset } from 'primereact/fieldset';
import { ProgressBar } from 'primereact/progressbar';
import { ProgressSpinner } from 'primereact/progressspinner';

// Components
import DropButton from 'views/components/DropButton';

// Styles
import 'styles/sidebar.css';

const Sidebar = props => {
  let history = useHistory();
  const expandStyle = 'side-nav-lg';
  const minimizeStyle = 'side-nav-lg-hidden';
  const [countryInfo, setCountryInfo] = useState(null);
  const [regionInfo, setRegionInfo] = useState(null);
  const [walletInfo, setWalletInfo] = useState(null);

  useEffect(() => {
    if (!countryInfo || !regionInfo) {
      SoTApi.getLocationInfo().then(data => {
        if (!data.error) {
          setCountryInfo(data.country_info);
          setRegionInfo(data.region_info);
        }
      });
    }

    if (!walletInfo) {
      SoTApi.getWalletInfo().then(data => {
        if (!data.error) {
          setWalletInfo(data.wallet_info);
        }
      });
    }
  });

  const getAlertsColor = () => {
    return props.user.alerts.some(alert => alert.read === false) ? 'yellow' : 'white';
  }

  const toggleSideNavLg = () => {
    if (props.sidebarExpanded) {
      props.minimizeSidebar();
    } else {
      props.expandSidebar();
    }
  }

  const getXpPercent = () => {
    if (props.user) {
      const xpNeeded = getNeededXp(props.user.level);
      return (props.user.xp / xpNeeded) * 100;
    }
    
    return 0;
  }

  const handleHeal = () => {
    SoTApi.doAction({ action: 'heal' }).then(data => {
      if (data.success) {
        props.loadUser();
      }
    });
  }

  let healthBarTemplate = (value) => <span>Health: {value}%</span>;

  let xpBarTemplate = () => {
    const xpNeeded = getNeededXp(props.user.level);
    return <span>XP: {props.user && props.user.xp}/{xpNeeded}</span>;
  }

  if (props.user && countryInfo && regionInfo && walletInfo) {
    return (
      <>
        <div className='p-col-fixed side-nav-container'>
          <Card className='side-nav'>
            <Button className='side-nav-item' icon='pi pi-angle-right' tooltip='Expand Sidebar' onClick={toggleSideNavLg} />
            <Button className='side-nav-item' icon='pi pi-user' tooltip='My Profile' onClick={() => history.push(`/profile/${props.user._id}`)} />
            <Button className='side-nav-item' icon='pi pi-envelope' tooltip='Mail' onClick={() => history.push('/mail')} />
            <Button className='side-nav-item' icon='pi pi-bell' tooltip='Alerts' onClick={() => history.push('/alerts')} style={{ color: getAlertsColor() }} />
            <DropButton classes='side-nav-item' icon='pi pi-home' tooltip='My Places' position='bottom' items={constants.MY_PLACES} />
            <DropButton classes='side-nav-item' icon='pi pi-shopping-cart' tooltip='Markets' position='bottom' items={constants.MARKETS} />
            <Button className='side-nav-item' icon='pi pi-bookmark' tooltip='Battles' onClick={() => history.push('/battles')} />
            <Button className='side-nav-item' icon='pi pi-globe' tooltip='World' onClick={() => history.push('/world')} />
            <DropButton classes='side-nav-item' icon='pi pi-users' tooltip='Society' position='top' items={constants.SOCIETY} />
            <Button className='side-nav-item' icon='pi pi-cog' tooltip='Settings' onClick={() => history.push('/settings')} />
          </Card>
        </div>
        <div className={`p-col p-md-2 p-nogutter ${props.sidebarExpanded ? expandStyle : minimizeStyle}`}>
          <Card style={{width: '100%'}}>
            {props.user && (
              <div className='user-container'>
                <div style={{ cursor: 'pointer', margin: '0 auto', textAlign: 'center' }} onClick={() => history.push(`/profile/${props.user._id}`)}>
                  <img className='user-img' src={props.user.image} alt='' />
                  <p className='user-name'>{ props.user.displayName }</p>
                </div>
                <br />
                <span>Level: { props.user.level }</span>
                <ProgressBar id='healthbar' value={props.user.health} displayValueTemplate={healthBarTemplate} />
                <ProgressBar id='xpbar' value={getXpPercent()} displayValueTemplate={xpBarTemplate} />
                <br />
                  <Button className='p-button-success' label='Heal' onClick={handleHeal} disabled={props.user.health === 100} />
                <br />
                <p>Citizenship: <i className={`flag-icon flag-icon-${countryInfo.flag}`} /></p>
                <Fieldset legend='Location'>
                  <p>{ regionInfo.name } <i className={`flag-icon flag-icon-${regionInfo.owner_flag}`} /></p>
                </Fieldset>
                <br />
                <Fieldset legend='Wallet'>
                  <p>Gold: <span style={{ float: 'right' }}>{ props.user.gold.toFixed(2) }</span></p>
                  <p>{ walletInfo.current.currency }: <span style={{ float: 'right' }}>{ walletInfo.current.amount.toFixed(2) } <i className={`flag-icon flag-icon-${walletInfo.current.flag}`} style={{ float: 'none' }}/></span></p>
                </Fieldset>
              </div>
            )}
          </Card>
        </div>
      </>
    );
  } else {
    return (
      <ProgressSpinner />
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  sidebarExpanded: state.app.sidebarExpanded,
});

const mapDispatchToProps = dispatch => ({
  loadUser: () => dispatch(authActions.loadUser()),
  expandSidebar: () => dispatch(appActions.expand()),
  minimizeSidebar: () => dispatch(appActions.minimize()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);