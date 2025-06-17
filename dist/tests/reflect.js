"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const controller_1 = require("../controller");
const router_1 = require("../router");
let key = 'key';
let HELLO = class HELLO {
    async fooboo() {
    }
};
__decorate([
    (0, controller_1.Get)('/fooboo'),
    Reflect.metadata(key, '/fooboo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HELLO.prototype, "fooboo", null);
HELLO = __decorate([
    (0, controller_1.Controller)('/asdfasdf'),
    Reflect.metadata(key, '/asdfasdf')
], HELLO);
Reflect.defineMetadata(key, 'hello', HELLO, 'test');
let str = Reflect.getMetadata(key, HELLO, 'test');
console.log(str);
let h = new HELLO();
console.log((0, controller_1.getController)(h));
console.log((0, controller_1.getController)(HELLO));
console.log((0, controller_1.getRoute)(h));
console.log((0, controller_1.getRoute)(HELLO));
console.log((0, controller_1.getRoute)(HELLO.prototype.fooboo));
console.log((0, controller_1.getRoute)(h.fooboo));
console.log((0, controller_1.getHttpMethod)(h, 'fooboo'));
console.log(Reflect.getMetadata(key, h));
console.log(Reflect.getMetadata(key, HELLO));
console.log(Reflect.getMetadata(key, h, 'fooboo'));
console.log(Reflect.getMetadata(key, HELLO, 'fooboo'));
let Ctr = class Ctr {
    async action() {
    }
};
__decorate([
    (0, controller_1.Get)('/action'),
    (0, controller_1.Post)('/action'),
    (0, controller_1.Delete)('/action'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Ctr.prototype, "action", null);
Ctr = __decorate([
    (0, controller_1.Controller)('/test')
], Ctr);
let ctr = new Ctr();
console.log((0, controller_1.getRoute)(Ctr));
console.log((0, controller_1.getRoute)(ctr, 'action'));
console.log((0, controller_1.getHttpMethod)(ctr, 'action'));
(0, router_1.setupController)({
    get: () => {
    }
}, Ctr, 'booboo');
//# sourceMappingURL=reflect.js.map