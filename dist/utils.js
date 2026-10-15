"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJsFile = isJsFile;
exports.isJsOrTSFile = isJsOrTSFile;
exports.isTSFile = isTSFile;
exports.isModuleFile = isModuleFile;
exports.isNotIndexFile = isNotIndexFile;
exports.lsjs = lsjs;
exports.lsjs_r = lsjs_r;
exports.ls_r = ls_r;
exports.lsJsOrTs_r = lsJsOrTs_r;
exports.lsModules_r = lsModules_r;
exports.lsts_r = lsts_r;
exports.rrequireDirTS = rrequireDirTS;
exports.rrequireDir = rrequireDir;
exports.requireDir = requireDir;
exports.walk = walk;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const url_1 = require("url");
const nativeImport = new Function('specifier', 'return import(specifier);');
function isJsFile(file) {
    return path.extname(file).toLowerCase() === ".js";
}
function isJsOrTSFile(file) {
    return isJsFile(file) || isTSFile(file);
}
function isTSFile(file) {
    return path.extname(file).toLowerCase() === ".ts";
}
function isModuleFile(file) {
    return ['.js', '.mjs', '.cjs', '.ts'].includes(path.extname(file).toLowerCase());
}
function isNotIndexFile(file) {
    return path.basename(file).toLowerCase() !== "index.js";
}
function lsjs(dir) {
    var files = fs.readdirSync(dir).filter(isJsFile).filter(isNotIndexFile);
    return files;
}
function lsjs_r(dir) {
    return walk(dir).filter(isJsFile).filter(isNotIndexFile);
}
function ls_r(dir) {
    return walk(dir);
}
function lsJsOrTs_r(dir) {
    return walk(dir).filter(isJsOrTSFile);
}
function lsModules_r(dir) {
    return walk(dir).filter(isModuleFile);
}
function lsts_r(dir) {
    return walk(dir).filter(isTSFile).filter(isNotIndexFile);
}
function rrequireDirTS(dir) {
    var ex = Object.create(null);
    var files = lsts_r(dir);
    for (let i = 0; i < files.length; i++) {
        let f = files[i];
        var thePath = require.resolve(f);
        delete require.cache[thePath];
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
async function rrequireDir(dir, loader = nativeImport) {
    var ex = Object.create(null);
    var files = lsModules_r(dir);
    for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const specifier = (0, url_1.pathToFileURL)(path.resolve(f)).href;
        ex[f] = await loader(specifier);
    }
    return ex;
}
function requireDir(dir) {
    var ex = Object.create(null);
    var files = lsjs(dir);
    for (let i = 0; i < files.length; i++) {
        let f = files[i];
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