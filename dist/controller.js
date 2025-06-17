var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
import "reflect-metadata";
// polyfill.ts
// Check if Symbol.metadata is already defined.
// If not, define it using Symbol.for to ensure global uniqueness.
if (typeof Symbol.metadata === 'undefined') {
    Symbol.metadata = Symbol.for('Symbol.metadata');
}
const RouteKey = 'Route';
const ControllerKey = 'Contoller';
// function setRoute(route: string, target: Object, propertyKey?: string) {
//     if (propertyKey) {
//         Reflect.defineMetadata(RouteKey, route, target, propertyKey);
//     } else {
//         Reflect.defineMetadata(RouteKey, route, target);
//     }
function setRoute(route, context) {
    let metadata = context[Symbol.metadata] || context.metadata; //[Symbol.metadata];
    metadata = metadata || {};
    if (context.kind == 'method') {
        metadata[context.name] = metadata[context.name] || {};
        metadata[context.name][RouteKey] = route;
    }
    else {
        metadata[RouteKey] = route;
    }
    // return metadata[propKey][methodKey]
}
// }
// export function Controller(route?) {
//     return function (target, propertyKey?: string, descriptor?: PropertyDescriptor) {
//         if (route) {
//             setRoute(route, target, propertyKey);
//         }
//         Reflect.defineMetadata(ControllerKey, true, target, propertyKey);
//     }
// }
export function Controller(route) {
    return (target) => {
        setRoute(route, target);
        Reflect.defineMetadata(ControllerKey, route, target);
        // Initialize the routes array if it doesn't exist
        // if (!Reflect.hasMetadata(CONTROLLER_ROUTES_METADATA, target)) {
        //     Reflect.defineMetadata(CONTROLLER_ROUTES_METADATA, [], target);
        // }
    };
}
export function getController(target) {
    return Reflect.getMetadata(ControllerKey, target);
}
const AutoMountKey = 'AutoMount';
export function AutoMount() {
    return Reflect.metadata(AutoMountKey, true);
}
export function getAutoMount(target) {
    return Reflect.getMetadata(AutoMountKey, target);
}
export function Route(route) {
    return Reflect.metadata(RouteKey, route);
}
export function getRoute(target, propKey) {
    const metadata = target[Symbol.metadata];
    if (propKey) {
        return metadata[propKey][RouteKey];
    }
    return metadata[RouteKey];
    if (target && propKey) {
        return Reflect.getMetadata(RouteKey, target, propKey);
    }
    return Reflect.getMetadata(RouteKey, target);
}
const methodKey = 'httpMethod';
// function setHttpMethodMeta(verb, target, key, desc) {
//     return Reflect.defineMetadata(methodKey, verb, target, key);
// }
export function getHttpMethod(target, propKey) {
    // console.log('GETGET', target, propKey);
    // return Reflect.getMetadata(methodKey, target, propKey);
    const metadata = target[Symbol.metadata];
    return metadata[propKey][methodKey];
}
// Http Methods
// export function Get(route: string): any {
//     return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
//         Reflect.defineMetadata(methodKey, 'get', target, propertyKey);
//         setRoute(route, target, propertyKey);
//     }
// }
export function Get(route) {
    return function (_target, context) {
        // console.log(_target, context);
        if (context && context.metadata) {
            context.metadata[context.name] = context.metadata[context.name] || {};
            context.metadata[context.name][methodKey] = 'get';
            setRoute(route, context);
        }
    };
}
export function Post(route) {
    return function (target, context) {
        if (context && context.metadata) {
            context.metadata[context.name] = context.metadata[context.name] || {};
            context.metadata[context.name][methodKey] = 'post';
            setRoute(route, context);
        }
    };
}
export function Put(route) {
    return function (_target, context) {
        if (context && context.metadata) {
            context.metadata[context.name] = context.metadata[context.name] || {};
            context.metadata[context.name][methodKey] = 'put';
            setRoute(route, context);
        }
    };
}
export function Delete(route) {
    return function (_target, context) {
        if (context && context.metadata) {
            context.metadata[context.name] = context.metadata[context.name] || {};
            context.metadata[context.name][methodKey] = 'delete';
            setRoute(route, context);
        }
    };
}
// export function Post(route?): any {
//     return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
//         Reflect.defineMetadata(methodKey, 'post', target, propertyKey);
//         setRoute(route, target, propertyKey);
//     }
// }
// export function Put(route?): any {
//     return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
//         Reflect.defineMetadata(methodKey, 'put', target, propertyKey);
//         setRoute(route, target, propertyKey);
//     }
// }
// export function Delete(route?): any {
//     return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
//         Reflect.defineMetadata(methodKey, 'delete', target, propertyKey);
//         setRoute(route, target, propertyKey);
//     }
// }
const middlewareKey = 'MIDDLEWARE';
function setMiddleware(middleware) {
    return function (target, propertyKey, descriptor) {
        Reflect.defineMetadata(middlewareKey, middleware, target, propertyKey);
    };
}
export function Middleware(middleware) {
    return setMiddleware(middleware);
}
export function getMiddleWare(target, propKey) {
    if (target && propKey) {
        return Reflect.getMetadata(middlewareKey, target, propKey);
    }
    return Reflect.getMetadata(middlewareKey, target);
}
let CRUDController = (() => {
    let _instanceExtraInitializers = [];
    let _index_decorators;
    let __new_decorators;
    let __get_decorators;
    let __post_decorators;
    return class CRUDController {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _index_decorators = [Get('/')];
            __new_decorators = [Get('/new')];
            __get_decorators = [Get('/:id')];
            __post_decorators = [Post(['/:id', '/new'])];
            __esDecorate(this, null, _index_decorators, { kind: "method", name: "index", static: false, private: false, access: { has: obj => "index" in obj, get: obj => obj.index }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, __new_decorators, { kind: "method", name: "_new", static: false, private: false, access: { has: obj => "_new" in obj, get: obj => obj._new }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, __get_decorators, { kind: "method", name: "_get", static: false, private: false, access: { has: obj => "_get" in obj, get: obj => obj._get }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, __post_decorators, { kind: "method", name: "_post", static: false, private: false, access: { has: obj => "_post" in obj, get: obj => obj._post }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        objName = (__runInitializers(this, _instanceExtraInitializers), "obj");
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
    };
})();
export { CRUDController };
let JSONController = (() => {
    let _instanceExtraInitializers = [];
    let _index_decorators;
    let __get_decorators;
    let __post_decorators;
    let __put_decorators;
    return class JSONController {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _index_decorators = [Get('/')];
            __get_decorators = [Get('/:id')];
            __post_decorators = [Post(['/:id', '/'])];
            __put_decorators = [Put(['/:id', '/'])];
            __esDecorate(this, null, _index_decorators, { kind: "method", name: "index", static: false, private: false, access: { has: obj => "index" in obj, get: obj => obj.index }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, __get_decorators, { kind: "method", name: "_get", static: false, private: false, access: { has: obj => "_get" in obj, get: obj => obj._get }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, __post_decorators, { kind: "method", name: "_post", static: false, private: false, access: { has: obj => "_post" in obj, get: obj => obj._post }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, __put_decorators, { kind: "method", name: "_put", static: false, private: false, access: { has: obj => "_put" in obj, get: obj => obj._put }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        objName = (__runInitializers(this, _instanceExtraInitializers), "obj");
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
    };
})();
export { JSONController };
/**
 * Like JSON Controller but response is just data not {objname:data}
 */
let JSONNotNamedController = (() => {
    let _instanceExtraInitializers = [];
    let _index_decorators;
    let __get_decorators;
    let __post_decorators;
    let __put_decorators;
    return class JSONNotNamedController {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _index_decorators = [Get('/')];
            __get_decorators = [Get('/:id')];
            __post_decorators = [Post(['/:id', '/'])];
            __put_decorators = [Put(['/:id', '/'])];
            __esDecorate(this, null, _index_decorators, { kind: "method", name: "index", static: false, private: false, access: { has: obj => "index" in obj, get: obj => obj.index }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, __get_decorators, { kind: "method", name: "_get", static: false, private: false, access: { has: obj => "_get" in obj, get: obj => obj._get }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, __post_decorators, { kind: "method", name: "_post", static: false, private: false, access: { has: obj => "_post" in obj, get: obj => obj._post }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, __put_decorators, { kind: "method", name: "_put", static: false, private: false, access: { has: obj => "_put" in obj, get: obj => obj._put }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        //string or array of names to populate on getById
        populate = __runInitializers(this, _instanceExtraInitializers);
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
    };
})();
export { JSONNotNamedController };
let PaginatedAPIController = (() => {
    let _classSuper = JSONNotNamedController;
    let _instanceExtraInitializers = [];
    let _paginate_decorators;
    let _paginateFilter_decorators;
    let _deleteThis_decorators;
    let _deleteThisOne_decorators;
    return class PaginatedAPIController extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _paginate_decorators = [Get('/paginate')];
            _paginateFilter_decorators = [Post('paginate/filter')];
            _deleteThis_decorators = [Post('delete/')];
            _deleteThisOne_decorators = [Post('delete/:id')];
            __esDecorate(this, null, _paginate_decorators, { kind: "method", name: "paginate", static: false, private: false, access: { has: obj => "paginate" in obj, get: obj => obj.paginate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _paginateFilter_decorators, { kind: "method", name: "paginateFilter", static: false, private: false, access: { has: obj => "paginateFilter" in obj, get: obj => obj.paginateFilter }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _deleteThis_decorators, { kind: "method", name: "deleteThis", static: false, private: false, access: { has: obj => "deleteThis" in obj, get: obj => obj.deleteThis }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _deleteThisOne_decorators, { kind: "method", name: "deleteThisOne", static: false, private: false, access: { has: obj => "deleteThisOne" in obj, get: obj => obj.deleteThisOne }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
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
        constructor() {
            super(...arguments);
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
})();
export { PaginatedAPIController };
//# sourceMappingURL=controller.js.map