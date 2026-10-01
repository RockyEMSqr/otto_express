"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var fs = require("fs");
var path = require("path");
var url_1 = require("url");
var nativeImport = new Function('specifier', 'return import(specifier);');
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
    for (var i = 0; i < files.length; i++) {
        var f = files[i];
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
function rrequireDir(dir_1) {
    return __awaiter(this, arguments, void 0, function (dir, loader) {
        var ex, files, i, f, specifier, _a, _b;
        if (loader === void 0) { loader = nativeImport; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    ex = Object.create(null);
                    files = lsModules_r(dir);
                    i = 0;
                    _c.label = 1;
                case 1:
                    if (!(i < files.length)) return [3 /*break*/, 4];
                    f = files[i];
                    specifier = (0, url_1.pathToFileURL)(path.resolve(f)).href;
                    _a = ex;
                    _b = f;
                    return [4 /*yield*/, loader(specifier)];
                case 2:
                    _a[_b] = _c.sent();
                    _c.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, ex];
            }
        });
    });
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