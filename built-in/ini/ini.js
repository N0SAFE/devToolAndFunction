import { setScriptLoader } from "../loader/ScriptLoader.js";
import getScriptLoader from "../loader/ScriptLoader.js"
import { getFromFile } from "../tool/function.js"
import ArrayFunction from "../tool/function/ArrayFunction.js"

// #region built-in ini function
function isInArray(toTest, ...args) {
    for (var arg of args) {
        if (toTest == arg)
            return true
    }
    return false
}

// #endregion built-in ini function

/**
 * 
 * @param {bool} iniDebugTool get debug tool
 * @param {bool} iniDevTool get dev tool
 * @param {object} params <scriptLoader:Object<baseLocation:string>, requireScript:Array<string>, exceptionScript:Array<string>>
 * @returns {object} <debugTool, devTool, modulesLoad, modulesLoadAssocName>
 */
export default async function ini(iniDebugTool = false, iniDevTool = false, params = { scriptLoader: { baseLocation: "" }, requireScript: [], exceptionScript: [] }) {
    // #region verification
    iniDebugTool = iniDebugTool || false;
    iniDevTool = iniDevTool || false;
    params = params || { scriptLoader: { baseLocation: "" }, requireScript: [], exceptionScript: [] };
    params.scriptLoader = params.scriptLoader || {}
    params.scriptLoader.baseLocation = params.scriptLoader.baseLocation || ""
    params.requireScript = params.requireScript || []
    params.exceptionScript = params.exceptionScript || []

    // verify if iniDebugTool is a boolean
    if (typeof iniDebugTool != "boolean") {
        throw new Error("iniDebugTool must be a boolean")
    }

    // verify if iniDevTool is a boolean
    if (typeof iniDevTool != "boolean") {
        throw new Error("iniDevTool must be a boolean")
    }

    // verify if params is an object
    if (typeof params != "object") {
        throw new Error("params must be an object")
    }

    // verify if params.scriptLoader is an object
    if (typeof params.scriptLoader != "object") {
        throw new Error("params.scriptLoader must be an object")
    }

    // verify if params.scriptLoader.baseLocation is a string
    if (typeof params.scriptLoader.baseLocation != "string") {
        throw new Error("params.scriptLoader.baseLocation must be a string")
    }

    // verify if params.requireScript is an array
    if (!Array.isArray(params.requireScript)) {
        throw new Error("params.requireScript must be an array")
    }

    // verify if params.exceptionScript is an array
    if (!Array.isArray(params.exceptionScript)) {
        throw new Error("params.exceptionScript must be an array")
    }

    // verify if params.requireScript is an array of string
    for (let i of params.requireScript) {
        if (typeof i != "string") {
            throw new Error("params.requireScript must be an array of string")
        }
    }

    // verify if params.exceptionScript is an array of string
    for (let i of params.exceptionScript) {
        if (typeof i != "string") {
            throw new Error("params.exceptionScript must be an array of string")
        }
    }

    // #endregion verification

    if (getScriptLoader() == undefined) {
        setScriptLoader(params.scriptLoader.baseLocation)
    }
    window.scriptLoader = getScriptLoader()

    // #region set baseURI and baseURL
    let baseURI = document.baseURI.substring(document.baseURI) == "/" ? document.baseURI : document.baseURI.split("/").splice(0, document.baseURI.split("/").length - 1).join("/") + "/"
    if (document.getElementById("nsApp") != undefined) {
        sessionStorage.baseURL = new URL("", baseURI + document.getElementById("nsApp").getAttribute("path")).href
        sessionStorage.baseURI = baseURI
    } else if (sessionStorage.baseURL == undefined && baseURI != sessionStorage.baseURI) {
        sessionStorage.baseURL = new URL("", baseURI)
        sessionStorage.baseURI = baseURI
    }

    // #endregion set baseURI and baseURL

    // require load prototype.modifier.ini.js
    window.prototypeModifier = await scriptLoader.load("./tool/prototype/prototype.modifier.js", "default", undefined, undefined, { inner: true })

    // #region load module requested

    let modulesToLoadAssocName = new Set(await Object.entries(await getFromFile(["./built-in/settings/associationName-Path.module.json", { retType: "json" }])).asyncForEach(async function(key, value) {
        if (value.ini.isRequire) {
            if (!ArrayFunction.isInArray(key, ...params.exceptionScript)) {
                return [key, [value.path, value.iniFunc, value.args, value.sort, value.params]]
            }
        } else {
            if (ArrayFunction.isInArray(key, ...params.requireScript)) {
                return [key, [value.path, value.iniFunc, value.args, value.sort, value.params]]
            }
        }
    }));
    modulesToLoadAssocName.delete(undefined)
    modulesToLoadAssocName = Array.from(modulesToLoadAssocName)
    let modulesToLoad = modulesToLoadAssocName.map(function(array) { return array[1] })
    const modulesLoad = await scriptLoader.loads(...modulesToLoad)

    // #endregion load module requested

    // #region test
    let debugTool, devTool = undefined
    if (iniDebugTool == true) {
        await scriptLoader.load("./built-in/debug/app.js", "default")
        debugTool = await scriptLoader.load("./built-in/debug/app.js", "getDebugTool")
    }
    if (iniDevTool == true) {
        await scriptLoader.load("./built-in/dev/app.js", "default")
        devTool = scriptLoader.call("./built-in/dev/app.js", "getDevTool")
    }

    // #endregion test

    // #region return
    return {
        debugTool,
        devTool,
        modulesLoad,
        modulesLoadAssocName: await [...modulesLoad].asyncForEach(function() {
            return [modulesToLoadAssocName[this.index][0], modulesLoad[this.index]]
        })
    }
    // #endregion return
}