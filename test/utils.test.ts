import assert = require('assert');
import fs = require('fs');
import os = require('os');
import path = require('path');
import { pathToFileURL } from 'url';
import { isModuleFile, lsModules_r, rrequireDir } from '../utils';

async function run() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'otto-express-rrequireDir-'));

    try {
        fs.mkdirSync(path.join(dir, 'nested'));
        fs.writeFileSync(path.join(dir, 'esm.mjs'), 'export const format = "esm";');
        fs.writeFileSync(path.join(dir, 'common.cjs'), 'module.exports = { format: "commonjs" };');
        fs.writeFileSync(path.join(dir, 'nested', 'nested.mjs'), 'export const nested = true;');
        fs.writeFileSync(path.join(dir, 'ignored.txt'), 'ignored');

        assert.equal(isModuleFile('controller.js'), true);
        assert.equal(isModuleFile('controller.mjs'), true);
        assert.equal(isModuleFile('controller.cjs'), true);
        assert.equal(isModuleFile('controller.ts'), true);
        assert.equal(isModuleFile('controller.txt'), false);

        const files = lsModules_r(dir);
        assert.equal(files.length, 3);
        assert.equal(files.some(file => file.endsWith('ignored.txt')), false);

        const modules = await rrequireDir(dir);
        assert.equal(modules[path.join(dir, 'esm.mjs')].format, 'esm');
        assert.equal(modules[path.join(dir, 'common.cjs')].default.format, 'commonjs');
        assert.equal(modules[path.join(dir, 'nested', 'nested.mjs')].nested, true);

        const loaded: string[] = [];
        const injected = await rrequireDir(dir, async specifier => {
            loaded.push(specifier);
            return { specifier };
        });

        assert.equal(loaded.length, 3);
        assert.equal(loaded.every(specifier => specifier.startsWith('file:')), true);
        assert.equal(
            injected[path.join(dir, 'esm.mjs')].specifier,
            pathToFileURL(path.resolve(dir, 'esm.mjs')).href
        );

        console.log('rrequireDir tests passed');
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
}

run().catch(err => {
    console.error(err);
    process.exitCode = 1;
});
