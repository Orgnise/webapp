module.exports = class UserCredentialData {
  credentials = () => {
    const credentials = [
      {
        username: "admin",
        password: "admin",
        email: "admin@admin",
        role: "admin",
      },
      {
        username: "user",
        password: "user",
        email: "user@user",
        role: "user",
      },
      {
        username: "guest",
        password: "guest",
        email: "guest@guest",
        role: "guest",
      },
    ];
  };

  // Verify that the user is logged in
  // Language: javascript
  // Path: server/src/user_credential_data.js
  // Compare this snippet from src/App.js:
  verifyUser = (username, password) => {
    const user = this.credentials.find(
      (user) => user.username === username && user.password === password
    );
    return user;
  };
};
