
const { Cc, Ci } = require("chrome");
let rng = Cc["@mozilla.org/security/random-generator;1"]
    .createInstance(Ci.nsIRandomGenerator);

exports.generateRandomBytesHex = function(length) {
    // returns an array of integers
    let bytes = rng.generateRandomBytes(length);
    // copied from mozilla-central/services/sync/modules/jpakeclient.js .
    // Converts to hex and tolerates the fact that byte.toString(16) is not
    // "%02x"%byte (it returns single-character strings for small numbers)
    var s = [("0" + byte.toString(16)).slice(-2) 
             for each (byte in bytes)].join("");
    return s;
};
