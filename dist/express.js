"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oexpress = void 0;
var express = require("express");
var path = require("path");
// import * as debugModule from 'debug';
var http = require("http");
function createApp(configOrPath) {
    var defaults = {
        pwd: process.cwd(),
        cwd: process.cwd(),
        views: 'views',
        viewEngine: null,
        publicFolders: ['public'],
        useSessionFileStore: false,
        useSQliteFileStore: false,
        session: {
            name: 'cookalook',
            secret: 'ChangeMe'
        },
        port: 3000
    };
    var config = __assign({}, defaults);
    if (typeof configOrPath == 'string') {
        config = __assign(__assign({}, config), require(configOrPath));
    }
    else if (typeof configOrPath == 'object') {
        config = __assign(__assign({}, config), configOrPath);
    }
    config = __assign(__assign({}, defaults), config);
    if (process.env.DEBUG) {
        console.log('FACILE CONFIG:', config);
    }
    if (config.serveFavicon) {
        var favicon = require('serve-favicon');
        // app.use(favicon);
        app.use(favicon(path.join(__dirname, '../public/favicon.ico')));
    }
    if (config.log) {
        var logger = require('morgan');
        app.use(logger('dev'));
    }
    var bodyParser = require('body-parser');
    var app = express();
    /**
     * monkey patch to allow dots
     */
    var qs = require('qs');
    var _qsparse = qs.parse;
    qs.parse = function (str, opts) {
        return _qsparse(str, __assign({ allowDots: true }, opts));
    };
    if (config.bodyParserJSONOptions) {
        app.use(bodyParser.json(config.bodyParserJSONOptions));
    }
    else {
        app.use(bodyParser.json());
    }
    if (config.bodyParserUrlEncodedOptions) {
        app.use(bodyParser.urlencoded(__assign({ extended: true }, config.bodyParserUrlEncodedOptions)));
    }
    else {
        app.use(bodyParser.urlencoded({ extended: true }));
    }
    app.set('x-powered-by', false);
    // view engine setup
    app.set('views', path.join(config.cwd, config.views));
    if (config.viewEngine) {
        app.set('view engine', config.viewEngine);
    }
    for (var i = 0; i < config.publicFolders.length; i++) {
        app.use(express.static(path.join(config.cwd, config.publicFolders[i])));
    }
    if (config.useSessionFileStore || config.useSQliteFileStore || config.useThisSessionStore) {
        var sessionStore = void 0;
        var session = require('express-session');
        if (config.useThisSessionStore) {
            var store = config.useThisSessionStore(session);
            sessionStore = new store(config.sessionStoreOptions); //db:':memory:'
        }
        else {
            if (config.useSQliteFileStore) {
                var FileStore = require('connect-sqlite3')(session);
                sessionStore = new FileStore({ dir: config.cwd, db: 'sessions.db' });
            }
            if (config.useSessionFileStore) {
                var FileStore = require('session-file-store')(session);
                sessionStore = new FileStore({
                    fallbackSessionFn: function (sessionId) {
                        return {
                            "cookie": {
                                "originalMaxAge": null,
                                "expires": null,
                                "httpOnly": true,
                                "path": "/"
                            }
                        };
                    }
                });
            }
        }
        app.use(session({
            store: sessionStore,
            secret: config.session.secret,
            resave: true,
            saveUninitialized: true,
            name: config.session.name
        }));
    }
    app.start = function () {
        //catch 404 and forward to error handler
        app.use(function (req, res, next) {
            var err = new Error('Not Found');
            err['status'] = 404;
            next(err);
        });
        // error handlers
        // development error handler
        // will print stacktrace
        if (app.get('env') === 'development') {
            app.use(function (err, req, res, next) {
                res.status(err['status'] || 500);
                var vm = Object.assign({}, {
                    message: err.message,
                    error: err
                }, res.locals);
                console.error(err.status, err.message, req.method, req.url);
                /**
                 * if accept header is * then lets send back what they sent us
                 */
                if (req.headers.accept.indexOf('*') > -1) {
                    if (req.headers["content-type"] && req.headers["content-type"].indexOf('application/json') > -1) {
                        return res.json(vm);
                    }
                    else {
                        // let errViewP = path.join(config.cwd, config.views, 'error.pug');
                        // if (!existsSync(errViewP)) {
                        // 	errViewP = path.join(__dirname, '../../', 'views', 'error.pug');
                        // }
                        return res.send("\n\t\t\t\t\t\t<html><body>" + JSON.stringify(vm) + "</body></html>\n\t\t\t\t\t\t"); //res.render(errViewP, vm);
                    }
                }
                else {
                    /**
                     * accept header is set. lets send them back what they want
                     */
                    return res.format({
                        html: function () {
                            // let errViewP = path.join(config.cwd, config.views, 'error.pug');
                            // if (!existsSync(errViewP)) {
                            // 	errViewP = path.join(__dirname, '../../', 'views', 'error.pug');
                            // }
                            return res.send("\n\t\t\t\t\t\t\t<html><body>" + JSON.stringify(vm) + "</body></html>\n\t\t\t\t\t\t\t");
                        },
                        json: function () {
                            return res.json(vm);
                        }
                    });
                }
            });
        }
        // production error handler
        // no stacktraces leaked to user
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            var vm = Object.assign({}, {
                message: err.message,
                error: {}
            }, res.locals);
            /**
                 * if accept header is * then lets send back what they sent us
                 */
            if (req.headers && req.headers.accept && req.headers.accept.indexOf('*') > -1) {
                if (req.headers["content-type"] && req.headers["content-type"].indexOf('application/json') > -1) {
                    return res.json(vm);
                }
                else {
                    return res.send("\n\t\t\t\t\t<html><body>" + JSON.stringify(vm) + "</body></html>\n\t\t\t\t\t");
                }
            }
            else {
                /**
                 * accept header is set. lets send them back what they want
                 */
                return res.format({
                    html: function () {
                        return res.send("\n\t\t\t\t\t\t<html><body>" + JSON.stringify(vm) + "</body></html>\n\t\t\t\t\t\t");
                    },
                    json: function () {
                        return res.json(vm);
                    }
                });
            }
        });
        // var debug = debugModule('facile_server');
        /**
         * Get port from environment and store in Express.
         */
        var port = normalizePort(process.env.PORT || config.port || '3000');
        app.set('port', port);
        /**
         * Create HTTP server.
         */
        var server = http.createServer(app);
        /**
         * Listen on provided port, on all network interfaces.
         */
        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);
        /**
         * Normalize a port into a number, string, or false.
         */
        function normalizePort(val) {
            var port = parseInt(val, 10);
            if (isNaN(port)) {
                // named pipe
                return val;
            }
            if (port >= 0) {
                // port number
                return port;
            }
            return false;
        }
        /**
         * Event listener for HTTP server "error" event.
         */
        function onError(error) {
            if (error.syscall !== 'listen') {
                throw error;
            }
            var bind = typeof port === 'string'
                ? 'Pipe ' + port
                : 'Port ' + port;
            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    console.error(bind + ' requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(bind + ' is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        }
        /**
         * Event listener for HTTP server "listening" event.
         */
        function onListening() {
            var addr = server.address();
            var bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            console.info('Listening on ' + bind);
        }
        return server;
    };
    return app;
}
exports.oexpress = createApp;
// export default createApp;
//# sourceMappingURL=express.js.map