const { PLAN_RANK } = require("../config/constants");

// In-memory storage (Professional app would use Redis or a Database)
const createdKeys = [];

const generateKeyString = () => 
  `sk_live_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;

const calculateExpiry = (startDate) => {
  const expiry = new Date(startDate);
  expiry.setFullYear(expiry.getFullYear() + 1);
  return expiry.toISOString();
};

const findKeyByEmail = (email) => {
  return createdKeys.find((k) => k.email.toLowerCase() === email.toLowerCase());
};

const createKey = (owner, company, email, plan) => {
  const purchasedDate = new Date();
  const payload = {
    key: generateKeyString(),
    owner,
    company,
    email,
    plan,
    purchased_date: purchasedDate.toISOString(),
    expiry_date: calculateExpiry(purchasedDate),
    created_at: purchasedDate.toISOString(),
  };

  createdKeys.push(payload);
  return payload;
};

const updateKey = (existingUser, newPlan) => {
  const now = new Date();
  existingUser.plan = newPlan;
  existingUser.key = generateKeyString();
  existingUser.purchased_date = now.toISOString();
  existingUser.expiry_date = calculateExpiry(now);
  return existingUser;
};

module.exports = {
  findKeyByEmail,
  createKey,
  updateKey,
  generateKeyString,
};
