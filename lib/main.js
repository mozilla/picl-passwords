var _ = require('lib/underscore');

var PICLModules = {
  'Client': require('picl_client'),
  'Crypto': require('picl_crypto'),
  'PasswordFormats': require('password_formats'),
  'ServerInterface': require('picl_server_interface'),
  'Sync': require('picl_sync'),
  '_': _
};

var PICL = require('picl').PICL(PICLModules);

function main() {
  console.log('PICL: ', PICL);
  PICL.startClient();
  PICL.Crypto.makeKeys('paul','herpderp');
}
main();