export type ControllerModules = Record<string, any>;
export interface RouterConfig {
    controllers?: string;
    middleware?: any[];
    area?: string;
    /**
     * Preloaded controller modules. Useful with Vite/Vitest import.meta.glob().
     * When supplied, filesystem module discovery is skipped.
     */
    modules?: ControllerModules;
}
export declare function router(app: any, conf?: RouterConfig): Promise<(req: any, res: any, next: any) => void>;
export declare function SetupArea(app: any, dir: any, area?: any, ...preHanders: any[]): void;
export declare function setupController(app: any, C: any, area?: any, ...preHandlers: any[]): void;
//# sourceMappingURL=router.d.ts.map