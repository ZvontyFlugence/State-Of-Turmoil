const db = require('../db');
const CountryService = require('./CountryService');
const RegionService = require('./RegionService');
const ShoutsService = require('./ShoutsService');

const MemberService = {};
const MemberActions = {
  DELETE_ALERT: 'DELETE_ALERT',
  HEAL: 'HEAL',
  READ_ALERT: 'READ_ALERT',
  SEND_FRIEND_REQUEST: 'SEND_FRIEND_REQUEST',
  SHOUT: 'SHOUT',
  SHOUT_REPLY: 'SHOUT_REPLY',
  TRAIN: 'TRAIN',
  UPDATE_DESC: 'UPDATE_DESC',
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
    job: 0,
    party: 0,
    unit: 0,
    newspaper: 0,
    canTrain: new Date(Date.now()),
    canWork: new Date(Date.now()),
    canCollectRewards: new Date(Date.now()),
    canHeal: new Date(Date.now()),
    wallet: [{ currency: country.currency, amount: 25.00 }],
    inventory: [],
    alerts: [],
    messages: [],
    companies: [],
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

MemberService.getAllUsers = async () => {
  const user_coll = db.getDB().collection('users');
  let users = await user_coll.find({}).toArray();

  if (users) {
    return Promise.resolve({ status: 200, payload: { users } });
  }
  const payload = { error: 'No Users Found' };
  return Promise.reject({ status: 404, payload });
}

MemberService.doAction = async (id, body) => {
  switch (body.action.toUpperCase()) {
    case MemberActions.DELETE_ALERT:
      return await delete_alert(id, body.alert);
    case MemberActions.HEAL:
      return await heal(id);
    case MemberActions.READ_ALERT:
      return await read_alert(id, body.alert);
    case MemberActions.TRAIN:
      return await train(id);
    case MemberActions.SEND_FRIEND_REQUEST:
      return await send_friend_request(id, body.friend_id);
    case MemberActions.SHOUT:
      return await shout(id, body.shout);
    case MemberActions.SHOUT_REPLY:
      return await reply_to_shout(id, body.reply);
    case MemberActions.UPDATE_DESC:
      return await update_desc(id, body.desc);
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

  if (user.canTrain > new Date(Date.now())) {
    const payload = { success: false, error: 'You cannot train yet' };
    return Promise.reject({ status: 400, payload });
  }

  if (user.health < 10) {
    const payload = { success: false, error: 'Insufficient Health!' };
    return Promise.reject({ status: 400, payload });
  }

  let updates = {
    strength: user.strength + 1,
    xp: user.xp + 1,
    health: user.health - 10,
    canTrain: new Date(new Date().setHours(24, 0, 0, 0)),
  };

  // TODO: Create alert for level ups
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
  let payload = {};

  if (user.canHeal > new Date(Date.now())) {
    payload = { success: false, error: 'You\'ve already healed today' };
    return Promise.reject({ status: 400, payload });
  }

  if (user.health === 100) {
    payload = { success: false, error: 'You\'re already at max health!' };
    return Promise.reject({ status: 400, payload });
  }

  let updates = { health: Math.min(user.health + 50, 100) };
  const updated_user = await users.findOneAndUpdate({ _id: user._id }, { $set: updates }, { new: true });

  if (updated_user) {
    return Promise.resolve({ status: 200, payload: { success: true } });
  }
  payload = { success: false, error: 'Something Unexpected Happened!' };
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

const read_alert = async (id, alert) => {
  const user = await MemberService.getUser(id);
  const users = db.getDB().collection('users');

  if (alert.index > -1) {
    user.alerts[alert.index].read = true;
    let updated_user = await users.findOneAndUpdate({ _id: user._id }, { $set: { alerts: user.alerts } });
    if (updated_user) {
      return Promise.resolve({ status: 200, payload: { success: true } })
    } else {
      const payload = { success: false, error: 'Something Unexpected Happened' };
      return Promise.reject({ status: 500, payload });
    }
  }

  const payload = { success: false, error: 'Alert Not Found' };
  return Promise.reject({ status: 404, payload });
}

const delete_alert = async (id, alert) => {
  const user = await MemberService.getUser(id);
  const users = db.getDB().collection('users');

  if (alert.index > -1) {
    user.alerts.splice(alert.index, 1);
    let updated_user = await users.findOneAndUpdate({ _id: user._id }, { $set: { alerts: user.alerts } });

    if (updated_user) {
      return Promise.resolve({ status: 200, payload: { success: true } });
    } else {
      const payload = { success: false, error: 'Something Unexpected Happened' };
      return Promise.reject({ status: 500, payload });
    }
  }

  const payload = { success: false, error: 'Alert Not Found' };
  return Promise.reject({ status: 404, payload });
}

const update_desc = async (id, description) => {
  const users = db.getDB().collection('users');

  let updated_user = await users.findOneAndUpdate({ _id: id }, { $set: { description } });

  if (updated_user) {
    return Promise.resolve({ status: 200, payload: { success: true } });
  }
  
  const payload = { success: false, error: 'Something Unexpected Happened' };
  return Promise.reject({ status: 500, payload });
}

const shout = async (id, data) => {
  data.user_id = id;
  return ShoutsService.sendShout(data); 
}

const reply_to_shout = async (id, data) => {
  data.user_id = id;
  return ShoutsService.sendReply(data);
}

module.exports = MemberService;