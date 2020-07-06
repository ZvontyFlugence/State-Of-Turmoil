const db = require('../db');

const CompService = {};

CompService.createCompany = async data => {
  let companies = db.getDB().collection('companies');

  let comp_doc = {
    _id: companies.estimatedDocumentCount() + 1,
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
  return Promise.reject({ status: 500, payload: { success: false, error: 'Something Unexpected Happened' } });
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