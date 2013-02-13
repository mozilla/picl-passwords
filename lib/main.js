var _ = require('lib/underscore');

var PICLModules = {
  'Client': require('picl_client'),
  'Sync': require('picl_sync'),
  'PasswordFormats': require('password_formats'),
  'ServerInterface': require('picl_server_interface'),
  '_': _
};

var PICL = require('picl').PICL(PICLModules);

function main() {
  console.log('PICL: ', PICL);
  PICL.startClient();
  // require("gombot-crypto-jetpack/main").kdf('me@paulsawaya.com', 'afantasticpassword').then(function(keys) {
  //   console.log('keys: ', JSON.stringify(keys));
  //   // callback(null, keys);
  // });
}
main();