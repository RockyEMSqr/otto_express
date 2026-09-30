import assert = require('assert');
import { Controller, Get } from '../controller';
import { router } from '../router';

async function run() {
    @Controller('/test')
    class TestController {
        @Get('/hello')
        hello(req, res) {
            res.send('hello');
        }
    }

    const registered: Array<{ method: string, route: any }> = [];
    const app: any = {
        get(route) {
            registered.push({ method: 'get', route });
        }
    };

    const middleware = await router(app, {
        controllers: '/this/path/does/not/need/to/exist',
        modules: {
            '/virtual/test-controller.ts': { TestController }
        }
    });

    assert.equal(typeof middleware, 'function');
    assert.equal(registered.length, 1);
    assert.equal(registered[0].method, 'get');
    assert.equal(registered[0].route, '/test/hello');

    console.log('router preloaded module tests passed');
}

run().catch(err => {
    console.error(err);
    process.exitCode = 1;
});
