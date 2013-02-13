var Sync = function(PICL) {
  var serverInterface = PICL.ServerInterface;
  
  function auth(cb) {
     if (serverInterface.auth('test','test')) {
       cb();
     } 
  }
  return {
    syncRemotePasswords: function() {
      function fetchPasswords() {
        serverInterface.getPasswords(PICL.Client.addPasswords);
      }
      if (!serverInterface.isAuthed()) {
        auth(fetchPasswords);
      }
      fetchPasswords();
    }
  }
};


exports['Sync'] = Sync;