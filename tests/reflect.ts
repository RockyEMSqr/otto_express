import "reflect-metadata";
import { Controller, Delete, Get, getController, getHttpMethod, getRoute, Post } from "../controller";
import { setupController } from "../router";

let key = 'key'
@Controller('/asdfasdf')
@Reflect.metadata(key, '/asdfasdf')
class HELLO {
    @Get('/fooboo')
    @Reflect.metadata(key, '/fooboo')
    async fooboo(){

    }
 }

Reflect.defineMetadata(key, 'hello', HELLO, 'test');

let str = Reflect.getMetadata(key, HELLO, 'test');


console.log(str);
let h = new HELLO();
console.log(getController(h));
console.log(getController(HELLO));
console.log(getRoute(h));
console.log(getRoute(HELLO));
console.log(getRoute(HELLO.prototype.fooboo))
console.log(getRoute(h.fooboo))
console.log(getHttpMethod(h, 'fooboo'))

console.log(Reflect.getMetadata(key, h));
console.log(Reflect.getMetadata(key, HELLO));
console.log(Reflect.getMetadata(key, h, 'fooboo'));
console.log(Reflect.getMetadata(key, HELLO, 'fooboo'));

@Controller('/test')
class Ctr {
    @Get('/action')
    @Post('/action')
    @Delete('/action')
    async action(){

    }
}

let ctr = new Ctr();
console.log(getRoute(Ctr));
console.log(getRoute(ctr, 'action'))
console.log(getHttpMethod(ctr, 'action'))

setupController({
    get:()=>{

    }
}, Ctr, 'booboo');