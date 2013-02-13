var passwords = require('sdk/passwords');

var Client = (function(PICL) {
  function addPasswords(remotePasswords) {
    console.log('in PICL.Client.addPasswords');
    for (var i in remotePasswords) {
      var formattedLogin = PasswordFormats.PICLToLoginManager(remotePasswords[i]);
      passwords.store(formattedLogin);
      console.log('password: ', JSON.stringify(remotePasswords[i]));
    }
  }
  
  function exportLocalPasswords(cb) {
    passwords.search({
      onComplete: function(credentials) {
        var pf = PICL.PasswordFormats;
        var formattedLogins = credentials.map(pf.loginManagerToPICL);
        console.log('formatted logins: ', JSON.stringify(formattedLogins));
        if (cb) {
          cb(formattedLogins); 
        }
      }
    })
  }
  
  return {
    addPasswords: addPasswords,
    exportLocalPasswords: exportLocalPasswords
  }
});

exports['Client'] = Client;