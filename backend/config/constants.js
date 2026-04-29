module.exports = {
  PORT: process.env.PORT || 4000,
  ALLOWED_PLANS: ["STARTER", "GROWTH", "ENTERPRISE"],
  PLAN_RANK: {
    STARTER: 0,
    GROWTH: 1,
    ENTERPRISE: 2,
  },
  NIGERIAN_PHONE_REGEX: /^(0|\+234)[7-9][0-1]\d{8}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};
