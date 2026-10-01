import assert = require('assert');
import { Controller, Delete, Get } from '../controller';
import { router } from '../router';

async function run() {
    @Controller('/test')
    class TestController {
        @Get('/hello')
        hello(req, res) {
            res.send('hello');
        }
    }

    @Controller('/multi')
    class MultiMethodController {
        @Get('/resource')
        @Delete('/resource')
        resource(req, res) {
            res.send('resource');
        }
    }

    const registered: Array<{ method: string, route: any }> = [];
    const app: any = {
        get(route) {
            registered.push({ method: 'get', route });
        },
        delete(route) {
            registered.push({ method: 'delete', route });
        }
    };

    const middleware = await router(app, {
        controllers: '/this/path/does/not/need/to/exist',
        modules: {
            '/virtual/test-controller.ts': { TestController, MultiMethodController }
        }
    });

    assert.equal(typeof middleware, 'function');
    assert.equal(registered.length, 3);
    assert.equal(registered[0].method, 'get');
    assert.equal(registered[0].route, '/test/hello');
    assert.equal(registered[1].method, 'get');
    assert.equal(registered[1].route, '/multi/resource');
    assert.equal(registered[2].method, 'delete');
    assert.equal(registered[2].route, '/multi/resource');

    console.log('router preloaded module tests passed');
}

run().catch(err => {
    console.error(err);
    process.exitCode = 1;
});
