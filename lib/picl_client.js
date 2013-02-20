var Client = (function(PICL) {
  return {
    start: function() {
      PICL.Crypto.makeKeys('me@paulsawaya.com','password', function() {
        console.log('made keys, now exporting passwords');
        var passwords = PICL.PasswordAdapter.exportLocalPasswords();
        console.log('exported passwords', JSON.stringify(passwords));
        PICL.Sync.push(passwords);
      });
    }
  }
})

exports['Client'] = Client;