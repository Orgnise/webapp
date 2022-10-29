module.exports = {
  jwtTokenSecret: process.env.TOKEN_KEY || "Jwt-secret-key",
  jwtExpiration: 3600 * 12, // 1 hour * 12 hours
  jwtRefreshExpiration: 86400 * 7, // 24 hours * 7 days

  /* for test */
  // jwtExpiration: 60,          // 1 minute
  // jwtRefreshExpiration: 120,  // 2 minutes
};
