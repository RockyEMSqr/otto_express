"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var HELLO = /** @class */ (function () {
    function HELLO() {
    }
    return HELLO;
}());
var key = 'key';
Reflect.defineMetadata(key, 'hello', HELLO, 'test');
var str = Reflect.getMetadata(key, HELLO, 'test');
console.log(str);
//# sourceMappingURL=reflect.js.map