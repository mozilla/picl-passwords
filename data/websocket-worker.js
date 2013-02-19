var ws;
self.port.on("start", function(m) {
    //console.log("worker do start", m.url);
    ws = new WebSocket(m.url, m.protocols);
    ws.onopen = function(ev) {
        //console.log("worker got open");
        self.postMessage({type: "open"});
    };
    ws.onmessage = function(ev) {
        //console.log("worker got message", ev.data);
        self.postMessage({type: "message", data: ev.data});
    };
    ws.onerror = function(ev) {
        //console.log("worker got error");
        self.postMessage({type: "error"});
    };
    ws.onclose = function(ev) {
        //console.log("worker got close");
        self.postMessage({type: "close"});
        ws = null;
    };
    //console.log(" worker finish do start");
});

self.port.on('send', function(m) {
    //console.log("worker do send", m);
    ws.send(m);
});

self.port.on("close", function(m) {
    //console.log("worker do close");
    if (ws)
        ws.close();
});