var PICL = {};

_PICL = function(PICLModules) {
  
  PICLModules = PICLModules || {};
  
  function getModule(module,moduleName) {
    PICL[moduleName] = module[moduleName](PICL);
  }
  
  // Bootstrap underscore.js
  var _ = PICLModules._;
  
  _.each(PICLModules,getModule);
    
  PICL.startClient = function() {
    PICL.Client.start()
  };
  return PICL;
};

  // console.log('PICL is currently: ', _.keys(PICL));

exports.PICL = _PICL;

