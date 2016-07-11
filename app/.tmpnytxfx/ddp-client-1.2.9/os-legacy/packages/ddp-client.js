(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/ddp-client/namespace.js                                                                           //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
/**                                                                                                           // 1
 * @namespace DDP                                                                                             // 2
 * @summary Namespace for DDP-related methods/classes.                                                        // 3
 */                                                                                                           // 4
DDP          = {};                                                                                            // 5
LivedataTest = {};                                                                                            // 6
                                                                                                              // 7
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/ddp-client/id_map.js                                                                              //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
MongoIDMap = function () {                                                                                    // 1
  var self = this;                                                                                            // 2
  IdMap.call(self, MongoID.idStringify, MongoID.idParse);                                                     // 3
};                                                                                                            // 4
                                                                                                              // 5
Meteor._inherits(MongoIDMap, IdMap);                                                                          // 6
                                                                                                              // 7
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/ddp-client/stream_client_nodejs.js                                                                //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
// @param endpoint {String} URL to Meteor app                                                                 // 1
//   "http://subdomain.meteor.com/" or "/" or                                                                 // 2
//   "ddp+sockjs://foo-**.meteor.com/sockjs"                                                                  // 3
//                                                                                                            // 4
// We do some rewriting of the URL to eventually make it "ws://" or "wss://",                                 // 5
// whatever was passed in.  At the very least, what Meteor.absoluteUrl() returns                              // 6
// us should work.                                                                                            // 7
//                                                                                                            // 8
// We don't do any heartbeating. (The logic that did this in sockjs was removed,                              // 9
// because it used a built-in sockjs mechanism. We could do it with WebSocket                                 // 10
// ping frames or with DDP-level messages.)                                                                   // 11
LivedataTest.ClientStream = function (endpoint, options) {                                                    // 12
  var self = this;                                                                                            // 13
  options = options || {};                                                                                    // 14
                                                                                                              // 15
  self.options = _.extend({                                                                                   // 16
    retry: true                                                                                               // 17
  }, options);                                                                                                // 18
                                                                                                              // 19
  self.client = null;  // created in _launchConnection                                                        // 20
  self.endpoint = endpoint;                                                                                   // 21
                                                                                                              // 22
  self.headers = self.options.headers || {};                                                                  // 23
  self.npmFayeOptions = self.options.npmFayeOptions || {};                                                    // 24
                                                                                                              // 25
  self._initCommon(self.options);                                                                             // 26
                                                                                                              // 27
  //// Kickoff!                                                                                               // 28
  self._launchConnection();                                                                                   // 29
};                                                                                                            // 30
                                                                                                              // 31
_.extend(LivedataTest.ClientStream.prototype, {                                                               // 32
                                                                                                              // 33
  // data is a utf8 string. Data sent while not connected is dropped on                                       // 34
  // the floor, and it is up the user of this API to retransmit lost                                          // 35
  // messages on 'reset'                                                                                      // 36
  send: function (data) {                                                                                     // 37
    var self = this;                                                                                          // 38
    if (self.currentStatus.connected) {                                                                       // 39
      self.client.send(data);                                                                                 // 40
    }                                                                                                         // 41
  },                                                                                                          // 42
                                                                                                              // 43
  // Changes where this connection points                                                                     // 44
  _changeUrl: function (url) {                                                                                // 45
    var self = this;                                                                                          // 46
    self.endpoint = url;                                                                                      // 47
  },                                                                                                          // 48
                                                                                                              // 49
  _onConnect: function (client) {                                                                             // 50
    var self = this;                                                                                          // 51
                                                                                                              // 52
    if (client !== self.client) {                                                                             // 53
      // This connection is not from the last call to _launchConnection.                                      // 54
      // But _launchConnection calls _cleanup which closes previous connections.                              // 55
      // It's our belief that this stifles future 'open' events, but maybe                                    // 56
      // we are wrong?                                                                                        // 57
      throw new Error("Got open from inactive client " + !!self.client);                                      // 58
    }                                                                                                         // 59
                                                                                                              // 60
    if (self._forcedToDisconnect) {                                                                           // 61
      // We were asked to disconnect between trying to open the connection and                                // 62
      // actually opening it. Let's just pretend this never happened.                                         // 63
      self.client.close();                                                                                    // 64
      self.client = null;                                                                                     // 65
      return;                                                                                                 // 66
    }                                                                                                         // 67
                                                                                                              // 68
    if (self.currentStatus.connected) {                                                                       // 69
      // We already have a connection. It must have been the case that we                                     // 70
      // started two parallel connection attempts (because we wanted to                                       // 71
      // 'reconnect now' on a hanging connection and we had no way to cancel the                              // 72
      // connection attempt.) But this shouldn't happen (similarly to the client                              // 73
      // !== self.client check above).                                                                        // 74
      throw new Error("Two parallel connections?");                                                           // 75
    }                                                                                                         // 76
                                                                                                              // 77
    self._clearConnectionTimer();                                                                             // 78
                                                                                                              // 79
    // update status                                                                                          // 80
    self.currentStatus.status = "connected";                                                                  // 81
    self.currentStatus.connected = true;                                                                      // 82
    self.currentStatus.retryCount = 0;                                                                        // 83
    self.statusChanged();                                                                                     // 84
                                                                                                              // 85
    // fire resets. This must come after status change so that clients                                        // 86
    // can call send from within a reset callback.                                                            // 87
    _.each(self.eventCallbacks.reset, function (callback) { callback(); });                                   // 88
  },                                                                                                          // 89
                                                                                                              // 90
  _cleanup: function (maybeError) {                                                                           // 91
    var self = this;                                                                                          // 92
                                                                                                              // 93
    self._clearConnectionTimer();                                                                             // 94
    if (self.client) {                                                                                        // 95
      var client = self.client;                                                                               // 96
      self.client = null;                                                                                     // 97
      client.close();                                                                                         // 98
                                                                                                              // 99
      _.each(self.eventCallbacks.disconnect, function (callback) {                                            // 100
        callback(maybeError);                                                                                 // 101
      });                                                                                                     // 102
    }                                                                                                         // 103
  },                                                                                                          // 104
                                                                                                              // 105
  _clearConnectionTimer: function () {                                                                        // 106
    var self = this;                                                                                          // 107
                                                                                                              // 108
    if (self.connectionTimer) {                                                                               // 109
      clearTimeout(self.connectionTimer);                                                                     // 110
      self.connectionTimer = null;                                                                            // 111
    }                                                                                                         // 112
  },                                                                                                          // 113
                                                                                                              // 114
  _getProxyUrl: function (targetUrl) {                                                                        // 115
    var self = this;                                                                                          // 116
    // Similar to code in tools/http-helpers.js.                                                              // 117
    var proxy = process.env.HTTP_PROXY || process.env.http_proxy || null;                                     // 118
    // if we're going to a secure url, try the https_proxy env variable first.                                // 119
    if (targetUrl.match(/^wss:/)) {                                                                           // 120
      proxy = process.env.HTTPS_PROXY || process.env.https_proxy || proxy;                                    // 121
    }                                                                                                         // 122
    return proxy;                                                                                             // 123
  },                                                                                                          // 124
                                                                                                              // 125
  _launchConnection: function () {                                                                            // 126
    var self = this;                                                                                          // 127
    self._cleanup(); // cleanup the old socket, if there was one.                                             // 128
                                                                                                              // 129
    // Since server-to-server DDP is still an experimental feature, we only                                   // 130
    // require the module if we actually create a server-to-server                                            // 131
    // connection.                                                                                            // 132
    var FayeWebSocket = Npm.require('faye-websocket');                                                        // 133
    var deflate = Npm.require('permessage-deflate');                                                          // 134
                                                                                                              // 135
    var targetUrl = toWebsocketUrl(self.endpoint);                                                            // 136
    var fayeOptions = {                                                                                       // 137
      headers: self.headers,                                                                                  // 138
      extensions: [deflate]                                                                                   // 139
    };                                                                                                        // 140
    fayeOptions = _.extend(fayeOptions, self.npmFayeOptions);                                                 // 141
    var proxyUrl = self._getProxyUrl(targetUrl);                                                              // 142
    if (proxyUrl) {                                                                                           // 143
      fayeOptions.proxy = { origin: proxyUrl };                                                               // 144
    };                                                                                                        // 145
                                                                                                              // 146
    // We would like to specify 'ddp' as the subprotocol here. The npm module we                              // 147
    // used to use as a client would fail the handshake if we ask for a                                       // 148
    // subprotocol and the server doesn't send one back (and sockjs doesn't).                                 // 149
    // Faye doesn't have that behavior; it's unclear from reading RFC 6455 if                                 // 150
    // Faye is erroneous or not.  So for now, we don't specify protocols.                                     // 151
    var subprotocols = [];                                                                                    // 152
                                                                                                              // 153
    var client = self.client = new FayeWebSocket.Client(                                                      // 154
      targetUrl, subprotocols, fayeOptions);                                                                  // 155
                                                                                                              // 156
    self._clearConnectionTimer();                                                                             // 157
    self.connectionTimer = Meteor.setTimeout(                                                                 // 158
      function () {                                                                                           // 159
        self._lostConnection(                                                                                 // 160
          new DDP.ConnectionError("DDP connection timed out"));                                               // 161
      },                                                                                                      // 162
      self.CONNECT_TIMEOUT);                                                                                  // 163
                                                                                                              // 164
    self.client.on('open', Meteor.bindEnvironment(function () {                                               // 165
      return self._onConnect(client);                                                                         // 166
    }, "stream connect callback"));                                                                           // 167
                                                                                                              // 168
    var clientOnIfCurrent = function (event, description, f) {                                                // 169
      self.client.on(event, Meteor.bindEnvironment(function () {                                              // 170
        // Ignore events from any connection we've already cleaned up.                                        // 171
        if (client !== self.client)                                                                           // 172
          return;                                                                                             // 173
        f.apply(this, arguments);                                                                             // 174
      }, description));                                                                                       // 175
    };                                                                                                        // 176
                                                                                                              // 177
    clientOnIfCurrent('error', 'stream error callback', function (error) {                                    // 178
      if (!self.options._dontPrintErrors)                                                                     // 179
        Meteor._debug("stream error", error.message);                                                         // 180
                                                                                                              // 181
      // Faye's 'error' object is not a JS error (and among other things,                                     // 182
      // doesn't stringify well). Convert it to one.                                                          // 183
      self._lostConnection(new DDP.ConnectionError(error.message));                                           // 184
    });                                                                                                       // 185
                                                                                                              // 186
                                                                                                              // 187
    clientOnIfCurrent('close', 'stream close callback', function () {                                         // 188
      self._lostConnection();                                                                                 // 189
    });                                                                                                       // 190
                                                                                                              // 191
                                                                                                              // 192
    clientOnIfCurrent('message', 'stream message callback', function (message) {                              // 193
      // Ignore binary frames, where message.data is a Buffer                                                 // 194
      if (typeof message.data !== "string")                                                                   // 195
        return;                                                                                               // 196
                                                                                                              // 197
      _.each(self.eventCallbacks.message, function (callback) {                                               // 198
        callback(message.data);                                                                               // 199
      });                                                                                                     // 200
    });                                                                                                       // 201
  }                                                                                                           // 202
});                                                                                                           // 203
                                                                                                              // 204
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/ddp-client/stream_client_common.js                                                                //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
// XXX from Underscore.String (http://epeli.github.com/underscore.string/)                                    // 1
var startsWith = function(str, starts) {                                                                      // 2
  return str.length >= starts.length &&                                                                       // 3
    str.substring(0, starts.length) === starts;                                                               // 4
};                                                                                                            // 5
var endsWith = function(str, ends) {                                                                          // 6
  return str.length >= ends.length &&                                                                         // 7
    str.substring(str.length - ends.length) === ends;                                                         // 8
};                                                                                                            // 9
                                                                                                              // 10
// @param url {String} URL to Meteor app, eg:                                                                 // 11
//   "/" or "madewith.meteor.com" or "https://foo.meteor.com"                                                 // 12
//   or "ddp+sockjs://ddp--****-foo.meteor.com/sockjs"                                                        // 13
// @returns {String} URL to the endpoint with the specific scheme and subPath, e.g.                           // 14
// for scheme "http" and subPath "sockjs"                                                                     // 15
//   "http://subdomain.meteor.com/sockjs" or "/sockjs"                                                        // 16
//   or "https://ddp--1234-foo.meteor.com/sockjs"                                                             // 17
var translateUrl =  function(url, newSchemeBase, subPath) {                                                   // 18
  if (! newSchemeBase) {                                                                                      // 19
    newSchemeBase = "http";                                                                                   // 20
  }                                                                                                           // 21
                                                                                                              // 22
  var ddpUrlMatch = url.match(/^ddp(i?)\+sockjs:\/\//);                                                       // 23
  var httpUrlMatch = url.match(/^http(s?):\/\//);                                                             // 24
  var newScheme;                                                                                              // 25
  if (ddpUrlMatch) {                                                                                          // 26
    // Remove scheme and split off the host.                                                                  // 27
    var urlAfterDDP = url.substr(ddpUrlMatch[0].length);                                                      // 28
    newScheme = ddpUrlMatch[1] === "i" ? newSchemeBase : newSchemeBase + "s";                                 // 29
    var slashPos = urlAfterDDP.indexOf('/');                                                                  // 30
    var host =                                                                                                // 31
          slashPos === -1 ? urlAfterDDP : urlAfterDDP.substr(0, slashPos);                                    // 32
    var rest = slashPos === -1 ? '' : urlAfterDDP.substr(slashPos);                                           // 33
                                                                                                              // 34
    // In the host (ONLY!), change '*' characters into random digits. This                                    // 35
    // allows different stream connections to connect to different hostnames                                  // 36
    // and avoid browser per-hostname connection limits.                                                      // 37
    host = host.replace(/\*/g, function () {                                                                  // 38
      return Math.floor(Random.fraction()*10);                                                                // 39
    });                                                                                                       // 40
                                                                                                              // 41
    return newScheme + '://' + host + rest;                                                                   // 42
  } else if (httpUrlMatch) {                                                                                  // 43
    newScheme = !httpUrlMatch[1] ? newSchemeBase : newSchemeBase + "s";                                       // 44
    var urlAfterHttp = url.substr(httpUrlMatch[0].length);                                                    // 45
    url = newScheme + "://" + urlAfterHttp;                                                                   // 46
  }                                                                                                           // 47
                                                                                                              // 48
  // Prefix FQDNs but not relative URLs                                                                       // 49
  if (url.indexOf("://") === -1 && !startsWith(url, "/")) {                                                   // 50
    url = newSchemeBase + "://" + url;                                                                        // 51
  }                                                                                                           // 52
                                                                                                              // 53
  // XXX This is not what we should be doing: if I have a site                                                // 54
  // deployed at "/foo", then DDP.connect("/") should actually connect                                        // 55
  // to "/", not to "/foo". "/" is an absolute path. (Contrast: if                                            // 56
  // deployed at "/foo", it would be reasonable for DDP.connect("bar")                                        // 57
  // to connect to "/foo/bar").                                                                               // 58
  //                                                                                                          // 59
  // We should make this properly honor absolute paths rather than                                            // 60
  // forcing the path to be relative to the site root. Simultaneously,                                        // 61
  // we should set DDP_DEFAULT_CONNECTION_URL to include the site                                             // 62
  // root. See also client_convenience.js #RationalizingRelativeDDPURLs                                       // 63
  url = Meteor._relativeToSiteRootUrl(url);                                                                   // 64
                                                                                                              // 65
  if (endsWith(url, "/"))                                                                                     // 66
    return url + subPath;                                                                                     // 67
  else                                                                                                        // 68
    return url + "/" + subPath;                                                                               // 69
};                                                                                                            // 70
                                                                                                              // 71
toSockjsUrl = function (url) {                                                                                // 72
  return translateUrl(url, "http", "sockjs");                                                                 // 73
};                                                                                                            // 74
                                                                                                              // 75
toWebsocketUrl = function (url) {                                                                             // 76
  var ret = translateUrl(url, "ws", "websocket");                                                             // 77
  return ret;                                                                                                 // 78
};                                                                                                            // 79
                                                                                                              // 80
LivedataTest.toSockjsUrl = toSockjsUrl;                                                                       // 81
                                                                                                              // 82
                                                                                                              // 83
_.extend(LivedataTest.ClientStream.prototype, {                                                               // 84
                                                                                                              // 85
  // Register for callbacks.                                                                                  // 86
  on: function (name, callback) {                                                                             // 87
    var self = this;                                                                                          // 88
                                                                                                              // 89
    if (name !== 'message' && name !== 'reset' && name !== 'disconnect')                                      // 90
      throw new Error("unknown event type: " + name);                                                         // 91
                                                                                                              // 92
    if (!self.eventCallbacks[name])                                                                           // 93
      self.eventCallbacks[name] = [];                                                                         // 94
    self.eventCallbacks[name].push(callback);                                                                 // 95
  },                                                                                                          // 96
                                                                                                              // 97
                                                                                                              // 98
  _initCommon: function (options) {                                                                           // 99
    var self = this;                                                                                          // 100
    options = options || {};                                                                                  // 101
                                                                                                              // 102
    //// Constants                                                                                            // 103
                                                                                                              // 104
    // how long to wait until we declare the connection attempt                                               // 105
    // failed.                                                                                                // 106
    self.CONNECT_TIMEOUT = options.connectTimeoutMs || 10000;                                                 // 107
                                                                                                              // 108
    self.eventCallbacks = {}; // name -> [callback]                                                           // 109
                                                                                                              // 110
    self._forcedToDisconnect = false;                                                                         // 111
                                                                                                              // 112
    //// Reactive status                                                                                      // 113
    self.currentStatus = {                                                                                    // 114
      status: "connecting",                                                                                   // 115
      connected: false,                                                                                       // 116
      retryCount: 0                                                                                           // 117
    };                                                                                                        // 118
                                                                                                              // 119
                                                                                                              // 120
    self.statusListeners = typeof Tracker !== 'undefined' && new Tracker.Dependency;                          // 121
    self.statusChanged = function () {                                                                        // 122
      if (self.statusListeners)                                                                               // 123
        self.statusListeners.changed();                                                                       // 124
    };                                                                                                        // 125
                                                                                                              // 126
    //// Retry logic                                                                                          // 127
    self._retry = new Retry;                                                                                  // 128
    self.connectionTimer = null;                                                                              // 129
                                                                                                              // 130
  },                                                                                                          // 131
                                                                                                              // 132
  // Trigger a reconnect.                                                                                     // 133
  reconnect: function (options) {                                                                             // 134
    var self = this;                                                                                          // 135
    options = options || {};                                                                                  // 136
                                                                                                              // 137
    if (options.url) {                                                                                        // 138
      self._changeUrl(options.url);                                                                           // 139
    }                                                                                                         // 140
                                                                                                              // 141
    if (options._sockjsOptions) {                                                                             // 142
      self.options._sockjsOptions = options._sockjsOptions;                                                   // 143
    }                                                                                                         // 144
                                                                                                              // 145
    if (self.currentStatus.connected) {                                                                       // 146
      if (options._force || options.url) {                                                                    // 147
        // force reconnect.                                                                                   // 148
        self._lostConnection(new DDP.ForcedReconnectError);                                                   // 149
      } // else, noop.                                                                                        // 150
      return;                                                                                                 // 151
    }                                                                                                         // 152
                                                                                                              // 153
    // if we're mid-connection, stop it.                                                                      // 154
    if (self.currentStatus.status === "connecting") {                                                         // 155
      // Pretend it's a clean close.                                                                          // 156
      self._lostConnection();                                                                                 // 157
    }                                                                                                         // 158
                                                                                                              // 159
    self._retry.clear();                                                                                      // 160
    self.currentStatus.retryCount -= 1; // don't count manual retries                                         // 161
    self._retryNow();                                                                                         // 162
  },                                                                                                          // 163
                                                                                                              // 164
  disconnect: function (options) {                                                                            // 165
    var self = this;                                                                                          // 166
    options = options || {};                                                                                  // 167
                                                                                                              // 168
    // Failed is permanent. If we're failed, don't let people go back                                         // 169
    // online by calling 'disconnect' then 'reconnect'.                                                       // 170
    if (self._forcedToDisconnect)                                                                             // 171
      return;                                                                                                 // 172
                                                                                                              // 173
    // If _permanent is set, permanently disconnect a stream. Once a stream                                   // 174
    // is forced to disconnect, it can never reconnect. This is for                                           // 175
    // error cases such as ddp version mismatch, where trying again                                           // 176
    // won't fix the problem.                                                                                 // 177
    if (options._permanent) {                                                                                 // 178
      self._forcedToDisconnect = true;                                                                        // 179
    }                                                                                                         // 180
                                                                                                              // 181
    self._cleanup();                                                                                          // 182
    self._retry.clear();                                                                                      // 183
                                                                                                              // 184
    self.currentStatus = {                                                                                    // 185
      status: (options._permanent ? "failed" : "offline"),                                                    // 186
      connected: false,                                                                                       // 187
      retryCount: 0                                                                                           // 188
    };                                                                                                        // 189
                                                                                                              // 190
    if (options._permanent && options._error)                                                                 // 191
      self.currentStatus.reason = options._error;                                                             // 192
                                                                                                              // 193
    self.statusChanged();                                                                                     // 194
  },                                                                                                          // 195
                                                                                                              // 196
  // maybeError is set unless it's a clean protocol-level close.                                              // 197
  _lostConnection: function (maybeError) {                                                                    // 198
    var self = this;                                                                                          // 199
                                                                                                              // 200
    self._cleanup(maybeError);                                                                                // 201
    self._retryLater(maybeError); // sets status. no need to do it here.                                      // 202
  },                                                                                                          // 203
                                                                                                              // 204
  // fired when we detect that we've gone online. try to reconnect                                            // 205
  // immediately.                                                                                             // 206
  _online: function () {                                                                                      // 207
    // if we've requested to be offline by disconnecting, don't reconnect.                                    // 208
    if (this.currentStatus.status != "offline")                                                               // 209
      this.reconnect();                                                                                       // 210
  },                                                                                                          // 211
                                                                                                              // 212
  _retryLater: function (maybeError) {                                                                        // 213
    var self = this;                                                                                          // 214
                                                                                                              // 215
    var timeout = 0;                                                                                          // 216
    if (self.options.retry ||                                                                                 // 217
        (maybeError && maybeError.errorType === "DDP.ForcedReconnectError")) {                                // 218
      timeout = self._retry.retryLater(                                                                       // 219
        self.currentStatus.retryCount,                                                                        // 220
        _.bind(self._retryNow, self)                                                                          // 221
      );                                                                                                      // 222
      self.currentStatus.status = "waiting";                                                                  // 223
      self.currentStatus.retryTime = (new Date()).getTime() + timeout;                                        // 224
    } else {                                                                                                  // 225
      self.currentStatus.status = "failed";                                                                   // 226
      delete self.currentStatus.retryTime;                                                                    // 227
    }                                                                                                         // 228
                                                                                                              // 229
    self.currentStatus.connected = false;                                                                     // 230
    self.statusChanged();                                                                                     // 231
  },                                                                                                          // 232
                                                                                                              // 233
  _retryNow: function () {                                                                                    // 234
    var self = this;                                                                                          // 235
                                                                                                              // 236
    if (self._forcedToDisconnect)                                                                             // 237
      return;                                                                                                 // 238
                                                                                                              // 239
    self.currentStatus.retryCount += 1;                                                                       // 240
    self.currentStatus.status = "connecting";                                                                 // 241
    self.currentStatus.connected = false;                                                                     // 242
    delete self.currentStatus.retryTime;                                                                      // 243
    self.statusChanged();                                                                                     // 244
                                                                                                              // 245
    self._launchConnection();                                                                                 // 246
  },                                                                                                          // 247
                                                                                                              // 248
                                                                                                              // 249
  // Get current status. Reactive.                                                                            // 250
  status: function () {                                                                                       // 251
    var self = this;                                                                                          // 252
    if (self.statusListeners)                                                                                 // 253
      self.statusListeners.depend();                                                                          // 254
    return self.currentStatus;                                                                                // 255
  }                                                                                                           // 256
});                                                                                                           // 257
                                                                                                              // 258
DDP.ConnectionError = Meteor.makeErrorType(                                                                   // 259
  "DDP.ConnectionError", function (message) {                                                                 // 260
    var self = this;                                                                                          // 261
    self.message = message;                                                                                   // 262
});                                                                                                           // 263
                                                                                                              // 264
DDP.ForcedReconnectError = Meteor.makeErrorType(                                                              // 265
  "DDP.ForcedReconnectError", function () {});                                                                // 266
                                                                                                              // 267
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/ddp-client/livedata_common.js                                                                     //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
LivedataTest.SUPPORTED_DDP_VERSIONS = DDPCommon.SUPPORTED_DDP_VERSIONS;                                       // 1
                                                                                                              // 2
// This is private but it's used in a few places. accounts-base uses                                          // 3
// it to get the current user. Meteor.setTimeout and friends clear                                            // 4
// it. We can probably find a better way to factor this.                                                      // 5
DDP._CurrentInvocation = new Meteor.EnvironmentVariable;                                                      // 6
                                                                                                              // 7
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/ddp-client/random_stream.js                                                                       //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
// Returns the named sequence of pseudo-random values.                                                        // 1
// The scope will be DDP._CurrentInvocation.get(), so the stream will produce                                 // 2
// consistent values for method calls on the client and server.                                               // 3
DDP.randomStream = function (name) {                                                                          // 4
  var scope = DDP._CurrentInvocation.get();                                                                   // 5
  return DDPCommon.RandomStream.get(scope, name);                                                             // 6
};                                                                                                            // 7
                                                                                                              // 8
                                                                                                              // 9
                                                                                                              // 10
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/ddp-client/livedata_connection.js                                                                 //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
if (Meteor.isServer) {                                                                                        // 1
  var path = Npm.require('path');                                                                             // 2
  var Fiber = Npm.require('fibers');                                                                          // 3
  var Future = Npm.require(path.join('fibers', 'future'));                                                    // 4
}                                                                                                             // 5
                                                                                                              // 6
// @param url {String|Object} URL to Meteor app,                                                              // 7
//   or an object as a test hook (see code)                                                                   // 8
// Options:                                                                                                   // 9
//   reloadWithOutstanding: is it OK to reload if there are outstanding methods?                              // 10
//   headers: extra headers to send on the websockets connection, for                                         // 11
//     server-to-server DDP only                                                                              // 12
//   _sockjsOptions: Specifies options to pass through to the sockjs client                                   // 13
//   onDDPNegotiationVersionFailure: callback when version negotiation fails.                                 // 14
//                                                                                                            // 15
// XXX There should be a way to destroy a DDP connection, causing all                                         // 16
// outstanding method calls to fail.                                                                          // 17
//                                                                                                            // 18
// XXX Our current way of handling failure and reconnection is great                                          // 19
// for an app (where we want to tolerate being disconnected as an                                             // 20
// expect state, and keep trying forever to reconnect) but cumbersome                                         // 21
// for something like a command line tool that wants to make a                                                // 22
// connection, call a method, and print an error if connection                                                // 23
// fails. We should have better usability in the latter case (while                                           // 24
// still transparently reconnecting if it's just a transient failure                                          // 25
// or the server migrating us).                                                                               // 26
var Connection = function (url, options) {                                                                    // 27
  var self = this;                                                                                            // 28
  options = _.extend({                                                                                        // 29
    onConnected: function () {},                                                                              // 30
    onDDPVersionNegotiationFailure: function (description) {                                                  // 31
      Meteor._debug(description);                                                                             // 32
    },                                                                                                        // 33
    heartbeatInterval: 17500,                                                                                 // 34
    heartbeatTimeout: 15000,                                                                                  // 35
    npmFayeOptions: {},                                                                                       // 36
    // These options are only for testing.                                                                    // 37
    reloadWithOutstanding: false,                                                                             // 38
    supportedDDPVersions: DDPCommon.SUPPORTED_DDP_VERSIONS,                                                   // 39
    retry: true,                                                                                              // 40
    respondToPings: true,                                                                                     // 41
    // When updates are coming within this ms interval, batch them together.                                  // 42
    bufferedWritesInterval: 5,                                                                                // 43
    // Flush buffers immediately if writes are happening continuously for more than this many ms.             // 44
    bufferedWritesMaxAge: 500                                                                                 // 45
  }, options);                                                                                                // 46
                                                                                                              // 47
  // If set, called when we reconnect, queuing method calls _before_ the                                      // 48
  // existing outstanding ones. This is the only data member that is part of the                              // 49
  // public API!                                                                                              // 50
  self.onReconnect = null;                                                                                    // 51
                                                                                                              // 52
  // as a test hook, allow passing a stream instead of a url.                                                 // 53
  if (typeof url === "object") {                                                                              // 54
    self._stream = url;                                                                                       // 55
  } else {                                                                                                    // 56
    self._stream = new LivedataTest.ClientStream(url, {                                                       // 57
      retry: options.retry,                                                                                   // 58
      headers: options.headers,                                                                               // 59
      _sockjsOptions: options._sockjsOptions,                                                                 // 60
      // Used to keep some tests quiet, or for other cases in which                                           // 61
      // the right thing to do with connection errors is to silently                                          // 62
      // fail (e.g. sending package usage stats). At some point we                                            // 63
      // should have a real API for handling client-stream-level                                              // 64
      // errors.                                                                                              // 65
      _dontPrintErrors: options._dontPrintErrors,                                                             // 66
      connectTimeoutMs: options.connectTimeoutMs,                                                             // 67
      npmFayeOptions: options.npmFayeOptions                                                                  // 68
    });                                                                                                       // 69
  }                                                                                                           // 70
                                                                                                              // 71
  self._lastSessionId = null;                                                                                 // 72
  self._versionSuggestion = null;  // The last proposed DDP version.                                          // 73
  self._version = null;   // The DDP version agreed on by client and server.                                  // 74
  self._stores = {}; // name -> object with methods                                                           // 75
  self._methodHandlers = {}; // name -> func                                                                  // 76
  self._nextMethodId = 1;                                                                                     // 77
  self._supportedDDPVersions = options.supportedDDPVersions;                                                  // 78
                                                                                                              // 79
  self._heartbeatInterval = options.heartbeatInterval;                                                        // 80
  self._heartbeatTimeout = options.heartbeatTimeout;                                                          // 81
                                                                                                              // 82
  // Tracks methods which the user has tried to call but which have not yet                                   // 83
  // called their user callback (ie, they are waiting on their result or for all                              // 84
  // of their writes to be written to the local cache). Map from method ID to                                 // 85
  // MethodInvoker object.                                                                                    // 86
  self._methodInvokers = {};                                                                                  // 87
                                                                                                              // 88
  // Tracks methods which the user has called but whose result messages have not                              // 89
  // arrived yet.                                                                                             // 90
  //                                                                                                          // 91
  // _outstandingMethodBlocks is an array of blocks of methods. Each block                                    // 92
  // represents a set of methods that can run at the same time. The first block                               // 93
  // represents the methods which are currently in flight; subsequent blocks                                  // 94
  // must wait for previous blocks to be fully finished before they can be sent                               // 95
  // to the server.                                                                                           // 96
  //                                                                                                          // 97
  // Each block is an object with the following fields:                                                       // 98
  // - methods: a list of MethodInvoker objects                                                               // 99
  // - wait: a boolean; if true, this block had a single method invoked with                                  // 100
  //         the "wait" option                                                                                // 101
  //                                                                                                          // 102
  // There will never be adjacent blocks with wait=false, because the only thing                              // 103
  // that makes methods need to be serialized is a wait method.                                               // 104
  //                                                                                                          // 105
  // Methods are removed from the first block when their "result" is                                          // 106
  // received. The entire first block is only removed when all of the in-flight                               // 107
  // methods have received their results (so the "methods" list is empty) *AND*                               // 108
  // all of the data written by those methods are visible in the local cache. So                              // 109
  // it is possible for the first block's methods list to be empty, if we are                                 // 110
  // still waiting for some objects to quiesce.                                                               // 111
  //                                                                                                          // 112
  // Example:                                                                                                 // 113
  //  _outstandingMethodBlocks = [                                                                            // 114
  //    {wait: false, methods: []},                                                                           // 115
  //    {wait: true, methods: [<MethodInvoker for 'login'>]},                                                 // 116
  //    {wait: false, methods: [<MethodInvoker for 'foo'>,                                                    // 117
  //                            <MethodInvoker for 'bar'>]}]                                                  // 118
  // This means that there were some methods which were sent to the server and                                // 119
  // which have returned their results, but some of the data written by                                       // 120
  // the methods may not be visible in the local cache. Once all that data is                                 // 121
  // visible, we will send a 'login' method. Once the login method has returned                               // 122
  // and all the data is visible (including re-running subs if userId changes),                               // 123
  // we will send the 'foo' and 'bar' methods in parallel.                                                    // 124
  self._outstandingMethodBlocks = [];                                                                         // 125
                                                                                                              // 126
  // method ID -> array of objects with keys 'collection' and 'id', listing                                   // 127
  // documents written by a given method's stub. keys are associated with                                     // 128
  // methods whose stub wrote at least one document, and whose data-done message                              // 129
  // has not yet been received.                                                                               // 130
  self._documentsWrittenByStub = {};                                                                          // 131
  // collection -> IdMap of "server document" object. A "server document" has:                                // 132
  // - "document": the version of the document according the                                                  // 133
  //   server (ie, the snapshot before a stub wrote it, amended by any changes                                // 134
  //   received from the server)                                                                              // 135
  //   It is undefined if we think the document does not exist                                                // 136
  // - "writtenByStubs": a set of method IDs whose stubs wrote to the document                                // 137
  //   whose "data done" messages have not yet been processed                                                 // 138
  self._serverDocuments = {};                                                                                 // 139
                                                                                                              // 140
  // Array of callbacks to be called after the next update of the local                                       // 141
  // cache. Used for:                                                                                         // 142
  //  - Calling methodInvoker.dataVisible and sub ready callbacks after                                       // 143
  //    the relevant data is flushed.                                                                         // 144
  //  - Invoking the callbacks of "half-finished" methods after reconnect                                     // 145
  //    quiescence. Specifically, methods whose result was received over the old                              // 146
  //    connection (so we don't re-send it) but whose data had not been made                                  // 147
  //    visible.                                                                                              // 148
  self._afterUpdateCallbacks = [];                                                                            // 149
                                                                                                              // 150
  // In two contexts, we buffer all incoming data messages and then process them                              // 151
  // all at once in a single update:                                                                          // 152
  //   - During reconnect, we buffer all data messages until all subs that had                                // 153
  //     been ready before reconnect are ready again, and all methods that are                                // 154
  //     active have returned their "data done message"; then                                                 // 155
  //   - During the execution of a "wait" method, we buffer all data messages                                 // 156
  //     until the wait method gets its "data done" message. (If the wait method                              // 157
  //     occurs during reconnect, it doesn't get any special handling.)                                       // 158
  // all data messages are processed in one update.                                                           // 159
  //                                                                                                          // 160
  // The following fields are used for this "quiescence" process.                                             // 161
                                                                                                              // 162
  // This buffers the messages that aren't being processed yet.                                               // 163
  self._messagesBufferedUntilQuiescence = [];                                                                 // 164
  // Map from method ID -> true. Methods are removed from this when their                                     // 165
  // "data done" message is received, and we will not quiesce until it is                                     // 166
  // empty.                                                                                                   // 167
  self._methodsBlockingQuiescence = {};                                                                       // 168
  // map from sub ID -> true for subs that were ready (ie, called the sub                                     // 169
  // ready callback) before reconnect but haven't become ready again yet                                      // 170
  self._subsBeingRevived = {}; // map from sub._id -> true                                                    // 171
  // if true, the next data update should reset all stores. (set during                                       // 172
  // reconnect.)                                                                                              // 173
  self._resetStores = false;                                                                                  // 174
                                                                                                              // 175
  // name -> array of updates for (yet to be created) collections                                             // 176
  self._updatesForUnknownStores = {};                                                                         // 177
  // if we're blocking a migration, the retry func                                                            // 178
  self._retryMigrate = null;                                                                                  // 179
                                                                                                              // 180
  self.__flushBufferedWrites = Meteor.bindEnvironment(                                                        // 181
    self._flushBufferedWrites, "flushing DDP buffered writes", self);                                         // 182
  // Collection name -> array of messages.                                                                    // 183
  self._bufferedWrites = {};                                                                                  // 184
  // When current buffer of updates must be flushed at, in ms timestamp.                                      // 185
  self._bufferedWritesFlushAt = null;                                                                         // 186
  // Timeout handle for the next processing of all pending writes                                             // 187
  self._bufferedWritesFlushHandle = null;                                                                     // 188
                                                                                                              // 189
  self._bufferedWritesInterval = options.bufferedWritesInterval;                                              // 190
  self._bufferedWritesMaxAge = options.bufferedWritesMaxAge;                                                  // 191
                                                                                                              // 192
  // metadata for subscriptions.  Map from sub ID to object with keys:                                        // 193
  //   - id                                                                                                   // 194
  //   - name                                                                                                 // 195
  //   - params                                                                                               // 196
  //   - inactive (if true, will be cleaned up if not reused in re-run)                                       // 197
  //   - ready (has the 'ready' message been received?)                                                       // 198
  //   - readyCallback (an optional callback to call when ready)                                              // 199
  //   - errorCallback (an optional callback to call if the sub terminates with                               // 200
  //                    an error, XXX COMPAT WITH 1.0.3.1)                                                    // 201
  //   - stopCallback (an optional callback to call when the sub terminates                                   // 202
  //     for any reason, with an error argument if an error triggered the stop)                               // 203
  self._subscriptions = {};                                                                                   // 204
                                                                                                              // 205
  // Reactive userId.                                                                                         // 206
  self._userId = null;                                                                                        // 207
  self._userIdDeps = new Tracker.Dependency;                                                                  // 208
                                                                                                              // 209
  // Block auto-reload while we're waiting for method responses.                                              // 210
  if (Meteor.isClient && Package.reload && !options.reloadWithOutstanding) {                                  // 211
    Package.reload.Reload._onMigrate(function (retry) {                                                       // 212
      if (!self._readyToMigrate()) {                                                                          // 213
        if (self._retryMigrate)                                                                               // 214
          throw new Error("Two migrations in progress?");                                                     // 215
        self._retryMigrate = retry;                                                                           // 216
        return false;                                                                                         // 217
      } else {                                                                                                // 218
        return [true];                                                                                        // 219
      }                                                                                                       // 220
    });                                                                                                       // 221
  }                                                                                                           // 222
                                                                                                              // 223
  var onMessage = function (raw_msg) {                                                                        // 224
    try {                                                                                                     // 225
      var msg = DDPCommon.parseDDP(raw_msg);                                                                  // 226
    } catch (e) {                                                                                             // 227
      Meteor._debug("Exception while parsing DDP", e);                                                        // 228
      return;                                                                                                 // 229
    }                                                                                                         // 230
                                                                                                              // 231
    // Any message counts as receiving a pong, as it demonstrates that                                        // 232
    // the server is still alive.                                                                             // 233
    if (self._heartbeat) {                                                                                    // 234
      self._heartbeat.messageReceived();                                                                      // 235
    }                                                                                                         // 236
                                                                                                              // 237
    if (msg === null || !msg.msg) {                                                                           // 238
      // XXX COMPAT WITH 0.6.6. ignore the old welcome message for back                                       // 239
      // compat.  Remove this 'if' once the server stops sending welcome                                      // 240
      // messages (stream_server.js).                                                                         // 241
      if (! (msg && msg.server_id))                                                                           // 242
        Meteor._debug("discarding invalid livedata message", msg);                                            // 243
      return;                                                                                                 // 244
    }                                                                                                         // 245
                                                                                                              // 246
    if (msg.msg === 'connected') {                                                                            // 247
      self._version = self._versionSuggestion;                                                                // 248
      self._livedata_connected(msg);                                                                          // 249
      options.onConnected();                                                                                  // 250
    }                                                                                                         // 251
    else if (msg.msg === 'failed') {                                                                          // 252
      if (_.contains(self._supportedDDPVersions, msg.version)) {                                              // 253
        self._versionSuggestion = msg.version;                                                                // 254
        self._stream.reconnect({_force: true});                                                               // 255
      } else {                                                                                                // 256
        var description =                                                                                     // 257
              "DDP version negotiation failed; server requested version " + msg.version;                      // 258
        self._stream.disconnect({_permanent: true, _error: description});                                     // 259
        options.onDDPVersionNegotiationFailure(description);                                                  // 260
      }                                                                                                       // 261
    }                                                                                                         // 262
    else if (msg.msg === 'ping' && options.respondToPings) {                                                  // 263
      self._send({msg: "pong", id: msg.id});                                                                  // 264
    }                                                                                                         // 265
    else if (msg.msg === 'pong') {                                                                            // 266
      // noop, as we assume everything's a pong                                                               // 267
    }                                                                                                         // 268
    else if (_.include(['added', 'changed', 'removed', 'ready', 'updated'], msg.msg))                         // 269
      self._livedata_data(msg);                                                                               // 270
    else if (msg.msg === 'nosub')                                                                             // 271
      self._livedata_nosub(msg);                                                                              // 272
    else if (msg.msg === 'result')                                                                            // 273
      self._livedata_result(msg);                                                                             // 274
    else if (msg.msg === 'error')                                                                             // 275
      self._livedata_error(msg);                                                                              // 276
    else                                                                                                      // 277
      Meteor._debug("discarding unknown livedata message type", msg);                                         // 278
  };                                                                                                          // 279
                                                                                                              // 280
  var onReset = function () {                                                                                 // 281
    // Send a connect message at the beginning of the stream.                                                 // 282
    // NOTE: reset is called even on the first connection, so this is                                         // 283
    // the only place we send this message.                                                                   // 284
    var msg = {msg: 'connect'};                                                                               // 285
    if (self._lastSessionId)                                                                                  // 286
      msg.session = self._lastSessionId;                                                                      // 287
    msg.version = self._versionSuggestion || self._supportedDDPVersions[0];                                   // 288
    self._versionSuggestion = msg.version;                                                                    // 289
    msg.support = self._supportedDDPVersions;                                                                 // 290
    self._send(msg);                                                                                          // 291
                                                                                                              // 292
    // Mark non-retry calls as failed. This has to be done early as getting these methods out of the          // 293
    // current block is pretty important to making sure that quiescence is properly calculated, as            // 294
    // well as possibly moving on to another useful block.                                                    // 295
                                                                                                              // 296
    // Only bother testing if there is an outstandingMethodBlock (there might not be, especially if           // 297
    // we are connecting for the first time.                                                                  // 298
    if (self._outstandingMethodBlocks.length > 0) {                                                           // 299
      // If there is an outstanding method block, we only care about the first one as that is the             // 300
      // one that could have already sent messages with no response, that are not allowed to retry.           // 301
      _.each(self._outstandingMethodBlocks[0].methods, function(methodInvoker) {                              // 302
        // If the message wasn't sent or it's allowed to retry, do nothing.                                   // 303
        if (methodInvoker.sentMessage && methodInvoker.noRetry) {                                             // 304
          // The next loop serves to get the index in the current method block of this method.                // 305
          var currentMethodBlock = self._outstandingMethodBlocks[0].methods;                                  // 306
          var loopMethod;                                                                                     // 307
          for (var i = 0; i < currentMethodBlock.length; i++) {                                               // 308
            loopMethod = currentMethodBlock[i];                                                               // 309
            if (loopMethod.methodId === methodInvoker.methodId) {                                             // 310
              break;                                                                                          // 311
            }                                                                                                 // 312
          }                                                                                                   // 313
                                                                                                              // 314
          // Remove from current method block. This may leave the block empty, but we                         // 315
          // don't move on to the next block until the callback has been delivered, in                        // 316
          // _outstandingMethodFinished.                                                                      // 317
          currentMethodBlock.splice(i, 1);                                                                    // 318
                                                                                                              // 319
          // Make sure that the method is told that it failed.                                                // 320
          methodInvoker.receiveResult(new Meteor.Error('invocation-failed',                                   // 321
            'Method invocation might have failed due to dropped connection. ' +                               // 322
            'Failing because `noRetry` option was passed to Meteor.apply.'));                                 // 323
        }                                                                                                     // 324
      });                                                                                                     // 325
    }                                                                                                         // 326
                                                                                                              // 327
    // Now, to minimize setup latency, go ahead and blast out all of                                          // 328
    // our pending methods ands subscriptions before we've even taken                                         // 329
    // the necessary RTT to know if we successfully reconnected. (1)                                          // 330
    // They're supposed to be idempotent, and where they are not,                                             // 331
    // they can block retry in apply; (2) even if we did reconnect,                                           // 332
    // we're not sure what messages might have gotten lost                                                    // 333
    // (in either direction) since we were disconnected (TCP being                                            // 334
    // sloppy about that.)                                                                                    // 335
                                                                                                              // 336
    // If the current block of methods all got their results (but didn't all get                              // 337
    // their data visible), discard the empty block now.                                                      // 338
    if (! _.isEmpty(self._outstandingMethodBlocks) &&                                                         // 339
        _.isEmpty(self._outstandingMethodBlocks[0].methods)) {                                                // 340
      self._outstandingMethodBlocks.shift();                                                                  // 341
    }                                                                                                         // 342
                                                                                                              // 343
    // Mark all messages as unsent, they have not yet been sent on this                                       // 344
    // connection.                                                                                            // 345
    _.each(self._methodInvokers, function (m) {                                                               // 346
      m.sentMessage = false;                                                                                  // 347
    });                                                                                                       // 348
                                                                                                              // 349
    // If an `onReconnect` handler is set, call it first. Go through                                          // 350
    // some hoops to ensure that methods that are called from within                                          // 351
    // `onReconnect` get executed _before_ ones that were originally                                          // 352
    // outstanding (since `onReconnect` is used to re-establish auth                                          // 353
    // certificates)                                                                                          // 354
    if (self.onReconnect)                                                                                     // 355
      self._callOnReconnectAndSendAppropriateOutstandingMethods();                                            // 356
    else                                                                                                      // 357
      self._sendOutstandingMethods();                                                                         // 358
                                                                                                              // 359
    // add new subscriptions at the end. this way they take effect after                                      // 360
    // the handlers and we don't see flicker.                                                                 // 361
    _.each(self._subscriptions, function (sub, id) {                                                          // 362
      self._send({                                                                                            // 363
        msg: 'sub',                                                                                           // 364
        id: id,                                                                                               // 365
        name: sub.name,                                                                                       // 366
        params: sub.params                                                                                    // 367
      });                                                                                                     // 368
    });                                                                                                       // 369
  };                                                                                                          // 370
                                                                                                              // 371
  var onDisconnect = function () {                                                                            // 372
    if (self._heartbeat) {                                                                                    // 373
      self._heartbeat.stop();                                                                                 // 374
      self._heartbeat = null;                                                                                 // 375
    }                                                                                                         // 376
  };                                                                                                          // 377
                                                                                                              // 378
  if (Meteor.isServer) {                                                                                      // 379
    self._stream.on('message', Meteor.bindEnvironment(onMessage, "handling DDP message"));                    // 380
    self._stream.on('reset', Meteor.bindEnvironment(onReset, "handling DDP reset"));                          // 381
    self._stream.on('disconnect', Meteor.bindEnvironment(onDisconnect, "handling DDP disconnect"));           // 382
  } else {                                                                                                    // 383
    self._stream.on('message', onMessage);                                                                    // 384
    self._stream.on('reset', onReset);                                                                        // 385
    self._stream.on('disconnect', onDisconnect);                                                              // 386
  }                                                                                                           // 387
};                                                                                                            // 388
                                                                                                              // 389
// A MethodInvoker manages sending a method to the server and calling the user's                              // 390
// callbacks. On construction, it registers itself in the connection's                                        // 391
// _methodInvokers map; it removes itself once the method is fully finished and                               // 392
// the callback is invoked. This occurs when it has both received a result,                                   // 393
// and the data written by it is fully visible.                                                               // 394
var MethodInvoker = function (options) {                                                                      // 395
  var self = this;                                                                                            // 396
                                                                                                              // 397
  // Public (within this file) fields.                                                                        // 398
  self.methodId = options.methodId;                                                                           // 399
  self.sentMessage = false;                                                                                   // 400
                                                                                                              // 401
  self._callback = options.callback;                                                                          // 402
  self._connection = options.connection;                                                                      // 403
  self._message = options.message;                                                                            // 404
  self._onResultReceived = options.onResultReceived || function () {};                                        // 405
  self._wait = options.wait;                                                                                  // 406
  self.noRetry = options.noRetry;                                                                             // 407
  self._methodResult = null;                                                                                  // 408
  self._dataVisible = false;                                                                                  // 409
                                                                                                              // 410
  // Register with the connection.                                                                            // 411
  self._connection._methodInvokers[self.methodId] = self;                                                     // 412
};                                                                                                            // 413
_.extend(MethodInvoker.prototype, {                                                                           // 414
  // Sends the method message to the server. May be called additional times if                                // 415
  // we lose the connection and reconnect before receiving a result.                                          // 416
  sendMessage: function () {                                                                                  // 417
    var self = this;                                                                                          // 418
    // This function is called before sending a method (including resending on                                // 419
    // reconnect). We should only (re)send methods where we don't already have a                              // 420
    // result!                                                                                                // 421
    if (self.gotResult())                                                                                     // 422
      throw new Error("sendingMethod is called on method with result");                                       // 423
                                                                                                              // 424
                                                                                                              // 425
    // If we're re-sending it, it doesn't matter if data was written the first                                // 426
    // time.                                                                                                  // 427
    self._dataVisible = false;                                                                                // 428
    self.sentMessage = true;                                                                                  // 429
                                                                                                              // 430
    // If this is a wait method, make all data messages be buffered until it is                               // 431
    // done.                                                                                                  // 432
    if (self._wait)                                                                                           // 433
      self._connection._methodsBlockingQuiescence[self.methodId] = true;                                      // 434
                                                                                                              // 435
    // Actually send the message.                                                                             // 436
    self._connection._send(self._message);                                                                    // 437
  },                                                                                                          // 438
  // Invoke the callback, if we have both a result and know that all data has                                 // 439
  // been written to the local cache.                                                                         // 440
  _maybeInvokeCallback: function () {                                                                         // 441
    var self = this;                                                                                          // 442
    if (self._methodResult && self._dataVisible) {                                                            // 443
      // Call the callback. (This won't throw: the callback was wrapped with                                  // 444
      // bindEnvironment.)                                                                                    // 445
      self._callback(self._methodResult[0], self._methodResult[1]);                                           // 446
                                                                                                              // 447
      // Forget about this method.                                                                            // 448
      delete self._connection._methodInvokers[self.methodId];                                                 // 449
                                                                                                              // 450
      // Let the connection know that this method is finished, so it can try to                               // 451
      // move on to the next block of methods.                                                                // 452
      self._connection._outstandingMethodFinished();                                                          // 453
    }                                                                                                         // 454
  },                                                                                                          // 455
  // Call with the result of the method from the server. Only may be called                                   // 456
  // once; once it is called, you should not call sendMessage again.                                          // 457
  // If the user provided an onResultReceived callback, call it immediately.                                  // 458
  // Then invoke the main callback if data is also visible.                                                   // 459
  receiveResult: function (err, result) {                                                                     // 460
    var self = this;                                                                                          // 461
    if (self.gotResult())                                                                                     // 462
      throw new Error("Methods should only receive results once");                                            // 463
    self._methodResult = [err, result];                                                                       // 464
    self._onResultReceived(err, result);                                                                      // 465
    self._maybeInvokeCallback();                                                                              // 466
  },                                                                                                          // 467
  // Call this when all data written by the method is visible. This means that                                // 468
  // the method has returns its "data is done" message *AND* all server                                       // 469
  // documents that are buffered at that time have been written to the local                                  // 470
  // cache. Invokes the main callback if the result has been received.                                        // 471
  dataVisible: function () {                                                                                  // 472
    var self = this;                                                                                          // 473
    self._dataVisible = true;                                                                                 // 474
    self._maybeInvokeCallback();                                                                              // 475
  },                                                                                                          // 476
  // True if receiveResult has been called.                                                                   // 477
  gotResult: function () {                                                                                    // 478
    var self = this;                                                                                          // 479
    return !!self._methodResult;                                                                              // 480
  }                                                                                                           // 481
});                                                                                                           // 482
                                                                                                              // 483
_.extend(Connection.prototype, {                                                                              // 484
  // 'name' is the name of the data on the wire that should go in the                                         // 485
  // store. 'wrappedStore' should be an object with methods beginUpdate, update,                              // 486
  // endUpdate, saveOriginals, retrieveOriginals. see Collection for an example.                              // 487
  registerStore: function (name, wrappedStore) {                                                              // 488
    var self = this;                                                                                          // 489
                                                                                                              // 490
    if (name in self._stores)                                                                                 // 491
      return false;                                                                                           // 492
                                                                                                              // 493
    // Wrap the input object in an object which makes any store method not                                    // 494
    // implemented by 'store' into a no-op.                                                                   // 495
    var store = {};                                                                                           // 496
    _.each(['update', 'beginUpdate', 'endUpdate', 'saveOriginals',                                            // 497
            'retrieveOriginals', 'getDoc',                                                                    // 498
			'_getCollection'], function (method) {                                                                     // 499
              store[method] = function () {                                                                   // 500
                return (wrappedStore[method]                                                                  // 501
                        ? wrappedStore[method].apply(wrappedStore, arguments)                                 // 502
                        : undefined);                                                                         // 503
              };                                                                                              // 504
            });                                                                                               // 505
                                                                                                              // 506
    self._stores[name] = store;                                                                               // 507
                                                                                                              // 508
    var queued = self._updatesForUnknownStores[name];                                                         // 509
    if (queued) {                                                                                             // 510
      store.beginUpdate(queued.length, false);                                                                // 511
      _.each(queued, function (msg) {                                                                         // 512
        store.update(msg);                                                                                    // 513
      });                                                                                                     // 514
      store.endUpdate();                                                                                      // 515
      delete self._updatesForUnknownStores[name];                                                             // 516
    }                                                                                                         // 517
                                                                                                              // 518
    return true;                                                                                              // 519
  },                                                                                                          // 520
                                                                                                              // 521
  /**                                                                                                         // 522
   * @memberOf Meteor                                                                                         // 523
   * @importFromPackage meteor                                                                                // 524
   * @summary Subscribe to a record set.  Returns a handle that provides                                      // 525
   * `stop()` and `ready()` methods.                                                                          // 526
   * @locus Client                                                                                            // 527
   * @param {String} name Name of the subscription.  Matches the name of the                                  // 528
   * server's `publish()` call.                                                                               // 529
   * @param {EJSONable} [arg1,arg2...] Optional arguments passed to publisher                                 // 530
   * function on server.                                                                                      // 531
   * @param {Function|Object} [callbacks] Optional. May include `onStop`                                      // 532
   * and `onReady` callbacks. If there is an error, it is passed as an                                        // 533
   * argument to `onStop`. If a function is passed instead of an object, it                                   // 534
   * is interpreted as an `onReady` callback.                                                                 // 535
   */                                                                                                         // 536
  subscribe: function (name /* .. [arguments] .. (callback|callbacks) */) {                                   // 537
    var self = this;                                                                                          // 538
                                                                                                              // 539
    var params = Array.prototype.slice.call(arguments, 1);                                                    // 540
    var callbacks = {};                                                                                       // 541
    if (params.length) {                                                                                      // 542
      var lastParam = params[params.length - 1];                                                              // 543
      if (_.isFunction(lastParam)) {                                                                          // 544
        callbacks.onReady = params.pop();                                                                     // 545
      } else if (lastParam &&                                                                                 // 546
        // XXX COMPAT WITH 1.0.3.1 onError used to exist, but now we use                                      // 547
        // onStop with an error callback instead.                                                             // 548
        _.any([lastParam.onReady, lastParam.onError, lastParam.onStop],                                       // 549
          _.isFunction)) {                                                                                    // 550
        callbacks = params.pop();                                                                             // 551
      }                                                                                                       // 552
    }                                                                                                         // 553
                                                                                                              // 554
    // Is there an existing sub with the same name and param, run in an                                       // 555
    // invalidated Computation? This will happen if we are rerunning an                                       // 556
    // existing computation.                                                                                  // 557
    //                                                                                                        // 558
    // For example, consider a rerun of:                                                                      // 559
    //                                                                                                        // 560
    //     Tracker.autorun(function () {                                                                      // 561
    //       Meteor.subscribe("foo", Session.get("foo"));                                                     // 562
    //       Meteor.subscribe("bar", Session.get("bar"));                                                     // 563
    //     });                                                                                                // 564
    //                                                                                                        // 565
    // If "foo" has changed but "bar" has not, we will match the "bar"                                        // 566
    // subcribe to an existing inactive subscription in order to not                                          // 567
    // unsub and resub the subscription unnecessarily.                                                        // 568
    //                                                                                                        // 569
    // We only look for one such sub; if there are N apparently-identical subs                                // 570
    // being invalidated, we will require N matching subscribe calls to keep                                  // 571
    // them all active.                                                                                       // 572
    var existing = _.find(self._subscriptions, function (sub) {                                               // 573
      return sub.inactive && sub.name === name &&                                                             // 574
        EJSON.equals(sub.params, params);                                                                     // 575
    });                                                                                                       // 576
                                                                                                              // 577
    var id;                                                                                                   // 578
    if (existing) {                                                                                           // 579
      id = existing.id;                                                                                       // 580
      existing.inactive = false; // reactivate                                                                // 581
                                                                                                              // 582
      if (callbacks.onReady) {                                                                                // 583
        // If the sub is not already ready, replace any ready callback with the                               // 584
        // one provided now. (It's not really clear what users would expect for                               // 585
        // an onReady callback inside an autorun; the semantics we provide is                                 // 586
        // that at the time the sub first becomes ready, we call the last                                     // 587
        // onReady callback provided, if any.)                                                                // 588
        if (!existing.ready)                                                                                  // 589
          existing.readyCallback = callbacks.onReady;                                                         // 590
      }                                                                                                       // 591
                                                                                                              // 592
      // XXX COMPAT WITH 1.0.3.1 we used to have onError but now we call                                      // 593
      // onStop with an optional error argument                                                               // 594
      if (callbacks.onError) {                                                                                // 595
        // Replace existing callback if any, so that errors aren't                                            // 596
        // double-reported.                                                                                   // 597
        existing.errorCallback = callbacks.onError;                                                           // 598
      }                                                                                                       // 599
                                                                                                              // 600
      if (callbacks.onStop) {                                                                                 // 601
        existing.stopCallback = callbacks.onStop;                                                             // 602
      }                                                                                                       // 603
    } else {                                                                                                  // 604
      // New sub! Generate an id, save it locally, and send message.                                          // 605
      id = Random.id();                                                                                       // 606
      self._subscriptions[id] = {                                                                             // 607
        id: id,                                                                                               // 608
        name: name,                                                                                           // 609
        params: EJSON.clone(params),                                                                          // 610
        inactive: false,                                                                                      // 611
        ready: false,                                                                                         // 612
        readyDeps: new Tracker.Dependency,                                                                    // 613
        readyCallback: callbacks.onReady,                                                                     // 614
        // XXX COMPAT WITH 1.0.3.1 #errorCallback                                                             // 615
        errorCallback: callbacks.onError,                                                                     // 616
        stopCallback: callbacks.onStop,                                                                       // 617
        connection: self,                                                                                     // 618
        remove: function() {                                                                                  // 619
          delete this.connection._subscriptions[this.id];                                                     // 620
          this.ready && this.readyDeps.changed();                                                             // 621
        },                                                                                                    // 622
        stop: function() {                                                                                    // 623
          this.connection._send({msg: 'unsub', id: id});                                                      // 624
          this.remove();                                                                                      // 625
                                                                                                              // 626
          if (callbacks.onStop) {                                                                             // 627
            callbacks.onStop();                                                                               // 628
          }                                                                                                   // 629
        }                                                                                                     // 630
      };                                                                                                      // 631
      self._send({msg: 'sub', id: id, name: name, params: params});                                           // 632
    }                                                                                                         // 633
                                                                                                              // 634
    // return a handle to the application.                                                                    // 635
    var handle = {                                                                                            // 636
      stop: function () {                                                                                     // 637
        if (!_.has(self._subscriptions, id))                                                                  // 638
          return;                                                                                             // 639
                                                                                                              // 640
        self._subscriptions[id].stop();                                                                       // 641
      },                                                                                                      // 642
      ready: function () {                                                                                    // 643
        // return false if we've unsubscribed.                                                                // 644
        if (!_.has(self._subscriptions, id))                                                                  // 645
          return false;                                                                                       // 646
        var record = self._subscriptions[id];                                                                 // 647
        record.readyDeps.depend();                                                                            // 648
        return record.ready;                                                                                  // 649
      },                                                                                                      // 650
      subscriptionId: id                                                                                      // 651
    };                                                                                                        // 652
                                                                                                              // 653
    if (Tracker.active) {                                                                                     // 654
      // We're in a reactive computation, so we'd like to unsubscribe when the                                // 655
      // computation is invalidated... but not if the rerun just re-subscribes                                // 656
      // to the same subscription!  When a rerun happens, we use onInvalidate                                 // 657
      // as a change to mark the subscription "inactive" so that it can                                       // 658
      // be reused from the rerun.  If it isn't reused, it's killed from                                      // 659
      // an afterFlush.                                                                                       // 660
      Tracker.onInvalidate(function (c) {                                                                     // 661
        if (_.has(self._subscriptions, id))                                                                   // 662
          self._subscriptions[id].inactive = true;                                                            // 663
                                                                                                              // 664
        Tracker.afterFlush(function () {                                                                      // 665
          if (_.has(self._subscriptions, id) &&                                                               // 666
              self._subscriptions[id].inactive)                                                               // 667
            handle.stop();                                                                                    // 668
        });                                                                                                   // 669
      });                                                                                                     // 670
    }                                                                                                         // 671
                                                                                                              // 672
    return handle;                                                                                            // 673
  },                                                                                                          // 674
                                                                                                              // 675
  // options:                                                                                                 // 676
  // - onLateError {Function(error)} called if an error was received after the ready event.                   // 677
  //     (errors received before ready cause an error to be thrown)                                           // 678
  _subscribeAndWait: function (name, args, options) {                                                         // 679
    var self = this;                                                                                          // 680
    var f = new Future();                                                                                     // 681
    var ready = false;                                                                                        // 682
    var handle;                                                                                               // 683
    args = args || [];                                                                                        // 684
    args.push({                                                                                               // 685
      onReady: function () {                                                                                  // 686
        ready = true;                                                                                         // 687
        f['return']();                                                                                        // 688
      },                                                                                                      // 689
      onError: function (e) {                                                                                 // 690
        if (!ready)                                                                                           // 691
          f['throw'](e);                                                                                      // 692
        else                                                                                                  // 693
          options && options.onLateError && options.onLateError(e);                                           // 694
      }                                                                                                       // 695
    });                                                                                                       // 696
                                                                                                              // 697
    handle = self.subscribe.apply(self, [name].concat(args));                                                 // 698
    f.wait();                                                                                                 // 699
    return handle;                                                                                            // 700
  },                                                                                                          // 701
                                                                                                              // 702
  methods: function (methods) {                                                                               // 703
    var self = this;                                                                                          // 704
    _.each(methods, function (func, name) {                                                                   // 705
      if (typeof func !== 'function')                                                                         // 706
        throw new Error("Method '" + name + "' must be a function");                                          // 707
      if (self._methodHandlers[name])                                                                         // 708
        throw new Error("A method named '" + name + "' is already defined");                                  // 709
      self._methodHandlers[name] = func;                                                                      // 710
    });                                                                                                       // 711
  },                                                                                                          // 712
                                                                                                              // 713
  /**                                                                                                         // 714
   * @memberOf Meteor                                                                                         // 715
   * @importFromPackage meteor                                                                                // 716
   * @summary Invokes a method passing any number of arguments.                                               // 717
   * @locus Anywhere                                                                                          // 718
   * @param {String} name Name of method to invoke                                                            // 719
   * @param {EJSONable} [arg1,arg2...] Optional method arguments                                              // 720
   * @param {Function} [asyncCallback] Optional callback, which is called asynchronously with the error or result after the method is complete. If not provided, the method runs synchronously if possible (see below).
   */                                                                                                         // 722
  call: function (name /* .. [arguments] .. callback */) {                                                    // 723
    // if it's a function, the last argument is the result callback,                                          // 724
    // not a parameter to the remote method.                                                                  // 725
    var args = Array.prototype.slice.call(arguments, 1);                                                      // 726
    if (args.length && typeof args[args.length - 1] === "function")                                           // 727
      var callback = args.pop();                                                                              // 728
    return this.apply(name, args, callback);                                                                  // 729
  },                                                                                                          // 730
                                                                                                              // 731
  // @param options {Optional Object}                                                                         // 732
  //   wait: Boolean - Should we wait to call this until all current methods                                  // 733
  //                   are fully finished, and block subsequent method calls                                  // 734
  //                   until this method is fully finished?                                                   // 735
  //                   (does not affect methods called from within this method)                               // 736
  //   onResultReceived: Function - a callback to call as soon as the method                                  // 737
  //                                result is received. the data written by                                   // 738
  //                                the method may not yet be in the cache!                                   // 739
  //   returnStubValue: Boolean - If true then in cases where we would have                                   // 740
  //                              otherwise discarded the stub's return value                                 // 741
  //                              and returned undefined, instead we go ahead                                 // 742
  //                              and return it.  Specifically, this is any                                   // 743
  //                              time other than when (a) we are already                                     // 744
  //                              inside a stub or (b) we are in Node and no                                  // 745
  //                              callback was provided.  Currently we require                                // 746
  //                              this flag to be explicitly passed to reduce                                 // 747
  //                              the likelihood that stub return values will                                 // 748
  //                              be confused with server return values; we                                   // 749
  //                              may improve this in future.                                                 // 750
  // @param callback {Optional Function}                                                                      // 751
                                                                                                              // 752
  /**                                                                                                         // 753
   * @memberOf Meteor                                                                                         // 754
   * @importFromPackage meteor                                                                                // 755
   * @summary Invoke a method passing an array of arguments.                                                  // 756
   * @locus Anywhere                                                                                          // 757
   * @param {String} name Name of method to invoke                                                            // 758
   * @param {EJSONable[]} args Method arguments                                                               // 759
   * @param {Object} [options]                                                                                // 760
   * @param {Boolean} options.wait (Client only) If true, don't send this method until all previous method calls have completed, and don't send any subsequent method calls until this one is completed.
   * @param {Function} options.onResultReceived (Client only) This callback is invoked with the error or result of the method (just like `asyncCallback`) as soon as the error or result is available. The local cache may not yet reflect the writes performed by the method.
   * @param {Boolean} options.noRetry (Client only) if true, don't send this method again on reload, simply call the callback an error with the error code 'invocation-failed'.
   * @param {Function} [asyncCallback] Optional callback; same semantics as in [`Meteor.call`](#meteor_call).
   */                                                                                                         // 765
  apply: function (name, args, options, callback) {                                                           // 766
    var self = this;                                                                                          // 767
                                                                                                              // 768
    // We were passed 3 arguments. They may be either (name, args, options)                                   // 769
    // or (name, args, callback)                                                                              // 770
    if (!callback && typeof options === 'function') {                                                         // 771
      callback = options;                                                                                     // 772
      options = {};                                                                                           // 773
    }                                                                                                         // 774
    options = options || {};                                                                                  // 775
                                                                                                              // 776
    if (callback) {                                                                                           // 777
      // XXX would it be better form to do the binding in stream.on,                                          // 778
      // or caller, instead of here?                                                                          // 779
      // XXX improve error message (and how we report it)                                                     // 780
      callback = Meteor.bindEnvironment(                                                                      // 781
        callback,                                                                                             // 782
        "delivering result of invoking '" + name + "'"                                                        // 783
      );                                                                                                      // 784
    }                                                                                                         // 785
                                                                                                              // 786
    // Keep our args safe from mutation (eg if we don't send the message for a                                // 787
    // while because of a wait method).                                                                       // 788
    args = EJSON.clone(args);                                                                                 // 789
                                                                                                              // 790
    // Lazily allocate method ID once we know that it'll be needed.                                           // 791
    var methodId = (function () {                                                                             // 792
      var id;                                                                                                 // 793
      return function () {                                                                                    // 794
        if (id === undefined)                                                                                 // 795
          id = '' + (self._nextMethodId++);                                                                   // 796
        return id;                                                                                            // 797
      };                                                                                                      // 798
    })();                                                                                                     // 799
                                                                                                              // 800
    var enclosing = DDP._CurrentInvocation.get();                                                             // 801
    var alreadyInSimulation = enclosing && enclosing.isSimulation;                                            // 802
                                                                                                              // 803
    // Lazily generate a randomSeed, only if it is requested by the stub.                                     // 804
    // The random streams only have utility if they're used on both the client                                // 805
    // and the server; if the client doesn't generate any 'random' values                                     // 806
    // then we don't expect the server to generate any either.                                                // 807
    // Less commonly, the server may perform different actions from the client,                               // 808
    // and may in fact generate values where the client did not, but we don't                                 // 809
    // have any client-side values to match, so even here we may as well just                                 // 810
    // use a random seed on the server.  In that case, we don't pass the                                      // 811
    // randomSeed to save bandwidth, and we don't even generate it to save a                                  // 812
    // bit of CPU and to avoid consuming entropy.                                                             // 813
    var randomSeed = null;                                                                                    // 814
    var randomSeedGenerator = function () {                                                                   // 815
      if (randomSeed === null) {                                                                              // 816
        randomSeed = DDPCommon.makeRpcSeed(enclosing, name);                                                  // 817
      }                                                                                                       // 818
      return randomSeed;                                                                                      // 819
    };                                                                                                        // 820
                                                                                                              // 821
    // Run the stub, if we have one. The stub is supposed to make some                                        // 822
    // temporary writes to the database to give the user a smooth experience                                  // 823
    // until the actual result of executing the method comes back from the                                    // 824
    // server (whereupon the temporary writes to the database will be reversed                                // 825
    // during the beginUpdate/endUpdate process.)                                                             // 826
    //                                                                                                        // 827
    // Normally, we ignore the return value of the stub (even if it is an                                     // 828
    // exception), in favor of the real return value from the server. The                                     // 829
    // exception is if the *caller* is a stub. In that case, we're not going                                  // 830
    // to do a RPC, so we use the return value of the stub as our return                                      // 831
    // value.                                                                                                 // 832
                                                                                                              // 833
    var stub = self._methodHandlers[name];                                                                    // 834
    if (stub) {                                                                                               // 835
      var setUserId = function(userId) {                                                                      // 836
        self.setUserId(userId);                                                                               // 837
      };                                                                                                      // 838
                                                                                                              // 839
      var invocation = new DDPCommon.MethodInvocation({                                                       // 840
        isSimulation: true,                                                                                   // 841
        userId: self.userId(),                                                                                // 842
        setUserId: setUserId,                                                                                 // 843
        randomSeed: function () { return randomSeedGenerator(); }                                             // 844
      });                                                                                                     // 845
                                                                                                              // 846
      if (!alreadyInSimulation)                                                                               // 847
        self._saveOriginals();                                                                                // 848
                                                                                                              // 849
      try {                                                                                                   // 850
        // Note that unlike in the corresponding server code, we never audit                                  // 851
        // that stubs check() their arguments.                                                                // 852
        var stubReturnValue = DDP._CurrentInvocation.withValue(invocation, function () {                      // 853
          if (Meteor.isServer) {                                                                              // 854
            // Because saveOriginals and retrieveOriginals aren't reentrant,                                  // 855
            // don't allow stubs to yield.                                                                    // 856
            return Meteor._noYieldsAllowed(function () {                                                      // 857
              // re-clone, so that the stub can't affect our caller's values                                  // 858
              return stub.apply(invocation, EJSON.clone(args));                                               // 859
            });                                                                                               // 860
          } else {                                                                                            // 861
            return stub.apply(invocation, EJSON.clone(args));                                                 // 862
          }                                                                                                   // 863
        });                                                                                                   // 864
      }                                                                                                       // 865
      catch (e) {                                                                                             // 866
        var exception = e;                                                                                    // 867
      }                                                                                                       // 868
                                                                                                              // 869
      if (!alreadyInSimulation)                                                                               // 870
        self._retrieveAndStoreOriginals(methodId());                                                          // 871
    }                                                                                                         // 872
                                                                                                              // 873
    // If we're in a simulation, stop and return the result we have,                                          // 874
    // rather than going on to do an RPC. If there was no stub,                                               // 875
    // we'll end up returning undefined.                                                                      // 876
    if (alreadyInSimulation) {                                                                                // 877
      if (callback) {                                                                                         // 878
        callback(exception, stubReturnValue);                                                                 // 879
        return undefined;                                                                                     // 880
      }                                                                                                       // 881
      if (exception)                                                                                          // 882
        throw exception;                                                                                      // 883
      return stubReturnValue;                                                                                 // 884
    }                                                                                                         // 885
                                                                                                              // 886
    // If an exception occurred in a stub, and we're ignoring it                                              // 887
    // because we're doing an RPC and want to use what the server                                             // 888
    // returns instead, log it so the developer knows                                                         // 889
    // (unless they explicitly ask to see the error).                                                         // 890
    //                                                                                                        // 891
    // Tests can set the 'expected' flag on an exception so it won't                                          // 892
    // go to log.                                                                                             // 893
    if (exception) {                                                                                          // 894
      if (options.throwStubExceptions) {                                                                      // 895
        throw exception;                                                                                      // 896
      } else if (!exception.expected) {                                                                       // 897
        Meteor._debug("Exception while simulating the effect of invoking '" +                                 // 898
          name + "'", exception, exception.stack);                                                            // 899
      }                                                                                                       // 900
    }                                                                                                         // 901
                                                                                                              // 902
                                                                                                              // 903
    // At this point we're definitely doing an RPC, and we're going to                                        // 904
    // return the value of the RPC to the caller.                                                             // 905
                                                                                                              // 906
    // If the caller didn't give a callback, decide what to do.                                               // 907
    if (!callback) {                                                                                          // 908
      if (Meteor.isClient) {                                                                                  // 909
        // On the client, we don't have fibers, so we can't block. The                                        // 910
        // only thing we can do is to return undefined and discard the                                        // 911
        // result of the RPC. If an error occurred then print the error                                       // 912
        // to the console.                                                                                    // 913
        callback = function (err) {                                                                           // 914
          err && Meteor._debug("Error invoking Method '" + name + "':",                                       // 915
                               err.message);                                                                  // 916
        };                                                                                                    // 917
      } else {                                                                                                // 918
        // On the server, make the function synchronous. Throw on                                             // 919
        // errors, return on success.                                                                         // 920
        var future = new Future;                                                                              // 921
        callback = future.resolver();                                                                         // 922
      }                                                                                                       // 923
    }                                                                                                         // 924
    // Send the RPC. Note that on the client, it is important that the                                        // 925
    // stub have finished before we send the RPC, so that we know we have                                     // 926
    // a complete list of which local documents the stub wrote.                                               // 927
    var message = {                                                                                           // 928
      msg: 'method',                                                                                          // 929
      method: name,                                                                                           // 930
      params: args,                                                                                           // 931
      id: methodId()                                                                                          // 932
    };                                                                                                        // 933
                                                                                                              // 934
    // Send the randomSeed only if we used it                                                                 // 935
    if (randomSeed !== null) {                                                                                // 936
      message.randomSeed = randomSeed;                                                                        // 937
    }                                                                                                         // 938
                                                                                                              // 939
    var methodInvoker = new MethodInvoker({                                                                   // 940
      methodId: methodId(),                                                                                   // 941
      callback: callback,                                                                                     // 942
      connection: self,                                                                                       // 943
      onResultReceived: options.onResultReceived,                                                             // 944
      wait: !!options.wait,                                                                                   // 945
      message: message,                                                                                       // 946
      noRetry: !!options.noRetry                                                                              // 947
    });                                                                                                       // 948
                                                                                                              // 949
    if (options.wait) {                                                                                       // 950
      // It's a wait method! Wait methods go in their own block.                                              // 951
      self._outstandingMethodBlocks.push(                                                                     // 952
        {wait: true, methods: [methodInvoker]});                                                              // 953
    } else {                                                                                                  // 954
      // Not a wait method. Start a new block if the previous block was a wait                                // 955
      // block, and add it to the last block of methods.                                                      // 956
      if (_.isEmpty(self._outstandingMethodBlocks) ||                                                         // 957
          _.last(self._outstandingMethodBlocks).wait)                                                         // 958
        self._outstandingMethodBlocks.push({wait: false, methods: []});                                       // 959
      _.last(self._outstandingMethodBlocks).methods.push(methodInvoker);                                      // 960
    }                                                                                                         // 961
                                                                                                              // 962
    // If we added it to the first block, send it out now.                                                    // 963
    if (self._outstandingMethodBlocks.length === 1)                                                           // 964
      methodInvoker.sendMessage();                                                                            // 965
                                                                                                              // 966
    // If we're using the default callback on the server,                                                     // 967
    // block waiting for the result.                                                                          // 968
    if (future) {                                                                                             // 969
      return future.wait();                                                                                   // 970
    }                                                                                                         // 971
    return options.returnStubValue ? stubReturnValue : undefined;                                             // 972
  },                                                                                                          // 973
                                                                                                              // 974
  // Before calling a method stub, prepare all stores to track changes and allow                              // 975
  // _retrieveAndStoreOriginals to get the original versions of changed                                       // 976
  // documents.                                                                                               // 977
  _saveOriginals: function () {                                                                               // 978
    var self = this;                                                                                          // 979
    _.each(self._stores, function (s) {                                                                       // 980
      s.saveOriginals();                                                                                      // 981
    });                                                                                                       // 982
  },                                                                                                          // 983
  // Retrieves the original versions of all documents modified by the stub for                                // 984
  // method 'methodId' from all stores and saves them to _serverDocuments (keyed                              // 985
  // by document) and _documentsWrittenByStub (keyed by method ID).                                           // 986
  _retrieveAndStoreOriginals: function (methodId) {                                                           // 987
    var self = this;                                                                                          // 988
    if (self._documentsWrittenByStub[methodId])                                                               // 989
      throw new Error("Duplicate methodId in _retrieveAndStoreOriginals");                                    // 990
                                                                                                              // 991
    var docsWritten = [];                                                                                     // 992
    _.each(self._stores, function (s, collection) {                                                           // 993
      var originals = s.retrieveOriginals();                                                                  // 994
      // not all stores define retrieveOriginals                                                              // 995
      if (!originals)                                                                                         // 996
        return;                                                                                               // 997
      originals.forEach(function (doc, id) {                                                                  // 998
        docsWritten.push({collection: collection, id: id});                                                   // 999
        if (!_.has(self._serverDocuments, collection))                                                        // 1000
          self._serverDocuments[collection] = new MongoIDMap;                                                 // 1001
        var serverDoc = self._serverDocuments[collection].setDefault(id, {});                                 // 1002
        if (serverDoc.writtenByStubs) {                                                                       // 1003
          // We're not the first stub to write this doc. Just add our method ID                               // 1004
          // to the record.                                                                                   // 1005
          serverDoc.writtenByStubs[methodId] = true;                                                          // 1006
        } else {                                                                                              // 1007
          // First stub! Save the original value and our method ID.                                           // 1008
          serverDoc.document = doc;                                                                           // 1009
          serverDoc.flushCallbacks = [];                                                                      // 1010
          serverDoc.writtenByStubs = {};                                                                      // 1011
          serverDoc.writtenByStubs[methodId] = true;                                                          // 1012
        }                                                                                                     // 1013
      });                                                                                                     // 1014
    });                                                                                                       // 1015
    if (!_.isEmpty(docsWritten)) {                                                                            // 1016
      self._documentsWrittenByStub[methodId] = docsWritten;                                                   // 1017
    }                                                                                                         // 1018
  },                                                                                                          // 1019
                                                                                                              // 1020
  // This is very much a private function we use to make the tests                                            // 1021
  // take up fewer server resources after they complete.                                                      // 1022
  _unsubscribeAll: function () {                                                                              // 1023
    var self = this;                                                                                          // 1024
    _.each(_.clone(self._subscriptions), function (sub, id) {                                                 // 1025
      // Avoid killing the autoupdate subscription so that developers                                         // 1026
      // still get hot code pushes when writing tests.                                                        // 1027
      //                                                                                                      // 1028
      // XXX it's a hack to encode knowledge about autoupdate here,                                           // 1029
      // but it doesn't seem worth it yet to have a special API for                                           // 1030
      // subscriptions to preserve after unit tests.                                                          // 1031
      if (sub.name !== 'meteor_autoupdate_clientVersions') {                                                  // 1032
        self._subscriptions[id].stop();                                                                       // 1033
      }                                                                                                       // 1034
    });                                                                                                       // 1035
  },                                                                                                          // 1036
                                                                                                              // 1037
  // Sends the DDP stringification of the given message object                                                // 1038
  _send: function (obj) {                                                                                     // 1039
    var self = this;                                                                                          // 1040
    self._stream.send(DDPCommon.stringifyDDP(obj));                                                           // 1041
  },                                                                                                          // 1042
                                                                                                              // 1043
  // We detected via DDP-level heartbeats that we've lost the                                                 // 1044
  // connection.  Unlike `disconnect` or `close`, a lost connection                                           // 1045
  // will be automatically retried.                                                                           // 1046
  _lostConnection: function (error) {                                                                         // 1047
    var self = this;                                                                                          // 1048
    self._stream._lostConnection(error);                                                                      // 1049
  },                                                                                                          // 1050
                                                                                                              // 1051
  /**                                                                                                         // 1052
   * @summary Get the current connection status. A reactive data source.                                      // 1053
   * @locus Client                                                                                            // 1054
   * @memberOf Meteor                                                                                         // 1055
   * @importFromPackage meteor                                                                                // 1056
   */                                                                                                         // 1057
  status: function (/*passthrough args*/) {                                                                   // 1058
    var self = this;                                                                                          // 1059
    return self._stream.status.apply(self._stream, arguments);                                                // 1060
  },                                                                                                          // 1061
                                                                                                              // 1062
  /**                                                                                                         // 1063
   * @summary Force an immediate reconnection attempt if the client is not connected to the server.           // 1064
                                                                                                              // 1065
  This method does nothing if the client is already connected.                                                // 1066
   * @locus Client                                                                                            // 1067
   * @memberOf Meteor                                                                                         // 1068
   * @importFromPackage meteor                                                                                // 1069
   */                                                                                                         // 1070
  reconnect: function (/*passthrough args*/) {                                                                // 1071
    var self = this;                                                                                          // 1072
    return self._stream.reconnect.apply(self._stream, arguments);                                             // 1073
  },                                                                                                          // 1074
                                                                                                              // 1075
  /**                                                                                                         // 1076
   * @summary Disconnect the client from the server.                                                          // 1077
   * @locus Client                                                                                            // 1078
   * @memberOf Meteor                                                                                         // 1079
   * @importFromPackage meteor                                                                                // 1080
   */                                                                                                         // 1081
  disconnect: function (/*passthrough args*/) {                                                               // 1082
    var self = this;                                                                                          // 1083
    return self._stream.disconnect.apply(self._stream, arguments);                                            // 1084
  },                                                                                                          // 1085
                                                                                                              // 1086
  close: function () {                                                                                        // 1087
    var self = this;                                                                                          // 1088
    return self._stream.disconnect({_permanent: true});                                                       // 1089
  },                                                                                                          // 1090
                                                                                                              // 1091
  ///                                                                                                         // 1092
  /// Reactive user system                                                                                    // 1093
  ///                                                                                                         // 1094
  userId: function () {                                                                                       // 1095
    var self = this;                                                                                          // 1096
    if (self._userIdDeps)                                                                                     // 1097
      self._userIdDeps.depend();                                                                              // 1098
    return self._userId;                                                                                      // 1099
  },                                                                                                          // 1100
                                                                                                              // 1101
  setUserId: function (userId) {                                                                              // 1102
    var self = this;                                                                                          // 1103
    // Avoid invalidating dependents if setUserId is called with current value.                               // 1104
    if (self._userId === userId)                                                                              // 1105
      return;                                                                                                 // 1106
    self._userId = userId;                                                                                    // 1107
    if (self._userIdDeps)                                                                                     // 1108
      self._userIdDeps.changed();                                                                             // 1109
  },                                                                                                          // 1110
                                                                                                              // 1111
  // Returns true if we are in a state after reconnect of waiting for subs to be                              // 1112
  // revived or early methods to finish their data, or we are waiting for a                                   // 1113
  // "wait" method to finish.                                                                                 // 1114
  _waitingForQuiescence: function () {                                                                        // 1115
    var self = this;                                                                                          // 1116
    return (! _.isEmpty(self._subsBeingRevived) ||                                                            // 1117
            ! _.isEmpty(self._methodsBlockingQuiescence));                                                    // 1118
  },                                                                                                          // 1119
                                                                                                              // 1120
  // Returns true if any method whose message has been sent to the server has                                 // 1121
  // not yet invoked its user callback.                                                                       // 1122
  _anyMethodsAreOutstanding: function () {                                                                    // 1123
    var self = this;                                                                                          // 1124
    return _.any(_.pluck(self._methodInvokers, 'sentMessage'));                                               // 1125
  },                                                                                                          // 1126
                                                                                                              // 1127
  _livedata_connected: function (msg) {                                                                       // 1128
    var self = this;                                                                                          // 1129
                                                                                                              // 1130
    if (self._version !== 'pre1' && self._heartbeatInterval !== 0) {                                          // 1131
      self._heartbeat = new DDPCommon.Heartbeat({                                                             // 1132
        heartbeatInterval: self._heartbeatInterval,                                                           // 1133
        heartbeatTimeout: self._heartbeatTimeout,                                                             // 1134
        onTimeout: function () {                                                                              // 1135
          self._lostConnection(                                                                               // 1136
            new DDP.ConnectionError("DDP heartbeat timed out"));                                              // 1137
        },                                                                                                    // 1138
        sendPing: function () {                                                                               // 1139
          self._send({msg: 'ping'});                                                                          // 1140
        }                                                                                                     // 1141
      });                                                                                                     // 1142
      self._heartbeat.start();                                                                                // 1143
    }                                                                                                         // 1144
                                                                                                              // 1145
    // If this is a reconnect, we'll have to reset all stores.                                                // 1146
    if (self._lastSessionId)                                                                                  // 1147
      self._resetStores = true;                                                                               // 1148
                                                                                                              // 1149
    if (typeof (msg.session) === "string") {                                                                  // 1150
      var reconnectedToPreviousSession = (self._lastSessionId === msg.session);                               // 1151
      self._lastSessionId = msg.session;                                                                      // 1152
    }                                                                                                         // 1153
                                                                                                              // 1154
    if (reconnectedToPreviousSession) {                                                                       // 1155
      // Successful reconnection -- pick up where we left off.  Note that right                               // 1156
      // now, this never happens: the server never connects us to a previous                                  // 1157
      // session, because DDP doesn't provide enough data for the server to know                              // 1158
      // what messages the client has processed. We need to improve DDP to make                               // 1159
      // this possible, at which point we'll probably need more code here.                                    // 1160
      return;                                                                                                 // 1161
    }                                                                                                         // 1162
                                                                                                              // 1163
    // Server doesn't have our data any more. Re-sync a new session.                                          // 1164
                                                                                                              // 1165
    // Forget about messages we were buffering for unknown collections. They'll                               // 1166
    // be resent if still relevant.                                                                           // 1167
    self._updatesForUnknownStores = {};                                                                       // 1168
                                                                                                              // 1169
    if (self._resetStores) {                                                                                  // 1170
      // Forget about the effects of stubs. We'll be resetting all collections                                // 1171
      // anyway.                                                                                              // 1172
      self._documentsWrittenByStub = {};                                                                      // 1173
      self._serverDocuments = {};                                                                             // 1174
    }                                                                                                         // 1175
                                                                                                              // 1176
    // Clear _afterUpdateCallbacks.                                                                           // 1177
    self._afterUpdateCallbacks = [];                                                                          // 1178
                                                                                                              // 1179
    // Mark all named subscriptions which are ready (ie, we already called the                                // 1180
    // ready callback) as needing to be revived.                                                              // 1181
    // XXX We should also block reconnect quiescence until unnamed subscriptions                              // 1182
    //     (eg, autopublish) are done re-publishing to avoid flicker!                                         // 1183
    self._subsBeingRevived = {};                                                                              // 1184
    _.each(self._subscriptions, function (sub, id) {                                                          // 1185
      if (sub.ready)                                                                                          // 1186
        self._subsBeingRevived[id] = true;                                                                    // 1187
    });                                                                                                       // 1188
                                                                                                              // 1189
    // Arrange for "half-finished" methods to have their callbacks run, and                                   // 1190
    // track methods that were sent on this connection so that we don't                                       // 1191
    // quiesce until they are all done.                                                                       // 1192
    //                                                                                                        // 1193
    // Start by clearing _methodsBlockingQuiescence: methods sent before                                      // 1194
    // reconnect don't matter, and any "wait" methods sent on the new connection                              // 1195
    // that we drop here will be restored by the loop below.                                                  // 1196
    self._methodsBlockingQuiescence = {};                                                                     // 1197
    if (self._resetStores) {                                                                                  // 1198
      _.each(self._methodInvokers, function (invoker) {                                                       // 1199
        if (invoker.gotResult()) {                                                                            // 1200
          // This method already got its result, but it didn't call its callback                              // 1201
          // because its data didn't become visible. We did not resend the                                    // 1202
          // method RPC. We'll call its callback when we get a full quiesce,                                  // 1203
          // since that's as close as we'll get to "data must be visible".                                    // 1204
          self._afterUpdateCallbacks.push(_.bind(invoker.dataVisible, invoker));                              // 1205
        } else if (invoker.sentMessage) {                                                                     // 1206
          // This method has been sent on this connection (maybe as a resend                                  // 1207
          // from the last connection, maybe from onReconnect, maybe just very                                // 1208
          // quickly before processing the connected message).                                                // 1209
          //                                                                                                  // 1210
          // We don't need to do anything special to ensure its callbacks get                                 // 1211
          // called, but we'll count it as a method which is preventing                                       // 1212
          // reconnect quiescence. (eg, it might be a login method that was run                               // 1213
          // from onReconnect, and we don't want to see flicker by seeing a                                   // 1214
          // logged-out state.)                                                                               // 1215
          self._methodsBlockingQuiescence[invoker.methodId] = true;                                           // 1216
        }                                                                                                     // 1217
      });                                                                                                     // 1218
    }                                                                                                         // 1219
                                                                                                              // 1220
    self._messagesBufferedUntilQuiescence = [];                                                               // 1221
                                                                                                              // 1222
    // If we're not waiting on any methods or subs, we can reset the stores and                               // 1223
    // call the callbacks immediately.                                                                        // 1224
    if (!self._waitingForQuiescence()) {                                                                      // 1225
      if (self._resetStores) {                                                                                // 1226
        _.each(self._stores, function (s) {                                                                   // 1227
          s.beginUpdate(0, true);                                                                             // 1228
          s.endUpdate();                                                                                      // 1229
        });                                                                                                   // 1230
        self._resetStores = false;                                                                            // 1231
      }                                                                                                       // 1232
      self._runAfterUpdateCallbacks();                                                                        // 1233
    }                                                                                                         // 1234
  },                                                                                                          // 1235
                                                                                                              // 1236
                                                                                                              // 1237
  _processOneDataMessage: function (msg, updates) {                                                           // 1238
    var self = this;                                                                                          // 1239
    // Using underscore here so as not to need to capitalize.                                                 // 1240
    self['_process_' + msg.msg](msg, updates);                                                                // 1241
  },                                                                                                          // 1242
                                                                                                              // 1243
                                                                                                              // 1244
  _livedata_data: function (msg) {                                                                            // 1245
    var self = this;                                                                                          // 1246
                                                                                                              // 1247
    if (self._waitingForQuiescence()) {                                                                       // 1248
      self._messagesBufferedUntilQuiescence.push(msg);                                                        // 1249
                                                                                                              // 1250
      if (msg.msg === "nosub")                                                                                // 1251
        delete self._subsBeingRevived[msg.id];                                                                // 1252
                                                                                                              // 1253
      _.each(msg.subs || [], function (subId) {                                                               // 1254
        delete self._subsBeingRevived[subId];                                                                 // 1255
      });                                                                                                     // 1256
      _.each(msg.methods || [], function (methodId) {                                                         // 1257
        delete self._methodsBlockingQuiescence[methodId];                                                     // 1258
      });                                                                                                     // 1259
                                                                                                              // 1260
      if (self._waitingForQuiescence())                                                                       // 1261
        return;                                                                                               // 1262
                                                                                                              // 1263
      // No methods or subs are blocking quiescence!                                                          // 1264
      // We'll now process and all of our buffered messages, reset all stores,                                // 1265
      // and apply them all at once.                                                                          // 1266
      _.each(self._messagesBufferedUntilQuiescence, function (bufferedMsg) {                                  // 1267
        self._processOneDataMessage(bufferedMsg, self._bufferedWrites);                                       // 1268
      });                                                                                                     // 1269
      self._messagesBufferedUntilQuiescence = [];                                                             // 1270
    } else {                                                                                                  // 1271
      self._processOneDataMessage(msg, self._bufferedWrites);                                                 // 1272
    }                                                                                                         // 1273
                                                                                                              // 1274
    // Immediately flush writes when:                                                                         // 1275
    //  1. Buffering is disabled. Or;                                                                         // 1276
    //  2. any non-(added/changed/removed) message arrives.                                                   // 1277
    var standardWrite = _.include(['added', 'changed', 'removed'], msg.msg);                                  // 1278
    if (self._bufferedWritesInterval === 0 || !standardWrite) {                                               // 1279
      self._flushBufferedWrites();                                                                            // 1280
      return;                                                                                                 // 1281
    }                                                                                                         // 1282
                                                                                                              // 1283
    if (self._bufferedWritesFlushAt === null) {                                                               // 1284
      self._bufferedWritesFlushAt = new Date().valueOf() + self._bufferedWritesMaxAge;                        // 1285
    }                                                                                                         // 1286
    else if (self._bufferedWritesFlushAt < new Date().valueOf()) {                                            // 1287
      self._flushBufferedWrites();                                                                            // 1288
      return;                                                                                                 // 1289
    }                                                                                                         // 1290
                                                                                                              // 1291
    if (self._bufferedWritesFlushHandle) {                                                                    // 1292
      clearTimeout(self._bufferedWritesFlushHandle);                                                          // 1293
    }                                                                                                         // 1294
    self._bufferedWritesFlushHandle = setTimeout(self.__flushBufferedWrites,                                  // 1295
                                                      self._bufferedWritesInterval);                          // 1296
  },                                                                                                          // 1297
                                                                                                              // 1298
  _flushBufferedWrites: function () {                                                                         // 1299
    var self = this;                                                                                          // 1300
    if (self._bufferedWritesFlushHandle) {                                                                    // 1301
      clearTimeout(self._bufferedWritesFlushHandle);                                                          // 1302
      self._bufferedWritesFlushHandle = null;                                                                 // 1303
    }                                                                                                         // 1304
                                                                                                              // 1305
    self._bufferedWritesFlushAt = null;                                                                       // 1306
    // We need to clear the buffer before passing it to                                                       // 1307
    //  performWrites. As there's no guarantee that it                                                        // 1308
    //  will exit cleanly.                                                                                    // 1309
    var writes = self._bufferedWrites;                                                                        // 1310
    self._bufferedWrites = {};                                                                                // 1311
    self._performWrites(writes);                                                                              // 1312
  },                                                                                                          // 1313
                                                                                                              // 1314
  _performWrites: function(updates){                                                                          // 1315
    var self = this;                                                                                          // 1316
                                                                                                              // 1317
    if (self._resetStores || !_.isEmpty(updates)) {                                                           // 1318
      // Begin a transactional update of each store.                                                          // 1319
      _.each(self._stores, function (s, storeName) {                                                          // 1320
        s.beginUpdate(_.has(updates, storeName) ? updates[storeName].length : 0,                              // 1321
                      self._resetStores);                                                                     // 1322
      });                                                                                                     // 1323
      self._resetStores = false;                                                                              // 1324
                                                                                                              // 1325
      _.each(updates, function (updateMessages, storeName) {                                                  // 1326
        var store = self._stores[storeName];                                                                  // 1327
        if (store) {                                                                                          // 1328
          _.each(updateMessages, function (updateMessage) {                                                   // 1329
            store.update(updateMessage);                                                                      // 1330
          });                                                                                                 // 1331
        } else {                                                                                              // 1332
          // Nobody's listening for this data. Queue it up until                                              // 1333
          // someone wants it.                                                                                // 1334
          // XXX memory use will grow without bound if you forget to                                          // 1335
          // create a collection or just don't care about it... going                                         // 1336
          // to have to do something about that.                                                              // 1337
          if (!_.has(self._updatesForUnknownStores, storeName))                                               // 1338
            self._updatesForUnknownStores[storeName] = [];                                                    // 1339
          Array.prototype.push.apply(self._updatesForUnknownStores[storeName],                                // 1340
                                     updateMessages);                                                         // 1341
        }                                                                                                     // 1342
      });                                                                                                     // 1343
                                                                                                              // 1344
      // End update transaction.                                                                              // 1345
      _.each(self._stores, function (s) { s.endUpdate(); });                                                  // 1346
    }                                                                                                         // 1347
                                                                                                              // 1348
    self._runAfterUpdateCallbacks();                                                                          // 1349
  },                                                                                                          // 1350
                                                                                                              // 1351
  // Call any callbacks deferred with _runWhenAllServerDocsAreFlushed whose                                   // 1352
  // relevant docs have been flushed, as well as dataVisible callbacks at                                     // 1353
  // reconnect-quiescence time.                                                                               // 1354
  _runAfterUpdateCallbacks: function () {                                                                     // 1355
    var self = this;                                                                                          // 1356
    var callbacks = self._afterUpdateCallbacks;                                                               // 1357
    self._afterUpdateCallbacks = [];                                                                          // 1358
    _.each(callbacks, function (c) {                                                                          // 1359
      c();                                                                                                    // 1360
    });                                                                                                       // 1361
  },                                                                                                          // 1362
                                                                                                              // 1363
  _pushUpdate: function (updates, collection, msg) {                                                          // 1364
    var self = this;                                                                                          // 1365
    if (!_.has(updates, collection)) {                                                                        // 1366
      updates[collection] = [];                                                                               // 1367
    }                                                                                                         // 1368
    updates[collection].push(msg);                                                                            // 1369
  },                                                                                                          // 1370
                                                                                                              // 1371
  _getServerDoc: function (collection, id) {                                                                  // 1372
    var self = this;                                                                                          // 1373
    if (!_.has(self._serverDocuments, collection))                                                            // 1374
      return null;                                                                                            // 1375
    var serverDocsForCollection = self._serverDocuments[collection];                                          // 1376
    return serverDocsForCollection.get(id) || null;                                                           // 1377
  },                                                                                                          // 1378
                                                                                                              // 1379
  _process_added: function (msg, updates) {                                                                   // 1380
    var self = this;                                                                                          // 1381
    var id = MongoID.idParse(msg.id);                                                                         // 1382
    var serverDoc = self._getServerDoc(msg.collection, id);                                                   // 1383
    if (serverDoc) {                                                                                          // 1384
      // Some outstanding stub wrote here.                                                                    // 1385
      var isExisting = (serverDoc.document !== undefined);                                                    // 1386
                                                                                                              // 1387
      serverDoc.document = msg.fields || {};                                                                  // 1388
      serverDoc.document._id = id;                                                                            // 1389
                                                                                                              // 1390
      if (self._resetStores) {                                                                                // 1391
        // During reconnect the server is sending adds for existing ids.                                      // 1392
        // Always push an update so that document stays in the store after                                    // 1393
        // reset. Use current version of the document for this update, so                                     // 1394
        // that stub-written values are preserved.                                                            // 1395
        var currentDoc = self._stores[msg.collection].getDoc(msg.id);                                         // 1396
        if (currentDoc !== undefined)                                                                         // 1397
          msg.fields = currentDoc;                                                                            // 1398
                                                                                                              // 1399
        self._pushUpdate(updates, msg.collection, msg);                                                       // 1400
      } else if (isExisting) {                                                                                // 1401
        throw new Error("Server sent add for existing id: " + msg.id);                                        // 1402
      }                                                                                                       // 1403
    } else {                                                                                                  // 1404
      self._pushUpdate(updates, msg.collection, msg);                                                         // 1405
    }                                                                                                         // 1406
  },                                                                                                          // 1407
                                                                                                              // 1408
  _process_changed: function (msg, updates) {                                                                 // 1409
    var self = this;                                                                                          // 1410
    var serverDoc = self._getServerDoc(                                                                       // 1411
      msg.collection, MongoID.idParse(msg.id));                                                               // 1412
    if (serverDoc) {                                                                                          // 1413
      if (serverDoc.document === undefined)                                                                   // 1414
        throw new Error("Server sent changed for nonexisting id: " + msg.id);                                 // 1415
      DiffSequence.applyChanges(serverDoc.document, msg.fields);                                              // 1416
    } else {                                                                                                  // 1417
      self._pushUpdate(updates, msg.collection, msg);                                                         // 1418
    }                                                                                                         // 1419
  },                                                                                                          // 1420
                                                                                                              // 1421
  _process_removed: function (msg, updates) {                                                                 // 1422
    var self = this;                                                                                          // 1423
    var serverDoc = self._getServerDoc(                                                                       // 1424
      msg.collection, MongoID.idParse(msg.id));                                                               // 1425
    if (serverDoc) {                                                                                          // 1426
      // Some outstanding stub wrote here.                                                                    // 1427
      if (serverDoc.document === undefined)                                                                   // 1428
        throw new Error("Server sent removed for nonexisting id:" + msg.id);                                  // 1429
      serverDoc.document = undefined;                                                                         // 1430
    } else {                                                                                                  // 1431
      self._pushUpdate(updates, msg.collection, {                                                             // 1432
        msg: 'removed',                                                                                       // 1433
        collection: msg.collection,                                                                           // 1434
        id: msg.id                                                                                            // 1435
      });                                                                                                     // 1436
    }                                                                                                         // 1437
  },                                                                                                          // 1438
                                                                                                              // 1439
  _process_updated: function (msg, updates) {                                                                 // 1440
    var self = this;                                                                                          // 1441
    // Process "method done" messages.                                                                        // 1442
    _.each(msg.methods, function (methodId) {                                                                 // 1443
      _.each(self._documentsWrittenByStub[methodId], function (written) {                                     // 1444
        var serverDoc = self._getServerDoc(written.collection, written.id);                                   // 1445
        if (!serverDoc)                                                                                       // 1446
          throw new Error("Lost serverDoc for " + JSON.stringify(written));                                   // 1447
        if (!serverDoc.writtenByStubs[methodId])                                                              // 1448
          throw new Error("Doc " + JSON.stringify(written) +                                                  // 1449
                          " not written by  method " + methodId);                                             // 1450
        delete serverDoc.writtenByStubs[methodId];                                                            // 1451
        if (_.isEmpty(serverDoc.writtenByStubs)) {                                                            // 1452
          // All methods whose stubs wrote this method have completed! We can                                 // 1453
          // now copy the saved document to the database (reverting the stub's                                // 1454
          // change if the server did not write to this object, or applying the                               // 1455
          // server's writes if it did).                                                                      // 1456
                                                                                                              // 1457
          // This is a fake ddp 'replace' message.  It's just for talking                                     // 1458
          // between livedata connections and minimongo.  (We have to stringify                               // 1459
          // the ID because it's supposed to look like a wire message.)                                       // 1460
          self._pushUpdate(updates, written.collection, {                                                     // 1461
            msg: 'replace',                                                                                   // 1462
            id: MongoID.idStringify(written.id),                                                              // 1463
            replace: serverDoc.document                                                                       // 1464
          });                                                                                                 // 1465
          // Call all flush callbacks.                                                                        // 1466
          _.each(serverDoc.flushCallbacks, function (c) {                                                     // 1467
            c();                                                                                              // 1468
          });                                                                                                 // 1469
                                                                                                              // 1470
          // Delete this completed serverDocument. Don't bother to GC empty                                   // 1471
          // IdMaps inside self._serverDocuments, since there probably aren't                                 // 1472
          // many collections and they'll be written repeatedly.                                              // 1473
          self._serverDocuments[written.collection].remove(written.id);                                       // 1474
        }                                                                                                     // 1475
      });                                                                                                     // 1476
      delete self._documentsWrittenByStub[methodId];                                                          // 1477
                                                                                                              // 1478
      // We want to call the data-written callback, but we can't do so until all                              // 1479
      // currently buffered messages are flushed.                                                             // 1480
      var callbackInvoker = self._methodInvokers[methodId];                                                   // 1481
      if (!callbackInvoker)                                                                                   // 1482
        throw new Error("No callback invoker for method " + methodId);                                        // 1483
      self._runWhenAllServerDocsAreFlushed(                                                                   // 1484
        _.bind(callbackInvoker.dataVisible, callbackInvoker));                                                // 1485
    });                                                                                                       // 1486
  },                                                                                                          // 1487
                                                                                                              // 1488
  _process_ready: function (msg, updates) {                                                                   // 1489
    var self = this;                                                                                          // 1490
    // Process "sub ready" messages. "sub ready" messages don't take effect                                   // 1491
    // until all current server documents have been flushed to the local                                      // 1492
    // database. We can use a write fence to implement this.                                                  // 1493
    _.each(msg.subs, function (subId) {                                                                       // 1494
      self._runWhenAllServerDocsAreFlushed(function () {                                                      // 1495
        var subRecord = self._subscriptions[subId];                                                           // 1496
        // Did we already unsubscribe?                                                                        // 1497
        if (!subRecord)                                                                                       // 1498
          return;                                                                                             // 1499
        // Did we already receive a ready message? (Oops!)                                                    // 1500
        if (subRecord.ready)                                                                                  // 1501
          return;                                                                                             // 1502
        subRecord.ready = true;                                                                               // 1503
        subRecord.readyCallback && subRecord.readyCallback();                                                 // 1504
        subRecord.readyDeps.changed();                                                                        // 1505
      });                                                                                                     // 1506
    });                                                                                                       // 1507
  },                                                                                                          // 1508
                                                                                                              // 1509
  // Ensures that "f" will be called after all documents currently in                                         // 1510
  // _serverDocuments have been written to the local cache. f will not be called                              // 1511
  // if the connection is lost before then!                                                                   // 1512
  _runWhenAllServerDocsAreFlushed: function (f) {                                                             // 1513
    var self = this;                                                                                          // 1514
    var runFAfterUpdates = function () {                                                                      // 1515
      self._afterUpdateCallbacks.push(f);                                                                     // 1516
    };                                                                                                        // 1517
    var unflushedServerDocCount = 0;                                                                          // 1518
    var onServerDocFlush = function () {                                                                      // 1519
      --unflushedServerDocCount;                                                                              // 1520
      if (unflushedServerDocCount === 0) {                                                                    // 1521
        // This was the last doc to flush! Arrange to run f after the updates                                 // 1522
        // have been applied.                                                                                 // 1523
        runFAfterUpdates();                                                                                   // 1524
      }                                                                                                       // 1525
    };                                                                                                        // 1526
    _.each(self._serverDocuments, function (collectionDocs) {                                                 // 1527
      collectionDocs.forEach(function (serverDoc) {                                                           // 1528
        var writtenByStubForAMethodWithSentMessage = _.any(                                                   // 1529
          serverDoc.writtenByStubs, function (dummy, methodId) {                                              // 1530
            var invoker = self._methodInvokers[methodId];                                                     // 1531
            return invoker && invoker.sentMessage;                                                            // 1532
          });                                                                                                 // 1533
        if (writtenByStubForAMethodWithSentMessage) {                                                         // 1534
          ++unflushedServerDocCount;                                                                          // 1535
          serverDoc.flushCallbacks.push(onServerDocFlush);                                                    // 1536
        }                                                                                                     // 1537
      });                                                                                                     // 1538
    });                                                                                                       // 1539
    if (unflushedServerDocCount === 0) {                                                                      // 1540
      // There aren't any buffered docs --- we can call f as soon as the current                              // 1541
      // round of updates is applied!                                                                         // 1542
      runFAfterUpdates();                                                                                     // 1543
    }                                                                                                         // 1544
  },                                                                                                          // 1545
                                                                                                              // 1546
  _livedata_nosub: function (msg) {                                                                           // 1547
    var self = this;                                                                                          // 1548
                                                                                                              // 1549
    // First pass it through _livedata_data, which only uses it to help get                                   // 1550
    // towards quiescence.                                                                                    // 1551
    self._livedata_data(msg);                                                                                 // 1552
                                                                                                              // 1553
    // Do the rest of our processing immediately, with no                                                     // 1554
    // buffering-until-quiescence.                                                                            // 1555
                                                                                                              // 1556
    // we weren't subbed anyway, or we initiated the unsub.                                                   // 1557
    if (!_.has(self._subscriptions, msg.id))                                                                  // 1558
      return;                                                                                                 // 1559
                                                                                                              // 1560
    // XXX COMPAT WITH 1.0.3.1 #errorCallback                                                                 // 1561
    var errorCallback = self._subscriptions[msg.id].errorCallback;                                            // 1562
    var stopCallback = self._subscriptions[msg.id].stopCallback;                                              // 1563
                                                                                                              // 1564
    self._subscriptions[msg.id].remove();                                                                     // 1565
                                                                                                              // 1566
    var meteorErrorFromMsg = function (msgArg) {                                                              // 1567
      return msgArg && msgArg.error && new Meteor.Error(                                                      // 1568
        msgArg.error.error, msgArg.error.reason, msgArg.error.details);                                       // 1569
    }                                                                                                         // 1570
                                                                                                              // 1571
    // XXX COMPAT WITH 1.0.3.1 #errorCallback                                                                 // 1572
    if (errorCallback && msg.error) {                                                                         // 1573
      errorCallback(meteorErrorFromMsg(msg));                                                                 // 1574
    }                                                                                                         // 1575
                                                                                                              // 1576
    if (stopCallback) {                                                                                       // 1577
      stopCallback(meteorErrorFromMsg(msg));                                                                  // 1578
    }                                                                                                         // 1579
  },                                                                                                          // 1580
                                                                                                              // 1581
  _process_nosub: function () {                                                                               // 1582
    // This is called as part of the "buffer until quiescence" process, but                                   // 1583
    // nosub's effect is always immediate. It only goes in the buffer at all                                  // 1584
    // because it's possible for a nosub to be the thing that triggers                                        // 1585
    // quiescence, if we were waiting for a sub to be revived and it dies                                     // 1586
    // instead.                                                                                               // 1587
  },                                                                                                          // 1588
                                                                                                              // 1589
  _livedata_result: function (msg) {                                                                          // 1590
    // id, result or error. error has error (code), reason, details                                           // 1591
                                                                                                              // 1592
    var self = this;                                                                                          // 1593
                                                                                                              // 1594
    // Lets make sure there are no buffered writes before returning result.                                   // 1595
    if (!_.isEmpty(self._bufferedWrites)) {                                                                   // 1596
      self._flushBufferedWrites();                                                                            // 1597
    }                                                                                                         // 1598
                                                                                                              // 1599
    // find the outstanding request                                                                           // 1600
    // should be O(1) in nearly all realistic use cases                                                       // 1601
    if (_.isEmpty(self._outstandingMethodBlocks)) {                                                           // 1602
      Meteor._debug("Received method result but no methods outstanding");                                     // 1603
      return;                                                                                                 // 1604
    }                                                                                                         // 1605
    var currentMethodBlock = self._outstandingMethodBlocks[0].methods;                                        // 1606
    var m;                                                                                                    // 1607
    for (var i = 0; i < currentMethodBlock.length; i++) {                                                     // 1608
      m = currentMethodBlock[i];                                                                              // 1609
      if (m.methodId === msg.id)                                                                              // 1610
        break;                                                                                                // 1611
    }                                                                                                         // 1612
                                                                                                              // 1613
    if (!m) {                                                                                                 // 1614
      Meteor._debug("Can't match method response to original method call", msg);                              // 1615
      return;                                                                                                 // 1616
    }                                                                                                         // 1617
                                                                                                              // 1618
    // Remove from current method block. This may leave the block empty, but we                               // 1619
    // don't move on to the next block until the callback has been delivered, in                              // 1620
    // _outstandingMethodFinished.                                                                            // 1621
    currentMethodBlock.splice(i, 1);                                                                          // 1622
                                                                                                              // 1623
    if (_.has(msg, 'error')) {                                                                                // 1624
      m.receiveResult(new Meteor.Error(                                                                       // 1625
        msg.error.error, msg.error.reason,                                                                    // 1626
        msg.error.details));                                                                                  // 1627
    } else {                                                                                                  // 1628
      // msg.result may be undefined if the method didn't return a                                            // 1629
      // value                                                                                                // 1630
      m.receiveResult(undefined, msg.result);                                                                 // 1631
    }                                                                                                         // 1632
  },                                                                                                          // 1633
                                                                                                              // 1634
  // Called by MethodInvoker after a method's callback is invoked.  If this was                               // 1635
  // the last outstanding method in the current block, runs the next block. If                                // 1636
  // there are no more methods, consider accepting a hot code push.                                           // 1637
  _outstandingMethodFinished: function () {                                                                   // 1638
    var self = this;                                                                                          // 1639
    if (self._anyMethodsAreOutstanding())                                                                     // 1640
      return;                                                                                                 // 1641
                                                                                                              // 1642
    // No methods are outstanding. This should mean that the first block of                                   // 1643
    // methods is empty. (Or it might not exist, if this was a method that                                    // 1644
    // half-finished before disconnect/reconnect.)                                                            // 1645
    if (! _.isEmpty(self._outstandingMethodBlocks)) {                                                         // 1646
      var firstBlock = self._outstandingMethodBlocks.shift();                                                 // 1647
      if (! _.isEmpty(firstBlock.methods))                                                                    // 1648
        throw new Error("No methods outstanding but nonempty block: " +                                       // 1649
                        JSON.stringify(firstBlock));                                                          // 1650
                                                                                                              // 1651
      // Send the outstanding methods now in the first block.                                                 // 1652
      if (!_.isEmpty(self._outstandingMethodBlocks))                                                          // 1653
        self._sendOutstandingMethods();                                                                       // 1654
    }                                                                                                         // 1655
                                                                                                              // 1656
    // Maybe accept a hot code push.                                                                          // 1657
    self._maybeMigrate();                                                                                     // 1658
  },                                                                                                          // 1659
                                                                                                              // 1660
  // Sends messages for all the methods in the first block in                                                 // 1661
  // _outstandingMethodBlocks.                                                                                // 1662
  _sendOutstandingMethods: function() {                                                                       // 1663
    var self = this;                                                                                          // 1664
    if (_.isEmpty(self._outstandingMethodBlocks))                                                             // 1665
      return;                                                                                                 // 1666
    _.each(self._outstandingMethodBlocks[0].methods, function (m) {                                           // 1667
      m.sendMessage();                                                                                        // 1668
    });                                                                                                       // 1669
  },                                                                                                          // 1670
                                                                                                              // 1671
  _livedata_error: function (msg) {                                                                           // 1672
    Meteor._debug("Received error from server: ", msg.reason);                                                // 1673
    if (msg.offendingMessage)                                                                                 // 1674
      Meteor._debug("For: ", msg.offendingMessage);                                                           // 1675
  },                                                                                                          // 1676
                                                                                                              // 1677
  _callOnReconnectAndSendAppropriateOutstandingMethods: function() {                                          // 1678
    var self = this;                                                                                          // 1679
    var oldOutstandingMethodBlocks = self._outstandingMethodBlocks;                                           // 1680
    self._outstandingMethodBlocks = [];                                                                       // 1681
                                                                                                              // 1682
    self.onReconnect();                                                                                       // 1683
                                                                                                              // 1684
    if (_.isEmpty(oldOutstandingMethodBlocks))                                                                // 1685
      return;                                                                                                 // 1686
                                                                                                              // 1687
    // We have at least one block worth of old outstanding methods to try                                     // 1688
    // again. First: did onReconnect actually send anything? If not, we just                                  // 1689
    // restore all outstanding methods and run the first block.                                               // 1690
    if (_.isEmpty(self._outstandingMethodBlocks)) {                                                           // 1691
      self._outstandingMethodBlocks = oldOutstandingMethodBlocks;                                             // 1692
      self._sendOutstandingMethods();                                                                         // 1693
      return;                                                                                                 // 1694
    }                                                                                                         // 1695
                                                                                                              // 1696
    // OK, there are blocks on both sides. Special case: merge the last block of                              // 1697
    // the reconnect methods with the first block of the original methods, if                                 // 1698
    // neither of them are "wait" blocks.                                                                     // 1699
    if (!_.last(self._outstandingMethodBlocks).wait &&                                                        // 1700
        !oldOutstandingMethodBlocks[0].wait) {                                                                // 1701
      _.each(oldOutstandingMethodBlocks[0].methods, function (m) {                                            // 1702
        _.last(self._outstandingMethodBlocks).methods.push(m);                                                // 1703
                                                                                                              // 1704
        // If this "last block" is also the first block, send the message.                                    // 1705
        if (self._outstandingMethodBlocks.length === 1)                                                       // 1706
          m.sendMessage();                                                                                    // 1707
      });                                                                                                     // 1708
                                                                                                              // 1709
      oldOutstandingMethodBlocks.shift();                                                                     // 1710
    }                                                                                                         // 1711
                                                                                                              // 1712
    // Now add the rest of the original blocks on.                                                            // 1713
    _.each(oldOutstandingMethodBlocks, function (block) {                                                     // 1714
      self._outstandingMethodBlocks.push(block);                                                              // 1715
    });                                                                                                       // 1716
  },                                                                                                          // 1717
                                                                                                              // 1718
  // We can accept a hot code push if there are no methods in flight.                                         // 1719
  _readyToMigrate: function() {                                                                               // 1720
    var self = this;                                                                                          // 1721
    return _.isEmpty(self._methodInvokers);                                                                   // 1722
  },                                                                                                          // 1723
                                                                                                              // 1724
  // If we were blocking a migration, see if it's now possible to continue.                                   // 1725
  // Call whenever the set of outstanding/blocked methods shrinks.                                            // 1726
  _maybeMigrate: function () {                                                                                // 1727
    var self = this;                                                                                          // 1728
    if (self._retryMigrate && self._readyToMigrate()) {                                                       // 1729
      self._retryMigrate();                                                                                   // 1730
      self._retryMigrate = null;                                                                              // 1731
    }                                                                                                         // 1732
  }                                                                                                           // 1733
});                                                                                                           // 1734
                                                                                                              // 1735
LivedataTest.Connection = Connection;                                                                         // 1736
                                                                                                              // 1737
// @param url {String} URL to Meteor app,                                                                     // 1738
//     e.g.:                                                                                                  // 1739
//     "subdomain.meteor.com",                                                                                // 1740
//     "http://subdomain.meteor.com",                                                                         // 1741
//     "/",                                                                                                   // 1742
//     "ddp+sockjs://ddp--****-foo.meteor.com/sockjs"                                                         // 1743
                                                                                                              // 1744
/**                                                                                                           // 1745
 * @summary Connect to the server of a different Meteor application to subscribe to its document sets and invoke its remote methods.
 * @locus Anywhere                                                                                            // 1747
 * @param {String} url The URL of another Meteor application.                                                 // 1748
 */                                                                                                           // 1749
DDP.connect = function (url, options) {                                                                       // 1750
  var ret = new Connection(url, options);                                                                     // 1751
  allConnections.push(ret); // hack. see below.                                                               // 1752
  return ret;                                                                                                 // 1753
};                                                                                                            // 1754
                                                                                                              // 1755
// Hack for `spiderable` package: a way to see if the page is done                                            // 1756
// loading all the data it needs.                                                                             // 1757
//                                                                                                            // 1758
allConnections = [];                                                                                          // 1759
DDP._allSubscriptionsReady = function () {                                                                    // 1760
  return _.all(allConnections, function (conn) {                                                              // 1761
    return _.all(conn._subscriptions, function (sub) {                                                        // 1762
      return sub.ready;                                                                                       // 1763
    });                                                                                                       // 1764
  });                                                                                                         // 1765
};                                                                                                            // 1766
                                                                                                              // 1767
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
