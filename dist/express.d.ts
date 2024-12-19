import express = require("express");
import { OptionsJson, OptionsUrlencoded } from 'body-parser';
export type facile_express = express.Express & {
    start(): void;
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
declare function createApp(pathToConfig?: string): facile_express;
declare function createApp(config?: facile_express_config): facile_express;
export declare var oexpress: typeof createApp;
export {};
//# sourceMappingURL=express.d.ts.map