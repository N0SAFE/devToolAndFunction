import setBuild from "./built-in/ini/ini.js"
const { devTool, debugTool, modulesLoad, modulesToLoadAssocName } = await setBuild(false, false, { exceptionScript: ["loader/scriptLoader"], requireScript: ["prototype/string", "function/dom"] })
console.log(scriptLoader)
console.log(devTool)
console.log(debugTool)
console.log(modulesLoad)
console.log(modulesToLoadAssocName)