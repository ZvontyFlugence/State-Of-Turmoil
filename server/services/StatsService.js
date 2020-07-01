const MemberService = require('./MemberService');
const CountryService = require('./CountryService');

const StatsService = {};
const CitizenStats = {
  STRENGTH: 'STRENGTH',
  XP: 'XP',
};
const CountryStats = {
  POPULATION: 'POPULATION',
}

StatsService.citizenStats = async body => {
  let citizens = null;
  if (body.country && body.country !== 'global') {
    citizens = await citizens_by_country(body.country);
  } else {
    citizens = await citizens_global();
  }

  if (!citizens) {
    let payload = { error: 'Something Unexpected Happened' };
    return Promise.reject({ status: 500, payload });
  }

  switch (body.stat.toUpperCase()) {
    case CitizenStats.STRENGTH:
    case CitizenStats.XP:
      citizens.sort((a, b) => b[body.stat] - a[body.stat]);
      break;
    default:
      let payload = { error: 'Unsupported Stat' };
      return Promise.reject({ status: 400, payload });
  }

  return Promise.resolve({ status: 200, payload: { citizens } });
}

const citizens_by_country = async country_code => {
  let country = await CountryService.getCountryByFlagCode(country_code);
  let users = await CountryService.getCitizens(country._id);

  return users.map(u => {
    u.country = { _id: country._id, name: country.name, flag: country.flag_code };
    return u;
  });
}

const citizens_global = async () => {
  let users_result = await MemberService.getAllUsers();
  const { users } = users_result.payload;
  return await Promise.all(users.map(async u => {
    let country = await CountryService.getCountry(u.country);
    u.country = { _id: country._id, name: country.name, flag: country.flag_code };
    return u;
  }));
}

StatsService.countryStats = async body => {
  let countries = await CountryService.getCountries();
  
  if (!countries) {
    let payload = { error: 'Something Unexpected Happened' };
    return Promise.reject({ status: 500, payload });
  }

  switch (body.stat.toUpperCase()) {
    case CountryStats.POPULATION:
      countries = await Promise.all(countries.map(async c => {
        c.population = await CountryService.getPopulation(c._id);
        return c;
      }));
      countries.sort((a, b) => b[body.stat] - a[body.stat]);
      break;
    default:
      let payload = { error: 'Unsupported Country Stat' };
      return Promise.reject({ status: 400, payload });
  }

  if (body.hasOwnProperty('limit')) {
    countries = countries.slice(0, body.limit);
  }

  return Promise.resolve({ status: 200, payload: { countries } });
}

module.exports = StatsService;