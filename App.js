import setBuild from "./built-in/ini/ini.js"
const { devTool, debugTool, modulesLoad, modulesToLoadAssocName } = await setBuild(false, false, { exceptionScript: ["loader/styleLoader"], requireScript: ["prototype/string", "function/dom"] })
console.log(devTool)
console.log(debugTool)
console.log(modulesLoad)
console.log(modulesToLoadAssocName)

console.log(scriptLoader)


// example to set in a doc for prototype modifier
await prototypeModifier.loadsPrototypeFromFile(["prototypeObject", "linearPath"], ["prototypeObject", "add"])

// ! when function.js is loaded a new global function is created (getFromFile)
// ! when you load the built-in a new global function is created (scriptLoader)