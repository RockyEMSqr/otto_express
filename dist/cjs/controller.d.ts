import "reflect-metadata";
export declare function Controller(route?: any): (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => void;
export declare function getController(target: any): any;
export declare function AutoMount(): {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
};
export declare function getAutoMount(target: any): any;
export declare function Route(route: any): {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
};
export declare function getRoute(target: any, propKey?: any): any;
export declare function getHttpMethod(target: any, propKey: any): any;
export declare function Get(route?: any): any;
export declare function Post(route?: any): any;
export declare function Put(route?: any): any;
export declare function Delete(route?: any): any;
export declare function Middleware(middleware: any): (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => void;
export declare function getMiddleWare(target: any, propKey?: any): any;
export declare abstract class CRUDController {
    protected abstract getDS(req: any): any;
    abstract viewFolder: string;
    objName: string;
    pluralObjName: string;
    index(req: any, res: any): Promise<void>;
    _new(req: any, res: any): Promise<void>;
    _get(req: any, res: any): Promise<void>;
    _post(req: any, res: any): Promise<void>;
}
export declare abstract class JSONController {
    protected abstract getDS(req: any): any;
    objName: string;
    pluralObjName: string;
    populate: any;
    index(req: any, res: any): Promise<void>;
    _get(req: any, res: any): Promise<void>;
    _post(req: any, res: any): Promise<void>;
    _put(req: any, res: any): Promise<void>;
}
/**
 * Like JSON Controller but response is just data not {objname:data}
 */
export declare abstract class JSONNotNamedController {
    protected abstract getDS(req: any): any;
    populate: any;
    index(req: any, res: any): Promise<void>;
    _get(req: any, res: any): Promise<void>;
    _post(req: any, res: any): Promise<void>;
    _put(req: any, res: any): Promise<void>;
}
export declare abstract class PaginatedAPIController extends JSONNotNamedController {
    abstract getDS(req: any): any;
    abstract getFilterWhere<DS = any>(ds: DS, body: any): Promise<any>;
    paginate(req: any, res: any): Promise<void>;
    paginateFilter(req: any, res: any): Promise<void>;
    deleteThis(req: any, res: any): Promise<void>;
    deleteThisOne(req: any, res: any): Promise<void>;
}
//# sourceMappingURL=controller.d.ts.map