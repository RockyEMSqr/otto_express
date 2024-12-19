"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJsFile = isJsFile;
exports.isJsOrTSFile = isJsOrTSFile;
exports.isTSFile = isTSFile;
exports.isNotIndexFile = isNotIndexFile;
exports.lsjs = lsjs;
exports.lsjs_r = lsjs_r;
exports.ls_r = ls_r;
exports.lsJsOrTs_r = lsJsOrTs_r;
exports.lsts_r = lsts_r;
exports.rrequireDirTS = rrequireDirTS;
exports.rrequireDir = rrequireDir;
exports.requireDir = requireDir;
exports.walk = walk;
var fs = require("fs");
var path = require("path");
function isJsFile(file) {
    return path.extname(file).toLowerCase() === ".js";
}
function isJsOrTSFile(file) {
    return isJsFile(file) || isTSFile(file);
}
function isTSFile(file) {
    return path.extname(file).toLowerCase() === ".ts";
}
function isNotIndexFile(file) {
    return path.basename(file).toLowerCase() !== "index.js";
}
function lsjs(dir) {
    var files = fs
        .readdirSync(dir)
        .filter(isJsFile)
        .filter(isNotIndexFile);
    return files;
}
function lsjs_r(dir) {
    var files = walk(dir)
        .filter(isJsFile)
        .filter(isNotIndexFile);
    return files;
}
function ls_r(dir) {
    var files = walk(dir);
    return files;
}
function lsJsOrTs_r(dir) {
    return walk(dir)
        .filter(isJsOrTSFile);
}
function lsts_r(dir) {
    var files = walk(dir)
        .filter(isTSFile)
        .filter(isNotIndexFile);
    return files;
}
function rrequireDirTS(dir) {
    var ex = Object.create(null);
    var files = lsts_r(dir);
    for (var i = 0; i < files.length; i++) {
        var f = files[i];
        var thePath = require.resolve(f);
        delete require.cache[thePath];
        ex[f] = require(thePath);
    }
    return ex;
}
function rrequireDir(dir) {
    var ex = Object.create(null);
    var files = lsJsOrTs_r(dir);
    for (var i = 0; i < files.length; i++) {
        var f = files[i];
        var thePath = require.resolve(f);
        delete require.cache[thePath];
        ex[f] = require(thePath);
    }
    return ex;
}
function requireDir(dir) {
    var ex = Object.create(null);
    var files = lsjs(dir);
    for (var i = 0; i < files.length; i++) {
        var f = files[i];
        var thePath = require.resolve(path.join(dir, f));
        delete require.cache[thePath];
        ex[f.split('.')[0]] = require(thePath);
    }
    return ex;
}
function walk(dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        }
        else {
            results.push(file);
        }
    });
    return results;
}
//# sourceMappingURL=utils.js.map