const MemberService = require('./MemberService');
const CountryService = require('./CountryService');

const StatsService = {};
const Stats = {
  // STRENGTH: 'STRENGTH',
  XP: 'XP',
}

StatsService.citizenStats = async body => {
  switch (body.stat.toUpperCase()) {
    case Stats.XP:
      return await citizens_by_xp();
    default:
      const payload = { error: 'Unsupported Stat' };
      return Promise.reject({ status: 400, payload });
  }
}

const citizens_by_xp = async () => {
  let users_result = await MemberService.getAllUsers();
  const payload = { error: 'Something Unexpected Happened' };

  if (users_result.status !== 200) {
    return Promise.reject(users_result);
  }

  const { users } = users_result.payload;
  let citizens = await Promise.all(users.map(async u => {
    let country = await CountryService.getCountry(u.country);
    u.country = { _id: country._id, name: country.name, flag: country.flag_code };
    return u;
  }))
    .then(values => {
      return values.sort((a, b) => b.xp - a.xp);
    });

  if (citizens) {
    return Promise.resolve({ status: 200, payload: { citizens } });
  }
  
  return Promise.reject({ status: 500, payload });
}

module.exports = StatsService;