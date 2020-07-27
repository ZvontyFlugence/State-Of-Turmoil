const db = require('../db');
const CompService = require('./CompService');
const CountryService = require('./CountryService');
const RegionService = require('./RegionService');
const ShoutsService = require('./ShoutsService');

const MemberService = {};
const MemberActions = {
  CREATE_COMPANY: 'CREATE_COMPANY',
  DELETE_ALERT: 'DELETE_ALERT',
  FRIEND_REQUEST_RESPONSE: 'FRIEND_REQUEST_RESPONSE',
  HEAL: 'HEAL',
  LEVEL_UP: 'LEVEL_UP',
  PURCHASE_ITEM: 'PURCHASE_ITEM',
  READ_ALERT: 'READ_ALERT',
  REMOVE_FRIEND: 'REMOVE_FRIEND',
  SEND_FRIEND_REQUEST: 'SEND_FRIEND_REQUEST',
  SHOUT: 'SHOUT',
  SHOUT_REPLY: 'SHOUT_REPLY',
  TRAIN: 'TRAIN',
  TRAVEL: 'TRAVEL',
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
    image: process.env.DEFAULT_USER_PIC,
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
    pendingFriends: [],
    friends: [],
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
  return Promise.resolve({ status: 404, payload });
}

MemberService.doAction = async (id, body) => {
  switch (body.action.toUpperCase()) {
    case MemberActions.CREATE_COMPANY:
      return await create_company(id, body.comp);
    case MemberActions.DELETE_ALERT:
      return await delete_alert(id, body.alert);
    case MemberActions.FRIEND_REQUEST_RESPONSE:
      return await friend_request_response(id, body.response_data);
    case MemberActions.HEAL:
      return await heal(id);
    case MemberActions.PURCHASE_ITEM:
      return await purchase_item(id, body.purchase);
    case MemberActions.READ_ALERT:
      return await read_alert(id, body.alert);
    case MemberActions.REMOVE_FRIEND:
      return await remove_friend(id, body.friend_id);
    case MemberActions.TRAIN:
      return await train(id);
    case MemberActions.TRAVEL:
      return await travel(id, body.travelInfo);
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
      return Promise.resolve({ status: 400, payload });
  }
}

const neededXP = level => Math.round(0.08*(level**3)+0.8*(level**2)+2*level);

const train = async id => {
  const user = await MemberService.getUser(id);
  const users = db.getDB().collection('users');

  if (user.canTrain > new Date(Date.now())) {
    const payload = { success: false, error: 'You cannot train yet' };
    return Promise.resolve({ status: 400, payload });
  }

  if (user.health < 10) {
    const payload = { success: false, error: 'Insufficient Health!' };
    return Promise.resolve({ status: 400, payload });
  }

  let updates = {
    strength: user.strength + 1,
    xp: user.xp + 1,
    health: user.health - 10,
    canTrain: new Date(new Date().setHours(24, 0, 0, 0)),
  };

  if (updates.xp >= neededXP(user.level)) {
    updates.level = user.level + 1;
    updates.gold = user.gold + 1.0;
    updates.alerts = [...user.alerts, buildLevelUpAlert(updates.level)];
  }

  const updated_user = await users.findOneAndUpdate({ _id: user._id }, { $set: updates }, { new: true });

  if (updated_user) {
    return Promise.resolve({ status: 200, payload: { success: true } });
  }
  const payload = { success: false, error: 'Something Unexpected Happened!' };
  return Promise.resolve({ status: 500, payload });
}

const heal = async id => {
  const user = await MemberService.getUser(id);
  const users = db.getDB().collection('users');
  let payload = {};

  if (user.canHeal > new Date(Date.now())) {
    payload = { success: false, error: 'You\'ve already healed today' };
    return Promise.resolve({ status: 400, payload });
  }

  if (user.health === 100) {
    payload = { success: false, error: 'You\'re already at max health!' };
    return Promise.resolve({ status: 400, payload });
  }

  const canHeal = new Date(new Date().setHours(24, 0, 0, 0));
  let updates = { health: Math.min(user.health + 50, 100), canHeal };
  const updated_user = await users.findOneAndUpdate({ _id: user._id }, { $set: updates }, { new: true });

  if (updated_user) {
    return Promise.resolve({ status: 200, payload: { success: true } });
  }
  payload = { success: false, error: 'Something Unexpected Happened!' };
  return Promise.resolve({ status: 500, payload });
}

