import { oexpress, router } from '../index';
let app = oexpress({
    useSQliteFileStore: true,
    publicFolders: ['test/public', 'test/public2'],
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
app.use(router(app, {
    controllers: 'test/controllers'
}));







app.start();