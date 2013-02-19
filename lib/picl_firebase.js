var Firebase = function(PICL) {
  var FirebaseClient  = require('lib/firebase-jetpack').Firebase;
  const FIREBASE_URL = 'https://picl-sync.firebaseIO.com/';
  
  
  // var passwordBlob = FirebaseClient(FIREBASE_URL + 'passwords_blob');

  // Monitor password blob changes.
  // passwordBlob.on('value', function() {
  //   
  // });
  return {
    getPasswordBlobIndex: function() {

      // passwordBlob.on()
    },
    syncPasswordUpstream: function(encryptedPasswordBlob) {
      var passwordBlob = new FirebaseClient(FIREBASE_URL + 'passwords/' + encryptedPasswordBlob.guid);
      console.log('pblob: ', JSON.stringify(encryptedPasswordBlob));
      passwordBlob.set(encryptedPasswordBlob, function(error, dummy) {});
    }
  }
};

exports.Firebase = Firebase;