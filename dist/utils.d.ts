export type ModuleLoader = (specifier: string) => Promise<any>;
export declare function isJsFile(file: any): boolean;
export declare function isJsOrTSFile(file: any): boolean;
export declare function isTSFile(file: any): boolean;
export declare function isModuleFile(file: any): boolean;
export declare function isNotIndexFile(file: any): boolean;
export declare function lsjs(dir: any): string[];
export declare function lsjs_r(dir: any): any[];
export declare function ls_r(dir: any): any[];
export declare function lsJsOrTs_r(dir: any): any[];
export declare function lsModules_r(dir: any): any[];
export declare function lsts_r(dir: any): any[];
export declare function rrequireDirTS(dir: any): any;
/**
 * Recursively loads JavaScript/TypeScript modules from a directory.
 *
 * Native import() can load ESM and CommonJS modules. The import is created
 * with Function so a CommonJS TypeScript build cannot rewrite it to require().
 *
 * A loader may be injected by test/build tools (for example Vitest/Vite using
 * import.meta.glob) when they need to transform modules before loading them.
 */
export declare function rrequireDir(dir: string, loader?: ModuleLoader): Promise<any>;
export declare function requireDir(dir: any): any;
export declare function walk(dir: any): any[];
//# sourceMappingURL=utils.d.ts.map