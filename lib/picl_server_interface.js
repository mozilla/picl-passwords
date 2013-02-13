const DUMMY_DOC = [
  {
    "id": "6760ab7f-e8f8-a7a5-e5ca-0960ccdba4c6",
    "loginurl": "https://www.mozilla.com/login",
    "username": "gombottest",
    "password": "green"
  }
];

var ServerInterface = function() {
  var authed = false;
  
  function _requireAuth(func) {
    return function() {
      if (authed) {
        return func.apply(this,arguments);
      }
      return false;
    }
  }
  
  return {
    auth: function(username, password, cb) {
      // TODO
      authed = true;
      if (cb) {
        cb(true); 
      }
    },
    getPasswords: _requireAuth(function(cb) {
      console.log('getPasswords');
      cb(DUMMY_DOC);
    }),
    isAuthed: function() {
      return authed;
    }
  };
};

exports['ServerInterface'] = ServerInterface;