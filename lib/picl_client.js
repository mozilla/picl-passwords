const {Cc,Ci,Cu} = require("chrome");

var loginManager = Cc["@mozilla.org/login-manager;1"].getService(Ci.nsILoginManager);
// var passwords = require('sdk/passwords');

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
    var credentials = loginManager.getAllLogins();
    console.log('Properties of a credential: ', JSON.stringify(credentials[0]))
    var pf = PICL.PasswordFormats;
    var formattedLogins = credentials.map(pf.loginManagerToPICL);
    console.log('formatted logins: ', JSON.stringify(formattedLogins));
    if (cb) {
      cb(formattedLogins); 
    }
  }
  
  function start() {
    
    PICL.Client.exportLocalPasswords(function(passwords) {
      console.log('exported passwords', JSON.stringify(passwords));
    })
    return;
    
    PICL.Crypto.makeKeys('me@paulsawaya.com','password', function() {
      PICL.Client.exportLocalPasswords(function(passwords) {
        console.log('exported passwords')
        PICL.Crypto.encrypt(JSON.stringify(passwords[0]), function(ciphertext) {
          console.log('ciphertext would be here: ', ciphertext); //, _.keys(ciphertext));
          PICL.Crypto.decrypt(ciphertext, function(plaintext) {
            console.log('obtained plaintext: ', plaintext);
          });
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