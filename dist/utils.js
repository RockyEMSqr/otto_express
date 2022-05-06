"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walk = exports.requireDir = exports.rrequireDir = exports.rrequireDirTS = exports.lsts_r = exports.lsJsOrTs_r = exports.ls_r = exports.lsjs_r = exports.lsjs = exports.isNotIndexFile = exports.isTSFile = exports.isJsOrTSFile = exports.isJsFile = void 0;
var fs = require("fs");
var path = require("path");
function isJsFile(file) {
    return path.extname(file).toLowerCase() === ".js";
}
exports.isJsFile = isJsFile;
function isJsOrTSFile(file) {
    return isJsFile(file) || isTSFile(file);
}
exports.isJsOrTSFile = isJsOrTSFile;
function isTSFile(file) {
    return path.extname(file).toLowerCase() === ".ts";
}
exports.isTSFile = isTSFile;
function isNotIndexFile(file) {
    return path.basename(file).toLowerCase() !== "index.js";
}
exports.isNotIndexFile = isNotIndexFile;
function lsjs(dir) {
    var files = fs
        .readdirSync(dir)
        .filter(isJsFile)
        .filter(isNotIndexFile);
    return files;
}
exports.lsjs = lsjs;
function lsjs_r(dir) {
    var files = walk(dir)
        .filter(isJsFile)
        .filter(isNotIndexFile);
    return files;
}
exports.lsjs_r = lsjs_r;
function ls_r(dir) {
    var files = walk(dir);
    return files;
}
exports.ls_r = ls_r;
function lsJsOrTs_r(dir) {
    return walk(dir)
        .filter(isJsOrTSFile);
}
exports.lsJsOrTs_r = lsJsOrTs_r;
function lsts_r(dir) {
    var files = walk(dir)
        .filter(isTSFile)
        .filter(isNotIndexFile);
    return files;
}
exports.lsts_r = lsts_r;
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
exports.rrequireDirTS = rrequireDirTS;
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
exports.rrequireDir = rrequireDir;
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
exports.requireDir = requireDir;
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
exports.walk = walk;
//# sourceMappingURL=utils.js.map