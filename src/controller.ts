import "reflect-metadata";
// polyfill.ts

// Check if Symbol.metadata is already defined.
// If not, define it using Symbol.for to ensure global uniqueness.
if (typeof Symbol.metadata === 'undefined') {
    (Symbol as any).metadata = Symbol.for('Symbol.metadata');
}

// Ensure the SymbolConstructor has the metadata property for TypeScript's type checking.
declare global {
    interface SymbolConstructor {
        readonly metadata: unique symbol;
    }
}
const RouteKey = 'Route';
const ControllerKey = 'Contoller';
// function setRoute(route: string, target: Object, propertyKey?: string) {
//     if (propertyKey) {
//         Reflect.defineMetadata(RouteKey, route, target, propertyKey);
//     } else {
//         Reflect.defineMetadata(RouteKey, route, target);
//     }
function setRoute(route: string, context: ClassMethodDecoratorContext) {
    let metadata = context[Symbol.metadata] || context.metadata //[Symbol.metadata];
    metadata = metadata || {};
    if (context.kind == 'method') {
        metadata[context.name] = metadata[context.name] || {};
        metadata[context.name][RouteKey] = route;
    } else {
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
export function Controller(route: string): ClassDecorator {
    return (target: Function) => {
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
export function getRoute(target, propKey?) {
    const metadata = target[Symbol.metadata];
    if (propKey) {
        return metadata[propKey][RouteKey]
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
export function getHttpMethod(target: any, propKey: string) {
    // console.log('GETGET', target, propKey);
    // return Reflect.getMetadata(methodKey, target, propKey);
    const metadata = target[Symbol.metadata];
    return metadata[propKey][methodKey]
}

// Http Methods
// export function Get(route: string): any {
//     return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
//         Reflect.defineMetadata(methodKey, 'get', target, propertyKey);
//         setRoute(route, target, propertyKey);
//     }

// }
export function Get(route: string): any {
    return function (_target: any, context: ClassMethodDecoratorContext) {
        // console.log(_target, context);
        if (context && context.metadata) {
            context.metadata[context.name] = context.metadata[context.name] || {}
            context.metadata[context.name][methodKey] = 'get';
            setRoute(route, context);
        }
    }


}
export function Post(route?): any {
    return function (target: any, context: ClassMethodDecoratorContext) {
        if (context && context.metadata) {
            context.metadata[context.name] = context.metadata[context.name] || {}
            context.metadata[context.name][methodKey] = 'post';
            setRoute(route, context);
        }
    }

}
export function Put(route?): any {
    return function (_target: any, context: ClassMethodDecoratorContext) {
        if (context && context.metadata) {
            context.metadata[context.name] = context.metadata[context.name] || {}
            context.metadata[context.name][methodKey] = 'put';
            setRoute(route, context);
        }
    }

}
export function Delete(route?): any {
    return function (_target: any, context: ClassMethodDecoratorContext) {
        if (context && context.metadata) {
            context.metadata[context.name] = context.metadata[context.name] || {}
            context.metadata[context.name][methodKey] = 'delete';
            setRoute(route, context);
        }
    }

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
    return function (target, propertyKey?: string, descriptor?: PropertyDescriptor) {
        Reflect.defineMetadata(middlewareKey, middleware, target, propertyKey);
    }
}
export function Middleware(middleware) {
    return setMiddleware(middleware);
}
export function getMiddleWare(target, propKey?) {
    if (target && propKey) {
        return Reflect.getMetadata(middlewareKey, target, propKey);
    }
    return Reflect.getMetadata(middlewareKey, target);
}

export abstract class CRUDController {
    protected abstract getDS(req);
    abstract viewFolder: string;
    objName = "obj";
    pluralObjName = "objs";
    @Get('/')
    async index(req, res) {
        let objs = await this.getDS(req).list();
        res.render(`${this.viewFolder}/index`, { [this.pluralObjName]: objs });
    }
    @Get('/new')
    async _new(req, res) {
        res.render(`${this.viewFolder}/form`, {});
    }
    @Get('/:id')
    async _get(req, res) {
        let obj = await this.getDS(req).findById(req.params.id);
        res.render(`${this.viewFolder}/form`, { [this.objName]: obj });
    }
    @Post(['/:id', '/new'])
    async _post(req, res) {
        await this.getDS(req).save(req.body[this.objName]);
        req.session.messages.push('Saved');
        res.redirect('./')
    }
}
export abstract class JSONController {
    protected abstract getDS(req): any//ADataService<any>;
    objName = "obj";
    pluralObjName = "objs";
    //string or array of names to populate on getById
    populate
    @Get('/')
    async index(req, res) {
        let q = this.getDS(req)._list(this.populate);
        let objs = await q.exec();
        res.json({ [this.pluralObjName]: objs });
    }
    @Get('/:id')
    async _get(req, res) {
        let q = this.getDS(req)._findById(req.params.id, this.populate);
        let obj = await q.exec();
        res.json({ [this.objName]: obj });
    }
    @Post(['/:id', '/'])
    async _post(req, res) {
        let obj = await this.getDS(req).save(req.body[this.objName]);
        if (this.populate) {
            obj.populate(this.populate);
            await obj.execPopulate();
        }
        res.json({ [this.objName]: obj });
    }
    @Put(['/:id', '/'])
    async _put(req, res) {
        let obj = await this.getDS(req).save(req.body[this.objName]);
        if (this.populate) {
            obj.populate(this.populate);
            await obj.execPopulate();
        }
        res.json({ [this.objName]: obj });
    }
}
/**
 * Like JSON Controller but response is just data not {objname:data}
 */
export abstract class JSONNotNamedController {
    protected abstract getDS(req): any//ADataService<any>;
    //string or array of names to populate on getById
    populate
    @Get('/')
    async index(req, res) {
        let q = this.getDS(req)._list(this.populate);
        let objs = await q.exec();
        res.json(objs);
    }
    @Get('/:id')
    async _get(req, res) {
        let q = this.getDS(req)._findById(req.params.id, this.populate);
        let obj = await q.exec();
        res.json(obj);
    }
    @Post(['/:id', '/'])
    async _post(req, res) {
        let obj = await this.getDS(req).save(req.body);
        if (this.populate) {
            obj.populate(this.populate);
            await obj.execPopulate();
        }
        res.json(obj);
    }
    @Put(['/:id', '/'])
    async _put(req, res) {
        let obj = await this.getDS(req).save(req.body);
        if (this.populate) {
            obj.populate(this.populate);
            await obj.execPopulate();
        }
        res.json(obj);
    }
}
export abstract class PaginatedAPIController extends JSONNotNamedController {
    abstract getDS(req: any)//PaginatedDS<any, DataService>
    abstract getFilterWhere<DS = any>(ds: DS, body): Promise<any>
    @Get('/paginate')
    async paginate(req, res) {
        res.json(await this.getDS(req).paginate(this.populate, Number(req.query.page), {}, Number(req.query.pageSize)))
    }
    @Post('paginate/filter')
    async paginateFilter(req, res) {
        let where = await this.getFilterWhere(req.ds, req.body);
        console.log('FILTER WHERE', JSON.stringify(where));
        res.json(await this.getDS(req).paginate(this.populate, Number(req.query.page), where, Number(req.query.pageSize), req.query.sortKey as any, Number(req.query.sortDir)))
    }
    @Post('delete/')
    async deleteThis(req, res) {
        await this.getDS(req).deleteThisOne(req.body._id);
        res.json({ ok: 1 });
    }
    @Post('delete/:id')
    async deleteThisOne(req, res) {
        await this.getDS(req).deleteThisOne(req.params.id);
        res.json({ ok: 1 });
    }
    // abstract generateCSVData<D>(data:D):any[][];
    // @Post('exportExcel')
    // async exportExcel(req:Request, res){
    //     let excelGenerator = new ExcelGenerator()
    //     // let csvData = this.generateCSVData()
    //     excelGenerator.download(res, 'file')
    // }
}