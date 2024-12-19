import "reflect-metadata";

class HELLO { }

let key = 'key'
Reflect.defineMetadata(key, 'hello', HELLO, 'test');

let str = Reflect.getMetadata(key, HELLO, 'test');

console.log(str);
