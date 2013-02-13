
/* console.log is not available here */

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
//console.log("gombot-worker1.js loading");

var worker = new Worker("gombot-worker2.js");

worker.onmessage = function(r) {
    //console.log(" worker finish test-webworker", r.data);
    var data = JSON.parse(r.data);
    if (data.type == "kdf-done") {
        addon.port.emit("kdf-done", {reqID: data.reqID,
                                     keys: data.keys,
                                     elapsed: data.elapsed});
    } else if (data.type == "encrypt-done") {
        addon.port.emit("encrypt-done", {reqID: data.reqID,
                                         msgmac_b64: data.msgmac_b64,
                                         elapsed: data.elapsed});
    } else if (data.type == "decrypt-done") {
        addon.port.emit("decrypt-done", {reqID: data.reqID,
                                         plaintext: data.plaintext,
                                         elapsed: data.elapsed});
    } else if (data.type == "decrypt-error") {
        addon.port.emit("decrypt-error", {reqID: data.reqID,
                                         error: data.error,
                                         elapsed: data.elapsed});
    } else {
        console.log("worker1 got weird response", r.data);
    }
    //console.log(" worker finish test-webworker sent response");
};

addon.port.on("kdf", function(m) {
    //console.log("worker do test-webworker", m);
    worker.postMessage({type: "kdf", reqID: m.reqID,
                        email: m.email, password: m.password});
});

addon.port.on("encrypt", function(m) {
    worker.postMessage({type: "encrypt", reqID: m.reqID,
                        keys: m.keys, data: m.data, forceIV: m.forceIV});
});

addon.port.on("decrypt", function(m) {
    worker.postMessage({type: "decrypt", reqID: m.reqID,
                        keys: m.keys, msgmac_b64: m.msgmac_b64});
});

addon.port.on("add-entropy", function(m) {
    worker.postMessage({type: "add-entropy",
                        data: m.data, numBits: m.numBits, source: m.source});
});
