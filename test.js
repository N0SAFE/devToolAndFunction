// #region import
import setModifiedPrototypeClass from "./built-in/tool/prototype.modifier.ini.js"
setModifiedPrototypeClass()

import * as func from "./built-in/function.js"
// #endregion import


// ? real property
// template explication : getFromFile(...args:Array<file:string||Array<...path>, ?param:Object<?data:string, ?stringify:bool=true, ?retType:string="text", ?method:string="POST", ?from:string="php">>)
/*
    !!! depreciate
    ? detailed explication 

 *  console.log(await func.getFromFile({
 *      file: [
 *          "./test.php",
 *          "./other.php"
 *      ],
 *      param: {
 *          data: "test",
 *          stringify: true,
 *          retType: "json",
 *          method: "POST",
 *          from: "php"
 *      }
 *  }, {
 *      file: "./test.php",
 *      param: {
 *          stringify: false
 *      }
 *  }))
 * 
 */
// console.log(await func.getFromFile({ file: "./test.php" }))
// console.log(await func.getFromFile({ file: "./hein.php", param: { showError: true } }))

func.getFromFile(["./built-in/php/verifyFileExists.php"])


let array = ["test", "other"]

// new template for asyncForEach
// info this function is slower but all callback is resolve successively
// params:
// param    1: callback: function call on each iteration
// param    2: wait? : isWaiting callback between each iteration
// param    3: timeout: timeout between each iteration = 0
// return: an array with the result of all return
let sort = await array.asyncForEach(async function() {
    console.log("asyncForEach index : " + this.index)
    return "test";
}, true, 1000)

console.log(sort)



array = ["test2", "other2"]

// !important: il faut l'utiliser dans scriptLoader.loads()
// template for asyncForEach when wait = false
// ? function use for return an array of promise and resolve it with Pomise.all() for a faster execution
// info this function is faster but all callback is resolve as same time
// params:
// param    1: callback: function call on each iteration
// param    2: wait? : isWaiting callback between each iteration
// param    3: timeout: timeout between each iteration = 0
// return an array of promise
sort = await Promise.all(await array.asyncForEach(async function() {
    return { bool: true, index: this.index }
}, false))

console.log(sort)



// ? same things
// template : temp(args:Array<...args:any>, ui:any)
function temp([...args], ui) {
    console.log(args, ui)
}
// template : temp(args:Array<...args:any>, ui:any)
function temp(args, ui) {
    console.log(args, ui)
}
temp(["test", "other"], "end")