
import { readdirSync, statSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
export function isJsFile(file) {
    return extname(file).toLowerCase() === ".js";
}
export function isJsOrTSFile(file) {
    return isJsFile(file) || isTSFile(file);
}
export function isTSFile(file) {
    return extname(file).toLowerCase() === ".ts";
}

export function isNotIndexFile(file) {
    return basename(file).toLowerCase() !== "index.js";
}
export function lsjs(dir) {
    var files = readdirSync(dir)
        .filter(isJsFile)
        .filter(isNotIndexFile);
    return files
}
export function lsjs_r(dir) {
    var files = walk(dir)
        .filter(isJsFile)
        .filter(isNotIndexFile);
    return files
}
export function ls_r(dir) {
    var files = walk(dir);
    return files
}
export function lsJsOrTs_r(dir) {
    return walk(dir)
        .filter(isJsOrTSFile);
}
export function lsts_r(dir) {
    var files = walk(dir)
        .filter(isTSFile)
        .filter(isNotIndexFile);
    return files
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
export function rrequireDir(dir) {
    var ex = Object.create(null);
    var files = lsJsOrTs_r(dir);
    for (let i = 0; i < files.length; i++) {
        let f = files[i];
        var thePath = require.resolve(f)
        // debugger;
        // delete require.cache[thePath]
        ex[f] = require(thePath);
    }
    return ex;
}
export function requireDir(dir) {
    var ex = Object.create(null);
    var files = lsjs(dir);
    for (let i = 0; i < files.length; i++) {
        let f = files[i];
        var thePath = require.resolve(join(dir, f))
        delete require.cache[thePath]
        ex[f.split('.')[0]] = require(thePath);
    }
    return ex;
}
export function walk(dir) {
    var results = [];
    var list = readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        var stat = statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    })
    return results;
}