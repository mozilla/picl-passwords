var _ = require('lib/underscore');

var PICL = {};

_PICL = function(PICLModules) {
  
  PICLModules = PICLModules || {};
  
  function getModule(module,moduleName) {
    PICL[moduleName] = module[moduleName](PICL);
  }
  
  _.each(PICLModules,getModule);
    
  // createPICL();
  
  PICL.startClient = function() {
    console.log('PICL keys: ', _.keys(PICL));
    
    PICL.Client.exportLocalPasswords();
  };
  return PICL;
};

  // console.log('PICL is currently: ', _.keys(PICL));

exports.PICL = _PICL;