const upload = async (id, image) => {
  const users = db.getDB().collection('users');
  
  if (!image) {
    const payload = { success: false, error: 'Invalid Base64 Image' };
    return Promise.resolve({ status: 400, payload });
  }

  let updated_user = await users.findOneAndUpdate({ _id: id }, { $set: { image } }, { new: true });

  if (updated_user) {
    return Promise.resolve({ status: 200, payload: { success: true } });
  }
  const payload = { success: false, error: 'Something Unexpected Happened!' };
  return Promise.resolve({ status: 500, payload });
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

  let alerts = [...friend.alerts, alert];
  let pendingFriends = [...user.pendingFriends, friend_id];

  let updated_friend = await users.findOneAndUpdate({ _id: friend_id }, { $set: { alerts } });
  let updated_user = await users.findOneAndUpdate({ _id: id }, { $set: { pendingFriends } });

  if (updated_friend && updated_user) {
    return Promise.resolve({ status: 200, payload: { success: true  } });
  }
  return Promise.resolve({ status: 500, payload: { success: false, error: 'Something Unexpected Happened!' } });
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
      return Promise.resolve({ status: 500, payload });
    }
  }

  const payload = { success: false, error: 'Alert Not Found' };
  return Promise.resolve({ status: 404, payload });
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
      return Promise.resolve({ status: 500, payload });
    }
  }

  const payload = { success: false, error: 'Alert Not Found' };
  return Promise.resolve({ status: 404, payload });
}

const update_desc = async (id, description) => {
  const users = db.getDB().collection('users');

  let updated_user = await users.findOneAndUpdate({ _id: id }, { $set: { description } });

  if (updated_user) {
    return Promise.resolve({ status: 200, payload: { success: true } });
  }
  
  const payload = { success: false, error: 'Something Unexpected Happened' };
  return Promise.resolve({ status: 500, payload });
}

const shout = async (id, data) => {
  data.user_id = id;
  return ShoutsService.sendShout(data); 
}

const reply_to_shout = async (id, data) => {
  data.user_id = id;
  return ShoutsService.sendReply(data);
}

const create_company = async (id, data) => {
  const users = db.getDB().collection('users');
  let user = await MemberService.getUser(id);

  if (user.gold < 25) {
    return Promise.resolve({ status: 400, payload: { success: false, error: 'Insufficient Funds' } });
  }

  if (data.type === 0) {
    return Promise.resolve({ status: 400, payload: { success: false, error: 'Invalid Company Type' } });
  }

  data.ceo = id;
  data.location = user.location;

  let result = await CompService.createCompany(data)
    .catch(err => err);

  if (result && result.payload.success) {
    const gold = user.gold - 25;
    let res = await users.findOneAndUpdate({ _id: id }, { $set: { gold } }, { new: true });
    
    if (res) {
      console.log('RESULT SUCCESS:', result);
      return Promise.resolve(result);
    }
    return Promise.resolve({ status: 500, payload: { success: false, error: 'Something Unexpected Happened' } });
  }
  console.log('RESULT FAIL:', result);
  return Promise.resolve(result);
}

const travel = async (id, data) => {
  const users = db.getDB().collection('users');
  let user = await MemberService.getUser(id);
  if (user) {
    if (user.location === data.dest) {
      return Promise.resolve({ status: 400, payload: { success: false, error: 'Already Located In Region' } });
    }

    let travelInfo = await RegionService.getDistance(user.location, data.dest);

    if (travelInfo) {
      if (user.gold < travelInfo.cost) {
        return Promise.resolve({ status: 400, payload: { success: false, error: 'Insufficient Funds' } });
      }

      const location = data.dest;
      const gold = user.gold - travelInfo.cost;
      let updated = await users.findOneAndUpdate({ _id: id }, { $set: { location, gold }}, { new: true });

      if (updated)
        return Promise.resolve({ status: 200, payload: { success: true } });
    }
    return Promise.resolve({ status: 500, payload: { success: false, error: 'Something Went Wrong' } });
  }
  return Promise.resolve({ status: 404, payload: { success: false, error: 'User Not Found' } });
}

const friend_request_response = async (id, data) => {
  const users = db.getDB().collection('users');
  let user = await users.findOne({ _id: id });
  let friend = await users.findOne({ _id: data.friend_id });
  let payload, user_updates, friend_updates = {};

  let index = friend.pendingFriends.indexOf(id);
  if (index >= 0) {
    friend.pendingFriends.splice(index, 1);
    user.alerts.splice(data.alert_index, 1);
  }

  switch (data.response) {
    case 'accept':
      user_updates = { alerts: user.alerts, friends: [...user.friends, friend._id] };
      friend_updates = { pendingFriends: friend.pendingFriends, friends: [...friend.friends, user._id] };
      break;
    case 'decline':
      user_updates = { alerts: user.alerts };
      friend_updates = { pendingFriends: friend.pendingFriends };
      break;
    default:
      payload = { success: false, error: 'Invalid Response Type' };
      return Promise.resolve({ status: 400, payload });
  }

  let updated_friend = users.findOneAndUpdate({ _id: friend._id }, { $set: friend_updates });
  let updated_user = users.findOneAndUpdate({ _id: id }, { $set: user_updates });

  if (updated_friend && updated_user) {
    return Promise.resolve({ status: 200, payload: { success: true } });
  }
  payload = { success: false, error: 'Something Went Wrong' };
  return Promise.resolve({ status: 500, payload });
}

