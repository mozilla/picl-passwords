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
  
  function start() {
    PICL.Crypto.makeKeys('me@paulsawaya.com','password', function() {
      console.log('made keys')
      PICL.Client.exportLocalPasswords(function(passwords) {
        console.log('exported passwords')
        PICL.Crypto.encrypt(JSON.stringify(passwords[0]), function(ciphertext) {
          console.log('ciphertext: ', ciphertext);
        })
      });
    });
  }
  
  return {
    addPasswords: addPasswords,
    exportLocalPasswords: exportLocalPasswords,
    start: start
  };
});

exports['Client'] = Client;