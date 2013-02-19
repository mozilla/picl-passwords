const {Cc,Ci,Cu} = require("chrome");

var PasswordFormats = function(PICL) {
  return {
    PICLToLoginManager: function(PICLPassword) {
      // Prepare a password object from the server for entry into
      // jetpack's passwords.store
      return {
        url: PICLPassword.loginurl || '',
        formSubmitURL: PICLPassword.loginurl || PICLPassword.url || '',
        username: PICLPassword.username || '',
        password: PICLPassword.password || ''
      }
    },
    loginManagerToPICL: function(loginManagerPassword) {
      var loginMeta = loginManagerPassword.QueryInterface(Ci.nsILoginMetaInfo);
      return {
        guid: loginMeta.guid,
        url: loginManagerPassword.url,
        loginurl: loginManagerPassword.formSubmitURL || '',
        username: loginManagerPassword.username || '',
        password: loginManagerPassword.password || '',
        // TODO: Be mindful of timezones
        lastModified: loginMeta.timePasswordChanged || (Date.now())
      };
    }
  }
}

exports['PasswordFormats'] = PasswordFormats;