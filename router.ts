import utils = require('./utils');
import path = require('path');
import { getAutoMount, getRoute, getHttpMethod, getMiddleWare, getController } from './controller';

export async function router(app, conf) {
	let cwd = process.cwd();
	let defaults = {
		controllers: path.join(cwd, '/controllers'),
		middleware: [],
		area: null
	}
	conf = { ...defaults, ...conf };
	let dev = false;
	if (dev) {
		await mountDir(app, conf.controllers, conf);
		return async (req, res, next) => {
			await mountDir(app, path.join(cwd, conf.controllers), conf);
			next();
		}
	} else {
		await mountDir(app, path.join(cwd, conf.controllers), conf);
		return (req, res, next) => {
			next();
		}
	}
}

async function mountDir(app, dir, opts: { middleware: any[], area?: string }) {
	var mods = await utils.rrequireDir(dir);
	for (let key in mods) {
		let mod = mods[key];
		for (let mkey in mod) {
			let mem = mod[mkey];
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
export function SetupArea(app, dir, area?, ...preHanders) {
	var mods = utils.requireDir(dir);
	for (let key in mods) {
		let mod = mods[key];
		for (let mkey in mod) {
			let mem = mod[mkey];
			if (mem && mem.constructor) {
				let mount = getAutoMount(mem);
				if (mount) {
					setupController(app, mem, area, preHanders);
				}
			}
		}
	}
}
function trimLeadingSlash(r) {
	if (r.substr(0, 1) == '/') {
		r = r.substr(1, r.length);
	}
	return r;
}
export function setupController(app, C, area?, ...preHandlers) {
	preHandlers = [].concat(...preHandlers);
	preHandlers = preHandlers.filter(x => x != undefined);
	var ctrl = new C();
	let proto = Object.getPrototypeOf(ctrl);
	let names = [];

	while (proto && proto.constructor.name != "Object") {
		names = names.concat(Object.getOwnPropertyNames(proto));
		proto = Object.getPrototypeOf(proto);
	}
	for (let name of names) {
		let method = ctrl[name];
		if (method === C) {
			continue;
		}

		let actionRoute = getRoute(ctrl, name);
		let controllerRoute = getRoute(C);
		let httpMethod = getHttpMethod(ctrl, name);
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
				if (actionRoute != '/') {
					route += trimLeadingSlash(actionRoute);
				}
			}
		} else {
			route += name
		}
		let allMiddleware = [].concat(preHandlers);
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