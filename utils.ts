import fs = require('fs');
import path = require('path');
import { pathToFileURL } from 'url';

export type ModuleLoader = (specifier: string) => Promise<any>;

const nativeImport: ModuleLoader = new Function(
    'specifier',
    'return import(specifier);'
) as ModuleLoader;

export function isJsFile(file) {
    return path.extname(file).toLowerCase() === ".js";
}
export function isJsOrTSFile(file) {
    return isJsFile(file) || isTSFile(file);
}
export function isTSFile(file) {
    return path.extname(file).toLowerCase() === ".ts";
}
export function isModuleFile(file) {
    return ['.js', '.mjs', '.cjs', '.ts'].includes(path.extname(file).toLowerCase());
}
export function isNotIndexFile(file) {
    return path.basename(file).toLowerCase() !== "index.js";
}
export function lsjs(dir) {
    var files = fs.readdirSync(dir).filter(isJsFile).filter(isNotIndexFile);
    return files
}
export function lsjs_r(dir) {
    return walk(dir).filter(isJsFile).filter(isNotIndexFile);
}
export function ls_r(dir) {
    return walk(dir);
}
export function lsJsOrTs_r(dir) {
    return walk(dir).filter(isJsOrTSFile);
}
export function lsModules_r(dir) {
    return walk(dir).filter(isModuleFile);
}
export function lsts_r(dir) {
    return walk(dir).filter(isTSFile).filter(isNotIndexFile);
}
export function rrequireDirTS(dir) {
    var ex = Object.create(null);
    var files = lsts_r(dir);
    for (let i = 0; i < files.length; i++) {
        let f = files[i];
        var thePath = require.resolve(f)
        delete require.cache[thePath]
        ex[f] = require(thePath);
    }
    return ex;
}

/**
 * Recursively loads JavaScript/TypeScript modules from a directory.
 *
 * Native import() can load ESM and CommonJS modules. The import is created
 * with Function so a CommonJS TypeScript build cannot rewrite it to require().
 *
 * A loader may be injected by test/build tools (for example Vitest/Vite using
 * import.meta.glob) when they need to transform modules before loading them.
 */
export async function rrequireDir(dir: string, loader: ModuleLoader = nativeImport) {
    var ex = Object.create(null);
    var files = lsModules_r(dir);

    for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const specifier = pathToFileURL(path.resolve(f)).href;
        ex[f] = await loader(specifier);
    }

    return ex;
}
export function requireDir(dir) {
    var ex = Object.create(null);
    var files = lsjs(dir);
    for (let i = 0; i < files.length; i++) {
        let f = files[i];
        var thePath = require.resolve(path.join(dir, f))
        delete require.cache[thePath]
        ex[f.split('.')[0]] = require(thePath);
    }
    return ex;
}
export function walk(dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    })
    return results;
}