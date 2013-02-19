var gombotCrypto = require("gombot-crypto-jetpack/main");

var Crypto = function(PICL) {
  var keys = null;
  
  return {
    makeKeys: function(username, password, cb) {
      gombotCrypto.kdf(username, password).then(function(newKeys) {
        keys = newKeys;
        if (cb) {
          cb(keys); 
        }
      });
    },
    encrypt: function(data, cb) {
      if (!keys) {
        cb(false);
        return;
      }
      gombotCrypto.encrypt(keys, data).then(function(encrypted) {
        cb(encrypted.msgmac_b64);
      }, function failure(err) {
        cb(false);
      });
    },
    decrypt: function(data, cb) {
      if (!keys) {
        cb(false);
        return;
      }
      gombotCrypto.decrypt(keys, data).then(function(decrypted) {
        cb(decrypted.plaintext);
      }, function failure(err) {
        cb(false);
      });
    }
  }
};

exports['Crypto'] = Crypto;
