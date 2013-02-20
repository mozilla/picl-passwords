var _ = require('lib/underscore');

var PICLModules = {
  'Client': require('picl_client'),
  'Crypto': require('picl_crypto'),
  'Firebase': require('picl_firebase'),
  'PasswordAdapter': require('picl_password_adapter'),
  'PasswordFormats': require('password_formats'),
  'ServerInterface': require('picl_server_interface'),
  'Sync': require('picl_sync'),
  '_': _
};

// mixin guid creation into underscore
_.mixin({
  guid: (function() {
    function S4() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    // Generate a pseudo-GUID by concatenating random hexadecimal.
    return function() {
      return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    };
  })()
});

var PICL = require('picl').PICL(PICLModules);

function main() {
  console.log('PICL: ', PICL);
  PICL.Client.start();
  
  // var nameRef = new Firebase('https://picl-sync.firebaseIO.com/test/');
  // nameRef.set({'blah':'ble'}, function(error, dummy) {
  //   console.log('data saved with error: ', error);
  // });
  
}
main();