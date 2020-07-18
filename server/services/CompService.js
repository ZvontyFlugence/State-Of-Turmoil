const db = require('../db');

const CompService = {};

CompService.createCompany = async data => {
  let companies = db.getDB().collection('companies');

  let comp_doc = {
    _id: await companies.estimatedDocumentCount() + 1,
    name: data.name,
    image: process.env.DEFAULT_COMP_PIC,
    type: data.type,
    ceo: data.ceo,
    location: data.location,
    funds: [],
    inventory: [],
    employees: [],
    productOffers: [],
    jobOffers: [],
  };

  let res = await companies.insert(comp_doc);
  let company = res.ops[0];

  if (company) {
    return Promise.resolve({ status: 201, payload: { success: true, comp_id:  company._id } });
  }
  return Promise.resolve({ status: 500, payload: { success: false, error: 'Something Unexpected Happened' } });
}

CompService.deleteCompany = async (user_id, comp_id) => {
  let companies = db.getDB().collection('companies');
  let payload = {};

  if (companies.ceo !== user_id) {
    payload = { success: false, error: 'You are not the company CEO' };
    return Promise.resolve({ status: 400, payload });
  }

  let deleted = await companies.findOneAndDelete({ _id: comp_id });

  if (deleted) {
    let users = db.getDB().collection('users');
    let updated_ceo = await users.findOneAndUpdate({ _id: user_id }, { $inc: { gold: 12 } });

    if (updated_ceo) {
      payload = { success: true };
      return Promise.resolve({ status: 200, payload });
    }

    payload = { success: false, error: 'Failed to Update User' };
    return Promise.resolve({ status: 500, payload });
  }

  payload = { success: false, error: 'Failed to Delete Company' };
  return Promise.resolve({ status: 500, payload });
}

CompService.updateCompanyDetails = async (user_id, comp_id, data) => {
  let companies = db.getDB().collection('companies');
  let payload, updates = {};

  if (!data.hasOwnProperty('name') && !data.hasOwnProperty('image')) {
    payload = { success: false, error: 'No valid updates provided' };
    return Promise.resolve({ status: 400, payload });
  }

  if (data.hasOwnProperty('name')) {
    updates.name = data.name;
  }

  if (data.hasOwnProperty('image')) {
    updates.image = data.image;
  }

  let updated_comp = companies.findOneAndUpdate({ _id: comp_id }, { $set: updates });

  if (updated_comp) {
    payload = { success: true };
    return Promise.resolve({ status: 200, payload });
  }

  payload = { success: false, error: 'Failed to Update Company' };
  return Promise.resolve({ status: 500, payload});
}

CompService.getCompany = async id => {
  const companies = db.getDB().collection('companies');
  return await companies.findOne({ _id: id });
}

CompService.getUserCompanies = async ceo_id => {
  const companies = db.getDB().collection('companies');
  return await companies.find({ ceo: ceo_id }).toArray();
}

module.exports = CompService;