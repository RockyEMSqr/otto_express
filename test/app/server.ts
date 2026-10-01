import { oexpress, router } from '../../index';
import path = require('path');
import { rrequireDirTS } from '../../utils';
process.chdir(__dirname);

(async () => {
    let app = oexpress({
        useSQliteFileStore: true,
        publicFolders: ['public', 'public2'],
        session: {
            secret: 'boogieboogieboogie'
        }
    });
    //allow all the cors light
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.use(await router(app, {
        modules: rrequireDirTS(path.join(__dirname, 'controllers'))
    }));
    app.use((req, res, next) => {
        res.status(404).send('Not Found');
    });
    app.use(errorHandler({
        logErrors: true,
        clientErrorHandler: true,
        errorPage: path.join(__dirname, 'error.html')
    }));





    app.start();

})();
function errorHandler(arg0: { logErrors: boolean; clientErrorHandler: boolean; errorPage: string; }): any {
    return function (err: any, req: any, res: any, next: any) {
        if (arg0.logErrors) {
            console.error(err && (err.stack || err));
        }

        if (res.headersSent) {
            return next(err);
        }

        const status = Number(err && (err.statusCode || err.status));
        res.statusCode = status >= 400 && status < 600 ? status : 500;

        if (!arg0.clientErrorHandler) {
            return res.end();
        }

        if (typeof res.sendFile === 'function') {
            return res.sendFile(arg0.errorPage, (sendError: any) => {
                if (sendError) {
                    next(sendError);
                }
            });
        }

        return res.end();
    };
}

