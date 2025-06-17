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
exports.PaginatedAPIController = exports.JSONNotNamedController = exports.JSONController = exports.CRUDController = void 0;
exports.Controller = Controller;
exports.getController = getController;
exports.AutoMount = AutoMount;
exports.getAutoMount = getAutoMount;
exports.Route = Route;
exports.getRoute = getRoute;
exports.getHttpMethod = getHttpMethod;
exports.Get = Get;
exports.Post = Post;
exports.Put = Put;
exports.Delete = Delete;
exports.Middleware = Middleware;
exports.getMiddleWare = getMiddleWare;
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
function getController(target) {
    return Reflect.getMetadata(ControllerKey, target);
}
const AutoMountKey = 'AutoMount';
function AutoMount() {
    return Reflect.metadata(AutoMountKey, true);
}
function getAutoMount(target) {
    return Reflect.getMetadata(AutoMountKey, target);
}
function Route(route) {
    return Reflect.metadata(RouteKey, route);
}
function getRoute(target, propKey) {
    if (target && propKey) {
        return Reflect.getMetadata(RouteKey, target, propKey);
    }
    return Reflect.getMetadata(RouteKey, target);
}
const methodKey = 'httpMethod';
function setHttpMethodMeta(verb, target, key, desc) {
    return Reflect.defineMetadata(methodKey, verb, target, key);
}
function getHttpMethod(target, propKey) {
    return Reflect.getMetadata(methodKey, target, propKey);
}
// Http Methods
function Get(route) {
    return function (target, propertyKey, descriptor) {
        Reflect.defineMetadata(methodKey, 'get', target, propertyKey);
        setRoute(route, target, propertyKey);
    };
}
function Post(route) {
    return function (target, propertyKey, descriptor) {
        Reflect.defineMetadata(methodKey, 'post', target, propertyKey);
        setRoute(route, target, propertyKey);
    };
}
function Put(route) {
    return function (target, propertyKey, descriptor) {
        Reflect.defineMetadata(methodKey, 'put', target, propertyKey);
        setRoute(route, target, propertyKey);
    };
}
function Delete(route) {
    return function (target, propertyKey, descriptor) {
        Reflect.defineMetadata(methodKey, 'delete', target, propertyKey);
        setRoute(route, target, propertyKey);
    };
}
const middlewareKey = 'MIDDLEWARE';
function setMiddleware(middleware) {
    return function (target, propertyKey, descriptor) {
        Reflect.defineMetadata(middlewareKey, middleware, target, propertyKey);
    };
}
function Middleware(middleware) {
    return setMiddleware(middleware);
}
function getMiddleWare(target, propKey) {
    if (target && propKey) {
        return Reflect.getMetadata(middlewareKey, target, propKey);
    }
    return Reflect.getMetadata(middlewareKey, target);
}
class CRUDController {
    objName = "obj";
    pluralObjName = "objs";
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
exports.CRUDController = CRUDController;
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
class JSONController {
    objName = "obj";
    pluralObjName = "objs";
    //string or array of names to populate on getById
    populate;
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
exports.JSONController = JSONController;
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
/**
 * Like JSON Controller but response is just data not {objname:data}
 */
class JSONNotNamedController {
    //string or array of names to populate on getById
    populate;
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
exports.JSONNotNamedController = JSONNotNamedController;
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
exports.PaginatedAPIController = PaginatedAPIController;
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
//# sourceMappingURL=controller.js.map