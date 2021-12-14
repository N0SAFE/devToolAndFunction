import { importScript } from "../tool/function.js"
// util
class ScriptLoader {
    loaded = {}
    baseLocation = ""
    event = { load: [], call: [] }

    constructor(baseLocation) {
        this.load("./loader/scriptLoader.js", undefined, undefined, undefined, { inner: true });
        this.baseLocation = baseLocation.length == 0 || (baseLocation.substring(baseLocation.length - 1) == "/" || baseLocation.substring(baseLocation.length - 1) == "\\") ? baseLocation : baseLocation + "/"
    }

    // callback is : callback(object:Object<module:Object, ini func:Object, sort:string>)
    addListener(event, callback) {
        if (event == "load") {
            this.event.load.push(callback);
        } else if (event == "call") {
            this.event.call.push(callback);
        }
    }

    getLoaded() {
        return this.loaded
    }
    getLoadedBySort(sort = undefined) {
        return Array.from(Object.entries(this.loaded).filter(function([path, object]) {
            if (typeof object.sort == "string" && object.sort.includes(sort)) {
                return true
            }
        }).map(function([path, object]) {
            let obj = {...object }
            obj.path = path
            return obj
        }))
    }

    setBaseLocation(baseLocation) {
        this.baseLocation = baseLocation.length == 0 || (baseLocation.substring(baseLocation.length - 1) == "/" || baseLocation.substring(baseLocation.length - 1) == "\\") ? baseLocation : baseLocation + "/"
    }

    // template async load(href:string, iniFunc:?string, args:?Array<string>||string, sort:?string, params:?Object<inner:bool>)
    async load(href, iniFunc, args, sort, params) {

        if (href == undefined) {
            return false;
        }

        params = params || {};


        let absoluteHref = href;

        if (params.inner != true) {
            absoluteHref = absoluteHref
            href = this.baseLocation + href;
        } else {
            href = "built-in/" + href;
        }


        if (typeof sort !== 'string' && !(sort instanceof String)) {
            sort = undefined
        }

        if (!Array.isArray(args)) { args = args == null ? [] : [args] }
        if (this.isLoaded(absoluteHref)) {
            return this.loaded[absoluteHref].module;
        }
        let module = await importScript("../" + (params.inner == true ? absoluteHref : this.baseLocation + absoluteHref));
        if (module == undefined) { console.error(new URL(sessionStorage.baseURL + "built-in/" + (params.inner == true ? absoluteHref : this.baseLocation + absoluteHref)).href) }
        if (iniFunc) {
            try {
                await module[iniFunc](...[...args, scriptLoader]);
            } catch {
                try {
                    await module[iniFunc]
                    console.error(module, "in [" + new URL(sessionStorage.baseURL + "built-in/" + (params.inner == true ? absoluteHref : this.baseLocation + absoluteHref)).href + "] do not provide an export called {" + iniFunc + "} or the function called {" + iniFunc + "} throw an error")
                } catch {
                    console.error(module, "in [" + new URL(sessionStorage.baseURL + "built-in/" + (params.inner == true ? absoluteHref : this.baseLocation + absoluteHref)).href + "] not exist")
                }
            }
        }
        this.loaded[href] = { "name": href.split("/")[href.split("/").length - 1], "module": module, "ini func": iniFunc != null ? { "function": { "name": iniFunc, "callback": module[iniFunc] }, "args": args.length != 0 ? args : null } : null, "sort": sort };

        // event
        this.event.load.forEach(function(callback) { callback(this.loaded[href]) })

        return module;
    }

    // param async loads(...args?:Array<href:string, iniFunc:?string, args:?Array<string>||string, sort:?string, ...params:?any>)
    async loads(...args) {
        let modules = await Promise.all(await args.asyncForEach(async function(href, iniFunc, args, sort, params) {
            return this.load(href, iniFunc, args, sort, params)
        }.bind(this), false))
        return modules;
    }

    sortIn(module, sortName) {
        if (function(toTest, ...args) { for (let arg of args) { if (toTest === arg) return true } return false }(sortName, ...["sortIn", "load", "constructor", "call", "getSort", "isLoaded"]))
            return false;
        this[sortName].push(module);
    }

    getSort(sortName) {
        return this[sortName]
    }

    call(href, functionCalled = null) {
        if (!this.isLoaded(href)) {
            return false
        }
        if (functionCalled) {
            return this.loaded[href].module[functionCalled]
        }

        // event
        this.event.call.forEach(function(callback) { callback(this.loaded[href]) })
        return this.loaded[href].module;
    }

    isLoaded(href) {
        if (Object.keys(this.loaded).indexOf(href) == -1) {
            return false
        }
        return true
    }
}


let scriptLoader;

export function setScriptLoader(baseLocation = "") {
    scriptLoader = new ScriptLoader(baseLocation);
}
export default function getScriptLoader() {
    return scriptLoader;
}