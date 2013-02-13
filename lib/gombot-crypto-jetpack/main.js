
var data = require("self").data;
const {defer} = require("sdk/core/promise");

// we create a long-running page-worker that does the KDF work inside a
// web-worker, to get around a JS/jetpack performance bug. You must include
// the following files in data/ :
//   data/gombot-worker1.html
//   data/gombot-worker1.js
//   data/gombot-worker2.js
//   data/sjcl-with-cbc.js
//   data/gombot-content.js


var worker = require("page-worker").Page({
    contentURL: data.url("gombot-crypto-jetpack/gombot-worker1.html")
});
//console.log("page-worker created");

var counter = 0;
function nextCounter() {
    counter += 1;
    return counter;
}
var pendingKDF = {}; // maps counter to deferred
var pendingEncrypt = {};
var pendingDecrypt= {};

worker.port.on("kdf-done", function(m) {
    //console.log("gombot.js kdf-done", JSON.stringify(m));
    pendingKDF[m.reqID].resolve(m.keys);
    delete pendingKDF[m.reqID];
});

exports.kdf = function(email, password) {
    // returns a Deferred
    var d = defer();
    //console.log("asking worker to kdf");
    var c = nextCounter();
    pendingKDF[c] = d;
    worker.port.emit("kdf", {reqID: c, email: email, password: password});
    //console.log("asked worker to kdf");
    return d.promise;
};

worker.port.on("encrypt-done", function(m) {
    console.log("gombot.js encrypt-done", m.msgmac_b64);
    console.log("gombot.js encrypt-done took", m.elapsed);
    pendingEncrypt[m.reqID].resolve(m);
    delete pendingEncrypt[m.reqID];
});

exports.encrypt = function(keys, data, forceIV) {
    if (typeof(data) != "string") {
        console.log("gombot.encrypt data= must be a string");
        throw new Error("gombot.encrypt data= must be a string");
    }
    // forceIV is only for testing. In normal use, leave it undefined.
    var d = defer();
    var c = nextCounter();
    pendingEncrypt[c] = d;
    //console.log("asking worker to kdf");
    worker.port.emit("encrypt", {reqID: c,
                                 keys: keys, data: data, forceIV: forceIV});
    return d.promise;
};

worker.port.on("decrypt-done", function(m) {
    console.log("gombot.js encrypt-done", m.plaintext);
    console.log("gombot.js encrypt-done took", m.elapsed);
    pendingDecrypt[m.reqID].resolve(m);
    delete pendingDecrypt[m.reqID];
});

worker.port.on("decrypt-error", function(m) {
    console.log("gombot.js encrypt-error", m.error);
    pendingDecrypt[m.reqID].reject(m.error);
    delete pendingDecrypt[m.reqID];
});

exports.decrypt = function(keys, msgmac_b64) {
    if (typeof(msgmac_b64) != "string") {
        console.log("gombot.decrypt msgmac_b64= must be a string");
        throw new Error("gombot.decrypt msgmac_b64= must be a string");
    }
    var d = defer();
    var c = nextCounter();
    pendingDecrypt[c] = d;
    worker.port.emit("decrypt", {reqID: c,
                                 keys: keys, msgmac_b64: msgmac_b64});
    return d.promise;
};

exports.addEntropy = function(data, numBits, source) {
    if (typeof(data) != "string") {
        console.log("gombot.addEntropy data= must be a string");
        throw new Error("gombot.addEntropy data= must be a string");
    }
    if (typeof(numBits) != "number") {
        console.log("gombot.addEntropy numBits= must be an integer");
        throw new Error("gombot.addEntropy numBits= must be an integer");
    }
    if (typeof(source) != "string") {
        console.log("gombot.addEntropy source= must be a string");
        throw new Error("gombot.addEntropy source= must be a string");
    }
    worker.port.emit("add-entropy",
                     {data: data, numBits: numBits, source: source});
};

// add entropy from the OS's RNG before doing anything else
exports.addEntropy(require("gombot-crypto-jetpack/entropy").generateRandomBytesHex(32),
                   32*8,
                   "nsIRandomGenerator");
