import BaseApiService from './BaseApiService';

const BASE_URL = process.env.REACT_APP_TS_API || 'http://localhost:3030';

let client = new BaseApiService({ baseURL: BASE_URL });

const SoTApi = {};

SoTApi.setToken = token => {
  const HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  client = new BaseApiService({ baseURL: BASE_URL, headers: HEADERS, timeout: 5000 });
}

// AUTH
SoTApi.validate = () => client.get('/auth/validate');
SoTApi.login = payload => client.post('/auth/login', payload);
SoTApi.register = payload => client.post('/auth/register', payload);

// User
SoTApi.getUser = () => client.get('/user');
SoTApi.getUsers = () => client.get('/user/all');
SoTApi.getProfile = id => client.get(`/user/${id}`);
SoTApi.getLocationInfo = () => client.get('/user/location-info');
SoTApi.getWalletInfo = () => client.get('/user/wallet-info');
SoTApi.doAction = payload => client.patch('/user/action', payload);

// Regions
SoTApi.getRegion = id => client.get(`/regions/${id}`);

// Stats
SoTApi.getCitizenStats = payload => client.patch('/stats/citizens', payload);

// Map
SoTApi.getMapRegions = () => client.get('/map/regions');

export default SoTApi;