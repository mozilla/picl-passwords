const DUMMY_DOC = [
  {
    "id": "6760ab7f-e8f8-a7a5-e5ca-0960ccdba4c6",
    "loginurl": "https://www.mozilla.com/login",
    "username": "gombottest",
    "password": "green"
  }
];

(function() {
  ServerInterface = function() {
    this.authed = false;
  }
  
  function _requireAuth(func) {
    return function() {
      if (this.authed) {
        return func.apply(this,arguments);
      }
      return false;
    }
  }
  
  ServerInterface.prototype = {
    auth: function(username, password, cb) {
      // TODO
      this.authed = true;
      if (cb) {
        cb(true); 
      }
    },
    getPasswords: _requireAuth(function(cb) {
      console.log('getPasswords');
      cb(DUMMY_DOC);
    }),
    isAuthed: function() {
      return this.authed;
    }
  };
})();

exports['ServerInterface'] = ServerInterface;