const remove_friend = async (id, friend_id) => {
  const users = db.getDB().collection('users');
  let user = await users.findOne({ _id: id });
  let friend = await users.findOne({ _id: friend_id });

  let user_index = friend.friends.indexOf(id);
  let friend_index = user.friends.indexOf(friend._id);

  user.friends.splice(friend_index, 1);
  friend.friends.splice(user_index, 1);

  let user_friends = user.friends;
  let friend_friends = friend.friends;

  let updated_friend = await users.findOneAndUpdate({ _id: friend._id }, { $set: { friends: friend_friends } });
  let updated_user = await users.findOneAndUpdate({ _id: id }, { $set: { friends: user_friends } });

  if (updated_friend && updated_user) {
    return Promise.resolve({ status: 200, payload: { success: true } });
  }
  return Promise.resolve({ status: 500, payload: { success: false, error: 'Something Went Wrong!' } });
}

const purchase_item = async (id, data) => {
  const users = db.getDB().collection('users');
  let user = await users.findOne({ _id: id });
  let company = await CompService.getCompany(data.compId);
  let payload = {};

  // Validate User exists
  if (!user) {
    payload = { success: false, error: 'User Not Found!' };
    return Promise.resolve({ status: 404, payload });
  }

  // Validate Company exists
  if (!company) {
    payload = { success: false, error: 'Company Not Found!' };
    return Promise.resolve({ status: 404, payload });
  }

  // Validate offer exists
  let comp_offer = company.productOffers.find(o => o.id === data.offer.id);
  if (!comp_offer) {
    payload = { success: false, error: 'Product Offer Not Found!' };
    return Promise.resolve({ status: 404, payload });
  }

  // Validate user has sufficient funds
  // SOME ISSUE HERE
  let user_cc = user.wallet.find(cc => cc.currency === company.funds.currency) || ({ amount: 0.00 });
  let total_cost = (comp_offer.price * data.purchaseAmount);
  if (user_cc.amount < total_cost) {
    payload = { success: false, error: 'Insufficient Funds!' };
    return Promise.resolve({ status: 400, payload });
  }

  let comp_updates = {};
  let user_updates = {};
  // Subtract amount from offer, delete offer if no remaining stock
  if (comp_offer.quantity === data.purchaseAmount) {
    company.productOffers.splice(company.productOffers.indexOf(comp_offer), 1);
    comp_updates.productOffers = [...company.productOffers];
  } else if (comp_offer.quantity > data.purchaseAmount) {
    company.productOffers.splice(company.productOffers.indexOf(comp_offer), 1);
    comp_offer.quantity -= data.purchaseAmount;
    comp_updates.productOffers = [...company.productOffers, comp_offer];
  } else {
    // comp_offer.quantity < data.purchaseAmount
    payload = { success: false, error: 'Cannot Purchase More Items Than Offered' };
    return Promise.resolve({ status: 400, payload });
  }

  // Handle Money Transfer
  let new_comp_amount = company.funds.amount;
  new_comp_amount += total_cost;
  comp_updates.funds = { ...company.funds, amount: new_comp_amount };
  user.wallet.splice(user.wallet.indexOf(user_cc), 1);
  user_cc.amount -= total_cost;
  user_updates.wallet = [...user.wallet, user_cc];

  // Add item(s) to user inventory
  let item = user.inventory.find(i => i.id === comp_offer.id);
  if (item) {
    user.inventory.splice(user.inventory.indexOf(item), 1);
    item.quantity += data.purchaseAmount;
    user_updates.inventory = [...user.inventory, item]; 
  } else {
    user_updates.inventory = [...user.inventory, { id: comp_offer.id, quantity: data.purchaseAmount }];
  }

  let updated_user = await users.findOneAndUpdate({ _id: id }, { $set: user_updates });
  let updated_comp = await db.getDB().collection('companies')
    .findOneAndUpdate({ _id: data.compId }, { $set: comp_updates });

  if (updated_user && updated_comp) {
    payload = { success: true };
    return Promise.resolve({ status: 200, payload });
  }

  payload = { success: false, error: 'Something Went Wrong' };
  return Promise.resolve({ status: 500, payload });
}

const buildLevelUpAlert = level => ({
  read: false,
  type: MemberActions.LEVEL_UP,
  message: `Congrats! You have leveled up to level ${level} and received 1 gold`,
  timestamp: new Date(Date.now()),
});

module.exports = MemberService;