var _ = require('lib/underscore');

var Sync = function(PICL) {
  var Firebase  = require('lib/firebase-jetpack').Firebase;
  var serverInterface = PICL.ServerInterface;
  
  function auth(cb) {
     if (serverInterface.auth('test','test')) {
       cb();
     } 
  }
  return {
    push: function(passwordObjs) {
      // TODO: Store passwords locally in proper user model
      // Create encrypted passwords blob
      function encryptedBlobItem(plaintextPasswordObj,cb) {
        PICL.Crypto.encrypt(JSON.stringify(plaintextPasswordObj), function(ciphertext) {
          var obj = {
            guid: plaintextPasswordObj.guid,
            timestamp: plaintextPasswordObj.lastModified,
            ciphertext: ciphertext
          };
          console.log('plaintextPasswordObj: ', JSON.stringify(plaintextPasswordObj));
          cb(obj);
        });
      }
      // console.log('\n\n\n\na list? \n',typeof(passwordObjs));
      
      _.each(passwordObjs,function(passwordObj) {
        console.log('passwordObj: ', JSON.stringify(passwordObj));
        encryptedBlobItem(passwordObj, function(encryptedBlob) {
         PICL.Firebase.syncPasswordUpstream(encryptedBlob);
        });
      });

    },
    syncRemotePasswords: function() {
      function fetchPasswords() {
        serverInterface.getPasswords(PICL.PasswordAdapter.addPasswords);
      }
      if (!serverInterface.isAuthed()) {
        auth(fetchPasswords);
      }
      fetchPasswords();
    }
  }
};


exports['Sync'] = Sync;