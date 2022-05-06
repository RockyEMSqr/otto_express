"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.JSONNotNamedController = exports.JSONController = exports.CRUDController = exports.getMiddleWare = exports.Middleware = exports.Delete = exports.Put = exports.Post = exports.Get = exports.getHttpMethod = exports.getRoute = exports.Route = exports.getAutoMount = exports.AutoMount = exports.getController = exports.Controller = void 0;
require("reflect-metadata");
var RouteKey = 'Route';
var ControllerKey = 'Contoller';
function setRoute(route, target, propertyKey) {
    if (route) {
        Reflect.defineMetadata(RouteKey, route, target, propertyKey);
    }
}
function Controller(route) {
    return function (target, propertyKey, descriptor) {
        if (route) {
            setRoute(route, target, propertyKey);
        }
        Reflect.defineMetadata(ControllerKey, true, target, propertyKey);
    };
}
exports.Controller = Controller;
function getController(target) {
    return Reflect.getMetadata(ControllerKey, target);
}
exports.getController = getController;
var AutoMountKey = 'AutoMount';
function AutoMount() {
    return Reflect.metadata(AutoMountKey, true);
}
exports.AutoMount = AutoMount;
function getAutoMount(target) {
    return Reflect.getMetadata(AutoMountKey, target);
}
exports.getAutoMount = getAutoMount;
function Route(route) {
    return Reflect.metadata(RouteKey, route);
}
exports.Route = Route;
function getRoute(target, propKey) {
    if (target && propKey) {
        return Reflect.getMetadata(RouteKey, target, propKey);
    }
    return Reflect.getMetadata(RouteKey, target);
}
exports.getRoute = getRoute;
var methodKey = 'httpMethod';
function setHttpMethodMeta(verb, target, key, desc) {
    return Reflect.defineMetadata(methodKey, verb, target, key);
}
function getHttpMethod(target, propKey) {
    return Reflect.getMetadata(methodKey, target, propKey);
}
exports.getHttpMethod = getHttpMethod;
// Http Methods
function Get(route) {
    return function (target, propertyKey, descriptor) {
        Reflect.defineMetadata(methodKey, 'get', target, propertyKey);
        setRoute(route, target, propertyKey);
    };
}
exports.Get = Get;
function Post(route) {
    return function (target, propertyKey, descriptor) {
        Reflect.defineMetadata(methodKey, 'post', target, propertyKey);
        setRoute(route, target, propertyKey);
    };
}
exports.Post = Post;
function Put(route) {
    return function (target, propertyKey, descriptor) {
        Reflect.defineMetadata(methodKey, 'put', target, propertyKey);
        setRoute(route, target, propertyKey);
    };
}
exports.Put = Put;
function Delete(route) {
    return function (target, propertyKey, descriptor) {
        Reflect.defineMetadata(methodKey, 'delete', target, propertyKey);
        setRoute(route, target, propertyKey);
    };
}
exports.Delete = Delete;
var middlewareKey = 'MIDDLEWARE';
function setMiddleware(middleware) {
    return function (target, propertyKey, descriptor) {
        Reflect.defineMetadata(middlewareKey, middleware, target, propertyKey);
    };
}
function Middleware(middleware) {
    return setMiddleware(middleware);
}
exports.Middleware = Middleware;
function getMiddleWare(target, propKey) {
    if (target && propKey) {
        return Reflect.getMetadata(middlewareKey, target, propKey);
    }
    return Reflect.getMetadata(middlewareKey, target);
}
exports.getMiddleWare = getMiddleWare;
var CRUDController = /** @class */ (function () {
    function CRUDController() {
        this.objName = "obj";
        this.pluralObjName = "objs";
    }
    CRUDController.prototype.index = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var objs;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getDS(req).list()];
                    case 1:
                        objs = _b.sent();
                        res.render("".concat(this.viewFolder, "/index"), (_a = {}, _a[this.pluralObjName] = objs, _a));
                        return [2 /*return*/];
                }
            });
        });
    };
    CRUDController.prototype._new = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.render("".concat(this.viewFolder, "/form"), {});
                return [2 /*return*/];
            });
        });
    };
    CRUDController.prototype._get = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var obj;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getDS(req).findById(req.params.id)];
                    case 1:
                        obj = _b.sent();
                        res.render("".concat(this.viewFolder, "/form"), (_a = {}, _a[this.objName] = obj, _a));
                        return [2 /*return*/];
                }
            });
        });
    };
    CRUDController.prototype._post = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDS(req).save(req.body[this.objName])];
                    case 1:
                        _a.sent();
                        req.session.messages.push('Saved');
                        res.redirect('./');
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Get('/'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], CRUDController.prototype, "index", null);
    __decorate([
        Get('/new'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], CRUDController.prototype, "_new", null);
    __decorate([
        Get('/:id'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], CRUDController.prototype, "_get", null);
    __decorate([
        Post(['/:id', '/new']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], CRUDController.prototype, "_post", null);
    return CRUDController;
}());
exports.CRUDController = CRUDController;
var JSONController = /** @class */ (function () {
    function JSONController() {
        this.objName = "obj";
        this.pluralObjName = "objs";
    }
    JSONController.prototype.index = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var q, objs;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        q = this.getDS(req)._list(this.populate);
                        return [4 /*yield*/, q.exec()];
                    case 1:
                        objs = _b.sent();
                        res.json((_a = {}, _a[this.pluralObjName] = objs, _a));
                        return [2 /*return*/];
                }
            });
        });
    };
    JSONController.prototype._get = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var q, obj;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        q = this.getDS(req)._findById(req.params.id, this.populate);
                        return [4 /*yield*/, q.exec()];
                    case 1:
                        obj = _b.sent();
                        res.json((_a = {}, _a[this.objName] = obj, _a));
                        return [2 /*return*/];
                }
            });
        });
    };
    JSONController.prototype._post = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var obj;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getDS(req).save(req.body[this.objName])];
                    case 1:
                        obj = _b.sent();
                        if (!this.populate) return [3 /*break*/, 3];
                        obj.populate(this.populate);
                        return [4 /*yield*/, obj.execPopulate()];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        res.json((_a = {}, _a[this.objName] = obj, _a));
                        return [2 /*return*/];
                }
            });
        });
    };
    JSONController.prototype._put = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var obj;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getDS(req).save(req.body[this.objName])];
                    case 1:
                        obj = _b.sent();
                        if (!this.populate) return [3 /*break*/, 3];
                        obj.populate(this.populate);
                        return [4 /*yield*/, obj.execPopulate()];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        res.json((_a = {}, _a[this.objName] = obj, _a));
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Get('/'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], JSONController.prototype, "index", null);
    __decorate([
        Get('/:id'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], JSONController.prototype, "_get", null);
    __decorate([
        Post(['/:id', '/']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], JSONController.prototype, "_post", null);
    __decorate([
        Put(['/:id', '/']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], JSONController.prototype, "_put", null);
    return JSONController;
}());
exports.JSONController = JSONController;
/**
 * Like JSON Controller but response is just data not {objname:data}
 */
var JSONNotNamedController = /** @class */ (function () {
    function JSONNotNamedController() {
    }
    JSONNotNamedController.prototype.index = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var q, objs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        q = this.getDS(req)._list(this.populate);
                        return [4 /*yield*/, q.exec()];
                    case 1:
                        objs = _a.sent();
                        res.json(objs);
                        return [2 /*return*/];
                }
            });
        });
    };
    JSONNotNamedController.prototype._get = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var q, obj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        q = this.getDS(req)._findById(req.params.id, this.populate);
                        return [4 /*yield*/, q.exec()];
                    case 1:
                        obj = _a.sent();
                        res.json(obj);
                        return [2 /*return*/];
                }
            });
        });
    };
    JSONNotNamedController.prototype._post = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var obj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDS(req).save(req.body)];
                    case 1:
                        obj = _a.sent();
                        if (!this.populate) return [3 /*break*/, 3];
                        obj.populate(this.populate);
                        return [4 /*yield*/, obj.execPopulate()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        res.json(obj);
                        return [2 /*return*/];
                }
            });
        });
    };
    JSONNotNamedController.prototype._put = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var obj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDS(req).save(req.body)];
                    case 1:
                        obj = _a.sent();
                        if (!this.populate) return [3 /*break*/, 3];
                        obj.populate(this.populate);
                        return [4 /*yield*/, obj.execPopulate()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        res.json(obj);
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Get('/'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], JSONNotNamedController.prototype, "index", null);
    __decorate([
        Get('/:id'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], JSONNotNamedController.prototype, "_get", null);
    __decorate([
        Post(['/:id', '/']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], JSONNotNamedController.prototype, "_post", null);
    __decorate([
        Put(['/:id', '/']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], JSONNotNamedController.prototype, "_put", null);
    return JSONNotNamedController;
}());
exports.JSONNotNamedController = JSONNotNamedController;
//# sourceMappingURL=controller.js.map