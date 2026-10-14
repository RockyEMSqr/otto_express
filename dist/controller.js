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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedAPIController = exports.JSONNotNamedController = exports.JSONController = exports.CRUDController = exports.getMiddleWare = exports.Middleware = exports.Delete = exports.Put = exports.Post = exports.Get = exports.getHttpMethods = exports.getHttpMethod = exports.getRoute = exports.Route = exports.getAutoMount = exports.AutoMount = exports.getController = exports.Controller = void 0;
require("reflect-metadata");
const RouteKey = 'Route';
const ControllerKey = 'Contoller';
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
const AutoMountKey = 'AutoMount';
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
const methodKey = 'httpMethod';
function setHttpMethodMeta(verb, target, key) {
    const existing = Reflect.getMetadata(methodKey, target, key);
    const methods = Array.isArray(existing) ? existing : existing ? [existing] : [];
    return Reflect.defineMetadata(methodKey, [verb, ...methods], target, key);
}
function getHttpMethod(target, propKey) {
    const methods = getHttpMethods(target, propKey);
    return methods[0];
}
exports.getHttpMethod = getHttpMethod;
function getHttpMethods(target, propKey) {
    const methods = Reflect.getMetadata(methodKey, target, propKey);
    return Array.isArray(methods) ? methods : methods ? [methods] : [];
}
exports.getHttpMethods = getHttpMethods;
// Http Methods
function Get(route) {
    return function (target, propertyKey, descriptor) {
        setHttpMethodMeta('get', target, propertyKey);
        setRoute(route, target, propertyKey);
    };
}
exports.Get = Get;
function Post(route) {
    return function (target, propertyKey, descriptor) {
        setHttpMethodMeta('post', target, propertyKey);
        setRoute(route, target, propertyKey);
    };
}
exports.Post = Post;
function Put(route) {
    return function (target, propertyKey, descriptor) {
        setHttpMethodMeta('put', target, propertyKey);
        setRoute(route, target, propertyKey);
    };
}
exports.Put = Put;
function Delete(route) {
    return function (target, propertyKey, descriptor) {
        setHttpMethodMeta('delete', target, propertyKey);
        setRoute(route, target, propertyKey);
    };
}
exports.Delete = Delete;
const middlewareKey = 'MIDDLEWARE';
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
class CRUDController {
    constructor() {
        this.objName = "obj";
        this.pluralObjName = "objs";
    }
    async index(req, res) {
        let objs = await this.getDS(req).list();
        res.render(`${this.viewFolder}/index`, { [this.pluralObjName]: objs });
    }
    async _new(req, res) {
        res.render(`${this.viewFolder}/form`, {});
    }
    async _get(req, res) {
        let obj = await this.getDS(req).findById(req.params.id);
        res.render(`${this.viewFolder}/form`, { [this.objName]: obj });
    }
    async _post(req, res) {
        await this.getDS(req).save(req.body[this.objName]);
        req.session.messages.push('Saved');
        res.redirect('./');
    }
}
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
exports.CRUDController = CRUDController;
class JSONController {
    constructor() {
        this.objName = "obj";
        this.pluralObjName = "objs";
    }
    async index(req, res) {
        let q = this.getDS(req)._list(this.populate);
        let objs = await q.exec();
        res.json({ [this.pluralObjName]: objs });
    }
    async _get(req, res) {
        let q = this.getDS(req)._findById(req.params.id, this.populate);
        let obj = await q.exec();
        res.json({ [this.objName]: obj });
    }
    async _post(req, res) {
        let obj = await this.getDS(req).save(req.body[this.objName]);
        if (this.populate) {
            obj.populate(this.populate);
            await obj.execPopulate();
        }
        res.json({ [this.objName]: obj });
    }
    async _put(req, res) {
        let obj = await this.getDS(req).save(req.body[this.objName]);
        if (this.populate) {
            obj.populate(this.populate);
            await obj.execPopulate();
        }
        res.json({ [this.objName]: obj });
    }
}
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
exports.JSONController = JSONController;
/**
 * Like JSON Controller but response is just data not {objname:data}
 */
class JSONNotNamedController {
    async index(req, res) {
        let q = this.getDS(req)._list(this.populate);
        let objs = await q.exec();
        res.json(objs);
    }
    async _get(req, res) {
        let q = this.getDS(req)._findById(req.params.id, this.populate);
        let obj = await q.exec();
        res.json(obj);
    }
    async _post(req, res) {
        let obj = await this.getDS(req).save(req.body);
        if (this.populate) {
            obj.populate(this.populate);
            await obj.execPopulate();
        }
        res.json(obj);
    }
    async _put(req, res) {
        let obj = await this.getDS(req).save(req.body);
        if (this.populate) {
            obj.populate(this.populate);
            await obj.execPopulate();
        }
        res.json(obj);
    }
}
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
exports.JSONNotNamedController = JSONNotNamedController;
class PaginatedAPIController extends JSONNotNamedController {
    async paginate(req, res) {
        res.json(await this.getDS(req).paginate(this.populate, Number(req.query.page), {}, Number(req.query.pageSize)));
    }
    async paginateFilter(req, res) {
        let where = await this.getFilterWhere(req.ds, req.body);
        console.log('FILTER WHERE', JSON.stringify(where));
        res.json(await this.getDS(req).paginate(this.populate, Number(req.query.page), where, Number(req.query.pageSize), req.query.sortKey, Number(req.query.sortDir)));
    }
    async deleteThis(req, res) {
        await this.getDS(req).deleteThisOne(req.body._id);
        res.json({ ok: 1 });
    }
    async deleteThisOne(req, res) {
        await this.getDS(req).deleteThisOne(req.params.id);
        res.json({ ok: 1 });
    }
}
__decorate([
    Get('/paginate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaginatedAPIController.prototype, "paginate", null);
__decorate([
    Post('paginate/filter'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaginatedAPIController.prototype, "paginateFilter", null);
__decorate([
    Post('delete/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaginatedAPIController.prototype, "deleteThis", null);
__decorate([
    Post('delete/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaginatedAPIController.prototype, "deleteThisOne", null);
exports.PaginatedAPIController = PaginatedAPIController;
//# sourceMappingURL=controller.js.map