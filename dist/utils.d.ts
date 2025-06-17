export declare function requireDir(dir: string): Promise<{
    [key: string]: HandlerModule;
}>;
interface HandlerModule {
    [key: string]: any;
    default?: any;
}
export declare function importModulesFromDirectory<T = HandlerModule>(directoryPath: string): Promise<{
    [key: string]: T;
}>;
export {};
