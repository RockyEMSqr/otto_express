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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupController = exports.SetupArea = exports.router = void 0;
var utils = require("./utils");
var path = require("path");
var controller_1 = require("./controller");
function router(app, conf) {
    var cwd = process.cwd();
    var defaults = {
        controllers: path.join(cwd, '/controllers'),
        middleware: [],
        area: null
    };
    conf = __assign(__assign({}, defaults), conf);
    var dev = false;
    if (dev) {
        mountDir(app, conf.controllers, conf);
        return function (req, res, next) {
            mountDir(app, path.join(cwd, conf.controllers), conf);
            next();
        };
    }
    else {
        mountDir(app, path.join(cwd, conf.controllers), conf);
        return function (req, res, next) {
            next();
        };
    }
}
exports.router = router;
function mountDir(app, dir, opts) {
    //TODO(rc): check if using ts-node
    var mods = utils.rrequireDir(dir);
    for (var key in mods) {
        //module/file
        var mod = mods[key];
        for (var mkey in mod) {
            var mem = mod[mkey];
            //check if class
            //console.log(key, mkey, typeof mem, mem && mem.constructor);
            //TODO(rocky): handle mem null better?
            if (mem && mem.constructor) {
                var mount = controller_1.getAutoMount(mem);
                var controller = controller_1.getController(mem);
                if (mount || controller) {
                    setupController(app, mem, opts.area, opts.middleware);
                }
            }
        }
    }
}
function SetupArea(app, dir, area) {
    var preHanders = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        preHanders[_i - 3] = arguments[_i];
    }
    var mods = utils.requireDir(dir);
    for (var key in mods) {
        //module/file
        var mod = mods[key];
        for (var mkey in mod) {
            var mem = mod[mkey];
            //check if class
            //console.log(key, mkey, typeof mem, mem && mem.constructor);
            //TODO(rocky): handle mem null better?
            if (mem && mem.constructor) {
                var mount = controller_1.getAutoMount(mem);
                if (mount) {
                    setupController(app, mem, area, preHanders);
                }
            }
        }
    }
}
exports.SetupArea = SetupArea;
function trimLeadingSlash(r) {
    if (r.substr(0, 1) == '/') {
        r = r.substr(1, r.length);
    }
    return r;
}
function setupController(app, C, area) {
    var preHandlers = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        preHandlers[_i - 3] = arguments[_i];
    }
    preHandlers = [].concat.apply([], preHandlers);
    preHandlers = preHandlers.filter(function (x) { return x != undefined; });
    var ctrl = new C();
    // console.log(ctrl, C, C.name, ctrl.name);
    var proto = Object.getPrototypeOf(ctrl);
    var names = []; //Object.getOwnPropertyNames(proto);
    while (proto && proto.constructor.name != "Object") {
        names = names.concat(Object.getOwnPropertyNames(proto));
        proto = Object.getPrototypeOf(proto);
    }
    var _loop_1 = function (name) {
        var method = ctrl[name];
        //skip ctor
        if (method === C) {
            return "continue";
        }
        //TODO: check if method is private?
        var actionRoute = controller_1.getRoute(ctrl, name);
        var controllerRoute = controller_1.getRoute(C);
        var httpMethod = controller_1.getHttpMethod(ctrl, name); //|| 'get'; //default to a get
        route = '/';
        if (area) {
            route += area + "/";
        }
        if (controllerRoute && controllerRoute != '/') {
            if (controllerRoute[0] == '/') {
                controllerRoute = controllerRoute.slice(1, controllerRoute.length);
            }
            route += controllerRoute + '/';
        }
        if (actionRoute) {
            if (Array.isArray(actionRoute)) {
                var routes = actionRoute.map(function (x) { return route + trimLeadingSlash(x); });
                route = routes;
                console.log(route);
            }
            else {
                if (actionRoute == '/') {
                }
                else {
                    route += trimLeadingSlash(actionRoute);
                }
            }
        }
        else {
            route += name;
        }
        var allMiddleware = [].concat(preHandlers);
        //todo(rc): method middleware comes first?
        var methodMiddleware = controller_1.getMiddleWare(ctrl, name);
        if (methodMiddleware) {
            if (Array.isArray(methodMiddleware)) {
                allMiddleware = allMiddleware.concat.apply(allMiddleware, methodMiddleware);
            }
            else {
                allMiddleware = allMiddleware.concat(methodMiddleware);
            }
        }
        var controllerMiddleware = controller_1.getMiddleWare(C);
        if (controllerMiddleware) {
            if (Array.isArray(controllerMiddleware)) {
                allMiddleware = allMiddleware.concat.apply(allMiddleware, controllerMiddleware);
            }
            else {
                allMiddleware = allMiddleware.concat(controllerMiddleware);
            }
        }
        if (httpMethod) {
            app[httpMethod](route, allMiddleware, function (req, res, next) {
                return __awaiter(this, void 0, void 0, function () {
                    var err_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (process.env.F_PROFILE) {
                                    console.time(req.path);
                                }
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, method.call(ctrl, req, res, next)];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                err_1 = _a.sent();
                                next(err_1);
                                return [3 /*break*/, 4];
                            case 4:
                                if (process.env.F_PROFILE) {
                                    console.timeEnd(req.path);
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            });
        }
        if (process.env.DEBUG) {
            console.log("method: " + httpMethod + " \t ctrl: " + controllerRoute + " \t action: " + (actionRoute || name) + "\n route: " + route + " --middleware: " + allMiddleware.map(function (x) { return x.name; }).join(', '));
        }
    };
    var route;
    for (var _a = 0, names_1 = names; _a < names_1.length; _a++) {
        var name = names_1[_a];
        _loop_1(name);
    }
}
exports.setupController = setupController;
//# sourceMappingURL=router.js.map