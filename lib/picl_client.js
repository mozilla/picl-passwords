var passwords = require('sdk/passwords');
var ServerInterface = require('picl_server_interface').ServerInterface;

var Client = (function() {
  var serverInterface = new ServerInterface();
  serverInterface.auth('test','test');
  
  function locallyReconcilePasswords(remotePasswords) {
    
    // Prepare a password object from the server for entry into
    // jetpack's passwords.store
    function formatPassword(password) {
      return {
        url: password.loginurl || '',
        formSubmitURL: password.loginurl || password.url || '',
        username: password.username || '',
        password: password.password || ''
      }
    }
    
    for (var i in remotePasswords) {
      passwords.store(formatPassword(remotePasswords[i]));
      console.log('password: ', JSON.stringify(remotePasswords[i]));
    }
  }
  
  return {
    loadPasswords: function() {
      if (serverInterface.isAuthed()) {
        serverInterface.getPasswords(locallyReconcilePasswords);
      }
    }
  }
})();

exports['Client'] = Client;