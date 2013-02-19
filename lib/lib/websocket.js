
// provide a WebSocket-like object, backed by a real WebSocket running in a
// page-worker. It has some significant limitations:
//
// the "origin" of the socket will always be
//   resource://$JID/websocket-worker.html
// several WebSocket attributes will not be populated or updated:
//   binaryType, bufferedAmount, extensions, protocol, readyState, url
// the events delivered to onclose/onerror/onmessage/onopen are plain objects,
//   and are almost entirely empty (except for onmessage({data:}) )

// you must copy websocket-worker.{html,js} into your addon's data/ directory
var data = require("self").data;
var pageWorkers = require("page-worker");

function fakeWebSocket(url, protocols) {
    var self = this;
    if (protocols === undefined)
        protocols = [];
    else if (typeof(protocols) === "string")
        protocols = [protocols];

    this.wsWorker = pageWorkers.Page({
        contentUrl: data.url("websocket-worker.html"),
        contentScriptFile: data.url("websocket-worker.js")
    });
    this.send = function(data) {
        this.wsWorker.port.emit("send", data);
    };
    this.close = function() {
        this.wsWorker.port.emit("close");
    };

    this.wsWorker.on("message", function(m) {
        if (m.type == "open" && self.onopen)
            self.onopen({});
        if (m.type == "message" && self.onmessage)
            self.onmessage({data: m.data});
        if (m.type == "error" && self.onerror)
            self.onerror({});
        if (m.type == "close" && self.onclose)
            self.onclose({});
    });

    this.wsWorker.port.emit("start", {url: url, protocols: protocols});
}

exports.WebSocket = fakeWebSocket;
