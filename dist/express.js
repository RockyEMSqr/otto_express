"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oexpress = void 0;
const express_1 = __importDefault(require("express"));
const path = require("path");
// import * as debugModule from 'debug';
const http = require("http");
function createApp(configOrPath) {
    let defaults = {
        pwd: process.cwd(),
        cwd: process.cwd(),
        views: 'views',
        viewEngine: null, //'pug',
        publicFolders: ['public'],
        useSessionFileStore: false,
        useSQliteFileStore: false,
        session: {
            name: 'cookalook',
            secret: 'ChangeMe'
        },
        port: 3000
    };
    var config = { ...defaults };
    if (typeof configOrPath == 'string') {
        config = { ...config, ...require(configOrPath) };
    }
    else if (typeof configOrPath == 'object') {
        config = { ...config, ...configOrPath };
    }
    config = { ...defaults, ...config };
    if (process.env.DEBUG) {
        console.log('FACILE CONFIG:', config);
    }
    if (config.serveFavicon) {
        let favicon = require('serve-favicon');
        // app.use(favicon);
        app.use(favicon(path.join(__dirname, '../public/favicon.ico')));
    }
    if (config.log) {
        let logger = require('morgan');
        app.use(logger('dev'));
    }
    var bodyParser = require('body-parser');
    var app = (0, express_1.default)();
    /**
     * monkey patch to allow dots
     */
    var qs = require('qs');
    let _qsparse = qs.parse;
    qs.parse = function (str, opts) {
        return _qsparse(str, { allowDots: true, ...opts });
    };
    if (config.bodyParserJSONOptions) {
        app.use(bodyParser.json(config.bodyParserJSONOptions));
    }
    else {
        app.use(bodyParser.json());
    }
    if (config.bodyParserUrlEncodedOptions) {
        app.use(bodyParser.urlencoded({ extended: true, ...config.bodyParserUrlEncodedOptions }));
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
    for (let i = 0; i < config.publicFolders.length; i++) {
        app.use(express_1.default.static(path.join(config.cwd, config.publicFolders[i])));
    }
    // if (config.useSessionFileStore || config.useSQliteFileStore || config.useThisSessionStore) {
    // 	let sessionStore;
    // 	let session = require('express-session');
    // 	if (config.useThisSessionStore) {
    // 		let store = config.useThisSessionStore(session);
    // 		sessionStore = new store(config.sessionStoreOptions); //db:':memory:'
    // 	} else {
    // 		if (config.useSQliteFileStore) {
    // 			var FileStore = require('connect-sqlite3')(session);
    // 			sessionStore = new FileStore({ dir: config.cwd, db: 'sessions.db' })
    // 		}
    // 		if (config.useSessionFileStore) {
    // 			var FileStore = require('session-file-store')(session);
    // 			sessionStore = new FileStore({
    // 				fallbackSessionFn: function (sessionId) {
    // 					return {
    // 						"cookie": {
    // 							"originalMaxAge": null,
    // 							"expires": null,
    // 							"httpOnly": true,
    // 							"path": "/"
    // 						}
    // 					};
    // 				}
    // 			});
    // 		}
    // 	}
    // 	app.use(session({
    // 		store: sessionStore,
    // 		secret: config.session.secret,
    // 		resave: true,
    // 		saveUninitialized: true,
    // 		name: config.session.name
    // 	}));
    // }
    app.start = function () {
        //catch 404 and forward to error handler
        app.use((req, res, next) => {
            var err = new Error('Not Found');
            err['status'] = 404;
            next(err);
        });
        // error handlers
        // development error handler
        // will print stacktrace
        if (app.get('env') === 'development') {
            app.use((err, req, res, next) => {
                res.status(err['status'] || 500);
                let vm = Object.assign({}, {
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
                        return res.send(`
						<html><body>${JSON.stringify(vm)}</body></html>
						`); //res.render(errViewP, vm);
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
                            return res.send(`
							<html><body>${JSON.stringify(vm)}</body></html>
							`);
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
        app.use((err, req, res, next) => {
            res.status(err.status || 500);
            let vm = Object.assign({}, {
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
                    return res.send(`
					<html><body>${JSON.stringify(vm)}</body></html>
					`);
                }
            }
            else {
                /**
                 * accept header is set. lets send them back what they want
                 */
                return res.format({
                    html: function () {
                        return res.send(`
						<html><body>${JSON.stringify(vm)}</body></html>
						`);
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