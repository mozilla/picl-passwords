const {Cc,Ci,Cu} = require("chrome");

var passwords = require('passwords');

var _ = require('lib/underscore');

var loginManager = Cc["@mozilla.org/login-manager;1"].getService(Ci.nsILoginManager);
// var passwords = require('sdk/passwords');

var PasswordAdapter = (function(PICL) {
  function addPasswords(remotePasswords) {
    console.log('in PICL.PasswordAdapter.addPasswords');
    _.each(remotePasswords, function(remotePassword) {
      var formattedLogin = PasswordFormats.PICLToLoginManager(remotePassword);
      
      // TODO: Add passwords without jetpack passwords module
      passwords.store(formattedLogin);
      console.log('password: ', JSON.stringify(remotePasswords));
    });
  }
  
  function exportLocalPasswords(cb) {
    var credentials = loginManager.getAllLogins();
    console.log('Properties of a credential: ', JSON.stringify(credentials[0]))
    var pf = PICL.PasswordFormats;
    var formattedLogins = credentials.map(pf.loginManagerToPICL);
    console.log('formatted logins: ', JSON.stringify(formattedLogins));
    return formattedLogins;
  }  
  return {
    addPasswords: addPasswords,
    exportLocalPasswords: exportLocalPasswords,
  };
});

exports['PasswordAdapter'] = PasswordAdapter;