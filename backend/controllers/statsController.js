exports.getStats = (req, res) => {
  // In a real app, this would query a database for aggregate data
  res.json({
    total_checks: 1284,
    prevention_rate: "99.4%",
    blocked_swaps: 42,
    risk_distribution: {
      low: 850, // Fixed the math from previous hardcoded 85+12+3=100
      suspicious: 120,
      high: 314
    },
    weekly_trend: [45, 52, 38, 65, 48, 55, 60]
  });
};
