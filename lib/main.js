var _ = require('lib/underscore');

var PICLModules = {
  'Client': require('picl_client'),
  'Crypto': require('picl_crypto'),
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
}
main();