const db = require('../db');
const CountryService = require('./CountryService');
const RegionService = require('./RegionService');

const MemberService = {};
const MemberActions = {
  SEND_FRIEND_REQUEST: 'SEND_FRIEND_REQUEST',
  HEAL: 'HEAL',
  TRAIN: 'TRAIN',
  UPLOAD: 'UPLOAD',
};

// Creates SoT User Document
MemberService.createUser = async data => {
  // Get Users Collection
  const users = db.getDB().collection('users');
  const num_users = await users.estimatedDocumentCount();

  const country = await CountryService.getCountry(data.country);
  const location = await RegionService.startingRegion(data.country);

  // Build User Document
  const user_doc = {
    _id: num_users + 1,
    account: data.email,
    image: process.env.DEFAULT_PIC,
    createdOn: new Date(Date.now()),
    displayName: data.displayName,
    description: '',
    level: 1,
    xp: 0,
    health: 100,
    country: data.country,
    gold: 5.00,
    strength: 0,
    location: location._id,
    wallet: [{ currency: country.currency, amount: 25.00 }],
    alerts: [],
    messages: [],
  };

  const res = await users.insertOne(user_doc);
  let user = res.ops[0];

  return user;
}

MemberService.getLinkedUser = async email => {
  // Get Users Collection
  const users = db.getDB().collection('users');
  // Get User
  const user = await users.findOne({ account: email });

  return user;
}

MemberService.getUser = async id => {
  const users = db.getDB().collection('users');
  return await users.findOne({ _id: id });
}

MemberService.doAction = async (id, body) => {
  switch (body.action.toUpperCase()) {
    case MemberActions.SEND_FRIEND_REQUEST:
      return await send_friend_request(id, body.friend_id);
    case MemberActions.HEAL:
      return await heal(id);
    case MemberActions.TRAIN:
      return await train(id);
    case MemberActions.UPLOAD:
      return await upload(id, body.image);
    default:
      const payload = { success: false, error: 'Unsupported Action!' };
      return Promise.reject({ status: 400, payload });
  }
}

const neededXP = level => Math.round(0.08*(level**3)+0.8*(level**2)+2*level);

const train = async id => {
  const user = await MemberService.getUser(id);
  const users = db.getDB().collection('users');

  if (user.health < 10) {
    const payload = { success: false, error: 'Insufficient Health!' };
    return Promise.reject({ status: 400, payload });
  }

  let updates = {
    strength: user.strength + 1,
    xp: user.xp + 1,
    health: user.health - 10,
  };

  if (updates.xp >= neededXP(user.level)) {
    updates.level = user.level + 1;
    updates.gold = user.gold + 1.0;
  }

  const updated_user = await users.findOneAndUpdate({ _id: user._id }, { $set: updates }, { new: true });

  if (updated_user) {
    return Promise.resolve({ status: 200, payload: { success: true } });
  }
  const payload = { success: false, error: 'Something Unexpected Happened!' };
  return Promise.reject({ status: 500, payload });
}

const heal = async id => {
  const user = await MemberService.getUser(id);
  const users = db.getDB().collection('users');

  if (user.health === 100) {
    const payload = { success: false, error: 'You\'re already at max health!' };
    return Promise.reject({ status: 400, payload });
  }

  let updates = { health: Math.min(user.health + 50, 100) };
  const updated_user = await users.findOneAndUpdate({ _id: user._id }, { $set: updates }, { new: true });

  if (updated_user) {
    return Promise.resolve({ status: 200, payload: { success: true } });
  }
  const payload = { success: false, error: 'Something Unexpected Happened!' };
  return Promise.reject({ status: 500, payload });
}

const upload = async (id, image) => {
  const users = db.getDB().collection('users');
  
  if (!image) {
    const payload = { success: false, error: 'Invalid Base64 Image' };
    return Promise.reject({ status: 400, payload });
  }

  let updated_user = await users.findOneAndUpdate({ _id: id }, { $set: { image } }, { new: true });

  if (updated_user) {
    return Promise.resolve({ status: 200, payload: { success: true } });
  }
  const payload = { success: false, error: 'Something Unexpected Happened!' };
  return Promise.reject({ status: 500, payload });
}

const send_friend_request = async (id, friend_id) => {
  const users = db.getDB().collection('users');
  const user = await MemberService.getUser(id);
  const friend = await MemberService.getUser(friend_id);
  const message = `You have received a friend request from ${user.displayName}`;
  const alert = {
    read: false,
    type: MemberActions.SEND_FRIEND_REQUEST,
    message,
    from: id,
    timestamp: new Date(Date.now())
  };

  let updates = {
    alerts: [...friend.alerts, alert],
  };

  let updated_user = await users.findOneAndUpdate({ _id: friend_id }, { $set: updates });

  if (updated_user) {
    return Promise.resolve({ status: 200, payload: { success: true  } });
  }
  return Promise.reject({ status: 500, payload: { success: false, error: 'Something Unexpected Happened!' } });
}


module.exports = MemberService;