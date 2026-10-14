import express = require("express");
import { OptionsJson, OptionsUrlencoded } from 'body-parser';
export declare type facile_express_app = express.Express & {
    start(): void;
    otto_config: facile_express_config;
};
interface facile_express_config {
    views?: string;
    viewEngine?: string;
    publicFolders?: string[];
    useSessionFileStore?: boolean;
    useThisSessionStore?: Function;
    sessionStoreOptions?: Object;
    useSQliteFileStore?: boolean;
    pwd?: string;
    cwd?: string;
    session?: {
        name?: string;
        secret?: string;
    };
    serveFavicon?: boolean;
    log?: boolean;
    port?: number;
    bodyParserJSONOptions?: OptionsJson;
    bodyParserUrlEncodedOptions?: OptionsUrlencoded;
}
declare function createApp(pathToConfig?: string): facile_express_app;
declare function createApp(config?: facile_express_config): facile_express_app;
export declare const oexpress: typeof createApp;
export {};
//# sourceMappingURL=express.d.ts.map