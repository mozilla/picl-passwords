
/* inside a web-worker, we can use importScripts(); */

function tostr(s) {
    if (typeof(s) == "string")
        return s;
    return JSON.stringify(s);
}

console = {log: function(m, m2) {dump(tostr(m));
                                 if (m2)
                                     dump(" "+tostr(m2));
                                 dump("\n");
                                }};

//console.log("worker2.js loading");

importScripts("sjcl-with-cbc.js");
importScripts("gombot-content.js");

self.onmessage = function(m) {
    //console.log("onmessage");
    //console.log(m.data);
    if (m.data.type == "kdf") {
        //console.log("worker do kdf", m.data);
        var start = new Date().getTime();
        var keys = gombot_kdf(m.data.email, m.data.password);
        //console.log(" worker finish do kdf emit");
        var end = new Date().getTime();
        self.postMessage(JSON.stringify({type: "kdf-done",
                                         reqID: m.data.reqID,
                                         keys: keys,
                                         elapsed: (end-start)/1000}));
        //console.log(" worker finish do kdf");
    }

    if (m.data.type == "encrypt") {
        //console.log("worker do encrypt", m.data);
        var start = new Date().getTime();
        var msgmac_b64 = gombot_encrypt(m.data.keys, m.data.data, m.data.forceIV);
        //console.log(" worker finish do encrypt emit");
        var end = new Date().getTime();
        self.postMessage(JSON.stringify({type: "encrypt-done",
                                         reqID: m.data.reqID,
                                         msgmac_b64: msgmac_b64,
                                         elapsed: (end-start)/1000}));
        //console.log(" worker finish do encrypt");
    }

    if (m.data.type == "decrypt") {
        var start = new Date().getTime();
        try {
            var plaintext = gombot_decrypt(m.data.keys, m.data.msgmac_b64);
            var end = new Date().getTime();
            self.postMessage(JSON.stringify({type: "decrypt-done",
                                             reqID: m.data.reqID,
                                             plaintext: plaintext,
                                             elapsed: (end-start)/1000}));
        } catch(e) {
            // unrecognized version prefix, or corrupt MAC
            var end = new Date().getTime();
            self.postMessage(JSON.stringify({type: "decrypt-error",
                                             reqID: m.data.reqID,
                                             error: e.toString(),
                                             elapsed: (end-start)/1000}));
        }
    }

    if (m.data.type == "add-entropy") {
        gombot_addEntropy(m.data.data, m.data.numBits, m.data.source);
    }

};

//console.log("worker.js loaded");
