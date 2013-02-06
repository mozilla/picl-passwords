var PICL = (function() {
  var Client = require('picl_client').Client;
  
  // createPICL();
  
  return {
    startClient: function() {
      Client.loadPasswords();
    }
  }
})();

exports['PICL'] = PICL;

