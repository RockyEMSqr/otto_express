import { join } from 'node:path'
import { getAutoMount, getRoute, getHttpMethod, getMiddleWare, getController } from './controller.js';
import { requireDir } from './utils.js';
export function router(app, conf) {
	let cwd = process.cwd();
	let defaults = {
		controllers: join(cwd, '/controllers'),
		middleware: [],
		area: null
	}
	conf = { ...defaults, ...conf };
	let dev = false;
	if (dev) {
		mountDir(app, conf.controllers, conf);
		return (req, res, next) => {
			mountDir(app, join(cwd, conf.controllers), conf);

			next();
		}
	} else {
		mountDir(app, join(cwd, conf.controllers), conf);
		return (req, res, next) => {
			next();
		}
	}

}
async function mountDir(app, dir, opts: { middleware: any[], area?: string }) {
	//TODO(rc): check if using ts-node
	var mods = await requireDir(dir);
	for (let key in mods) {

		//module/file
		let mod = mods[key];
		for (let mkey in mod) {

			let mem = mod[mkey];
			//check if class
			//console.log(key, mkey, typeof mem, mem && mem.constructor);
			//TODO(rocky): handle mem null better?
			if (mem && mem.constructor) {
				let mount = getAutoMount(mem);
				let controller = getController(mem);
				if (mount || controller) {
					setupController(app, mem, opts.area, opts.middleware);
				}
			}
		}
	}
}
export async function SetupArea(app, dir, area?, ...preHanders) {
	var mods = await requireDir(dir);
	for (let key in mods) {

		//module/file
		let mod = mods[key];
		for (let mkey in mod) {

			let mem = mod[mkey];
			//check if class
			//console.log(key, mkey, typeof mem, mem && mem.constructor);
			//TODO(rocky): handle mem null better?
			if (mem && mem.constructor) {
				let mount = getAutoMount(mem);
				if (mount) {
					setupController(app, mem, area, preHanders);
				}
			}
		}
	}
}
function trimLeadingSlash(r: string) {
	if (r[0] == '/') {
		r = r.substring(1);//r.substr(1, r.length);
	}
	return r;
}
export function setupController(app, C, area?, ...preHandlers) {
	preHandlers = [].concat(...preHandlers);
	preHandlers = preHandlers.filter(x => x != undefined);
	var ctrl = new C();

	// console.log(ctrl, C, C.name, ctrl.name);
	let proto = Object.getPrototypeOf(ctrl);
	let names = []; //Object.getOwnPropertyNames(proto);

	while (proto && proto.constructor.name != "Object") {
		names = names.concat(Object.getOwnPropertyNames(proto));
		proto = Object.getPrototypeOf(proto);
	}
	for (let name of names) {

		let method = ctrl[name];
		//skip ctor
		if (method === C) {
			continue;
		}
		//TODO: check if method is private?

		let actionRoute = getRoute(C, name);
		let controllerRoute = getRoute(C);

		let httpMethod = getHttpMethod(C, name); //|| 'get'; //default to a get
		var route: string | string[] = '/';
		if (area) {
			route += `${area}/`;
		}
		if (controllerRoute && controllerRoute != '/') {
			if (controllerRoute[0] == '/') {
				controllerRoute = controllerRoute.slice(1, controllerRoute.length);
			}
			route += controllerRoute + '/'
		}
		if (actionRoute) {
			if (Array.isArray(actionRoute)) {
				let routes = actionRoute.map(x => route + trimLeadingSlash(x));

				route = routes;
				console.log(route);
			} else {
				if (actionRoute == '/') {

				} else {

					route += trimLeadingSlash(actionRoute);
				}
			}
		} else {
			route += name
		}
		let allMiddleware = [].concat(preHandlers);
		//todo(rc): method middleware comes first?
		let methodMiddleware = getMiddleWare(ctrl, name);
		if (methodMiddleware) {
			if (Array.isArray(methodMiddleware)) {
				allMiddleware = allMiddleware.concat(...methodMiddleware);
			} else {
				allMiddleware = allMiddleware.concat(methodMiddleware);
			}

		}

		let controllerMiddleware = getMiddleWare(C);
		if (controllerMiddleware) {
			if (Array.isArray(controllerMiddleware)) {
				allMiddleware = allMiddleware.concat(...controllerMiddleware);
			} else {
				allMiddleware = allMiddleware.concat(controllerMiddleware);
			}

		}

		if (httpMethod) {
			app[httpMethod](route, allMiddleware, async function (req, res, next) {
				if (process.env.F_PROFILE) {
					console.time(req.path);
				}
				try {
					await method.call(ctrl, req, res, next);
				}
				catch (err) {
					next(err);
				}
				if (process.env.F_PROFILE) {
					console.timeEnd(req.path);
				}
			});
		}
		if (process.env.DEBUG) {
			console.log(`method: ${httpMethod} \t ctrl: ${controllerRoute} \t action: ${actionRoute || name}\n route: ${route} --middleware: ${allMiddleware.map(x => x.name).join(', ')}`)
		}
	}
}