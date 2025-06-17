<<<<<<< HEAD
export declare function router(app: any, conf: any): (req: any, res: any, next: any) => void;
=======
export declare function router(app: any, conf: any): Promise<(req: any, res: any, next: any) => void>;
>>>>>>> 73c92bc (we good?)
export declare function SetupArea(app: any, dir: any, area?: any, ...preHanders: any[]): Promise<void>;
export declare function setupController(app: any, C: any, area?: any, ...preHandlers: any[]): void;
