/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/example.ts":
/*!***********************************!*\
  !*** ./src/components/example.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.Hero = void 0;
var henreact_1 = __webpack_require__(/*! ../henreact */ "./src/henreact/index.ts");
var h1 = (0, henreact_1.elementCreator)("h1");
var h2 = (0, henreact_1.elementCreator)("h2");
var div = (0, henreact_1.elementCreator)("div");
var button = (0, henreact_1.elementCreator)("button");
var Hero = function (_a) {
    var _b = (0, henreact_1.useState)("Title"), title = _b[0], setTitle = _b[1];
    (0, henreact_1.useEffect)(function () {
        console.log("title changed");
        return function () { console.log("cleanup"); };
    }, [title]);
    return div({ "class": "hero" }, [
        h1({ "class": "hero__title blue" }, title),
        h2({}, "Subtitle"),
        button({ "onClick": function (e) { setTitle(title + "s"); } }, "Click me!")
    ]);
};
exports.Hero = Hero;


/***/ }),

/***/ "./src/henreact/core.ts":
/*!******************************!*\
  !*** ./src/henreact/core.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.useEffect = exports.useState = exports.render = exports.runInContext = void 0;
var helpers_1 = __webpack_require__(/*! ./helpers */ "./src/henreact/helpers.ts");
var Hooks = /** @class */ (function () {
    function Hooks() {
        this.list = [];
        this.currentHook = 0;
        this.shouldRerender = false;
    }
    Hooks.prototype.resetCount = function () {
        this.currentHook = 0;
    };
    Hooks.prototype.next = function (initial) {
        var _this = this;
        var current = this.currentHook++;
        if (typeof this.list[current] === "undefined" && typeof initial !== "undefined") {
            this.list[current] = initial;
        }
        var update = function (val) {
            if (val !== _this.list[current]) {
                _this.list[current] = val;
                _this.requiresRerender();
            }
        };
        return [this.list[current], update];
    };
    Hooks.prototype.requiresRerender = function () {
        this.shouldRerender = true;
        if (typeof this.rerenderCallback !== "undefined") {
            var cb = this.rerenderCallback;
            this.rerenderCallback = undefined;
            this.shouldRerender = false;
            cb();
        }
    };
    Hooks.prototype.onceNextRender = function (callback) {
        if (this.shouldRerender) {
            this.shouldRerender = false;
            callback();
        }
        else {
            this.rerenderCallback = callback;
        }
    };
    return Hooks;
}());
var RenderContext = /** @class */ (function () {
    function RenderContext(uuid) {
        this.hooks = new Hooks();
        this.uuid = uuid;
    }
    return RenderContext;
}());
var currentContext;
var contexts = {};
function ctx() {
    if (currentContext)
        return currentContext;
    throw new Error("Not in a valid context!");
}
function runInContext(callback, uuid) {
    if (!contexts[uuid]) {
        contexts[uuid] = new RenderContext(uuid);
    }
    var prevContext = currentContext;
    currentContext = contexts[uuid];
    var renderedElement = callback();
    currentContext = prevContext;
    return renderedElement;
}
exports.runInContext = runInContext;
function render(element, rootComponent) {
    var id = (0, helpers_1.makeid)(10);
    var rerender = function () {
        element.innerHTML = "";
        runInContext(function () {
            ctx().hooks.resetCount();
            element.append(rootComponent({}));
            ctx().hooks.onceNextRender(rerender);
        }, id);
    };
    rerender();
}
exports.render = render;
function useState(initial) {
    var _a = ctx().hooks.next(initial), currentVal = _a[0], update = _a[1];
    return [currentVal, update];
}
exports.useState = useState;
function useEffect(effect, depArr) {
    var hasNoDeps = !depArr;
    var _a = ctx().hooks.next(), currentVal = _a[0], update = _a[1];
    if (!currentVal) {
        update({ deps: depArr, cleanup: effect() });
    }
    else {
        var deps_1 = currentVal.deps, cleanup = currentVal.cleanup;
        var hasChangedDeps = deps_1 ? !depArr.every(function (el, i) { return el === deps_1[i]; }) : true;
        if (hasNoDeps || hasChangedDeps) {
            if (cleanup)
                cleanup();
            update({ deps: depArr, cleanup: effect() });
        }
    }
}
exports.useEffect = useEffect;


/***/ }),

/***/ "./src/henreact/element.ts":
/*!*********************************!*\
  !*** ./src/henreact/element.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.elementCreator = void 0;
function elementCreator(tag) {
    return function (props, content) {
        var element = document.createElement(tag);
        Object.keys(props)
            .forEach(function (key) {
            if (key.substring(0, 2) === "on" && typeof props[key] === "function") {
                element.addEventListener(key.substring(2).toLowerCase(), props[key]);
            }
            else if (typeof props[key] === "string") {
                element.setAttribute(key, props[key]);
            }
        });
        if (Array.isArray(content)) {
            element.append.apply(element, content);
        }
        else if (content !== null && typeof content !== "undefined") {
            element.append(content);
        }
        return element;
    };
}
exports.elementCreator = elementCreator;


/***/ }),

/***/ "./src/henreact/helpers.ts":
/*!*********************************!*\
  !*** ./src/henreact/helpers.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.makeid = void 0;
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
exports.makeid = makeid;


/***/ }),

/***/ "./src/henreact/index.ts":
/*!*******************************!*\
  !*** ./src/henreact/index.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.useState = exports.useEffect = exports.render = exports.elementCreator = void 0;
var core_1 = __webpack_require__(/*! ./core */ "./src/henreact/core.ts");
exports.render = core_1.render;
exports.useState = core_1.useState;
exports.useEffect = core_1.useEffect;
var element_1 = __webpack_require__(/*! ./element */ "./src/henreact/element.ts");
exports.elementCreator = element_1.elementCreator;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

exports.__esModule = true;
var henreact_1 = __webpack_require__(/*! ./henreact */ "./src/henreact/index.ts");
var example_1 = __webpack_require__(/*! ./components/example */ "./src/components/example.ts");
(0, henreact_1.render)(document.getElementById("main"), example_1.Hero);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhO0FBQ2Isa0JBQWtCO0FBQ2xCLFlBQVk7QUFDWixpQkFBaUIsbUJBQU8sQ0FBQyw0Q0FBYTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCLEtBQUs7QUFDTCxpQkFBaUIsaUJBQWlCO0FBQ2xDLGFBQWEsNkJBQTZCO0FBQzFDLGFBQWE7QUFDYixpQkFBaUIsMEJBQTBCLDBCQUEwQjtBQUNyRTtBQUNBO0FBQ0EsWUFBWTs7Ozs7Ozs7Ozs7QUNwQkM7QUFDYixrQkFBa0I7QUFDbEIsaUJBQWlCLEdBQUcsZ0JBQWdCLEdBQUcsY0FBYyxHQUFHLG9CQUFvQjtBQUM1RSxnQkFBZ0IsbUJBQU8sQ0FBQyw0Q0FBVztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixpQ0FBaUM7QUFDbEQ7QUFDQTtBQUNBO0FBQ0EsdUVBQXVFLDBCQUEwQjtBQUNqRztBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsaUNBQWlDO0FBQ3REO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjs7Ozs7Ozs7Ozs7QUMxR0o7QUFDYixrQkFBa0I7QUFDbEIsc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCOzs7Ozs7Ozs7OztBQ3hCVDtBQUNiLGtCQUFrQjtBQUNsQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsWUFBWTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7Ozs7Ozs7Ozs7QUNiRDtBQUNiLGtCQUFrQjtBQUNsQixnQkFBZ0IsR0FBRyxpQkFBaUIsR0FBRyxjQUFjLEdBQUcsc0JBQXNCO0FBQzlFLGFBQWEsbUJBQU8sQ0FBQyxzQ0FBUTtBQUM3QixjQUFjO0FBQ2QsZ0JBQWdCO0FBQ2hCLGlCQUFpQjtBQUNqQixnQkFBZ0IsbUJBQU8sQ0FBQyw0Q0FBVztBQUNuQyxzQkFBc0I7Ozs7Ozs7VUNSdEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7OztBQ3RCYTtBQUNiLGtCQUFrQjtBQUNsQixpQkFBaUIsbUJBQU8sQ0FBQywyQ0FBWTtBQUNyQyxnQkFBZ0IsbUJBQU8sQ0FBQyx5REFBc0I7QUFDOUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZWFjdF9mcm9tX3NjcmF0Y2gvLi9zcmMvY29tcG9uZW50cy9leGFtcGxlLnRzIiwid2VicGFjazovL3JlYWN0X2Zyb21fc2NyYXRjaC8uL3NyYy9oZW5yZWFjdC9jb3JlLnRzIiwid2VicGFjazovL3JlYWN0X2Zyb21fc2NyYXRjaC8uL3NyYy9oZW5yZWFjdC9lbGVtZW50LnRzIiwid2VicGFjazovL3JlYWN0X2Zyb21fc2NyYXRjaC8uL3NyYy9oZW5yZWFjdC9oZWxwZXJzLnRzIiwid2VicGFjazovL3JlYWN0X2Zyb21fc2NyYXRjaC8uL3NyYy9oZW5yZWFjdC9pbmRleC50cyIsIndlYnBhY2s6Ly9yZWFjdF9mcm9tX3NjcmF0Y2gvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcmVhY3RfZnJvbV9zY3JhdGNoLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuSGVybyA9IHZvaWQgMDtcbnZhciBoZW5yZWFjdF8xID0gcmVxdWlyZShcIi4uL2hlbnJlYWN0XCIpO1xudmFyIGgxID0gKDAsIGhlbnJlYWN0XzEuZWxlbWVudENyZWF0b3IpKFwiaDFcIik7XG52YXIgaDIgPSAoMCwgaGVucmVhY3RfMS5lbGVtZW50Q3JlYXRvcikoXCJoMlwiKTtcbnZhciBkaXYgPSAoMCwgaGVucmVhY3RfMS5lbGVtZW50Q3JlYXRvcikoXCJkaXZcIik7XG52YXIgYnV0dG9uID0gKDAsIGhlbnJlYWN0XzEuZWxlbWVudENyZWF0b3IpKFwiYnV0dG9uXCIpO1xudmFyIEhlcm8gPSBmdW5jdGlvbiAoX2EpIHtcbiAgICB2YXIgX2IgPSAoMCwgaGVucmVhY3RfMS51c2VTdGF0ZSkoXCJUaXRsZVwiKSwgdGl0bGUgPSBfYlswXSwgc2V0VGl0bGUgPSBfYlsxXTtcbiAgICAoMCwgaGVucmVhY3RfMS51c2VFZmZlY3QpKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJ0aXRsZSBjaGFuZ2VkXCIpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkgeyBjb25zb2xlLmxvZyhcImNsZWFudXBcIik7IH07XG4gICAgfSwgW3RpdGxlXSk7XG4gICAgcmV0dXJuIGRpdih7IFwiY2xhc3NcIjogXCJoZXJvXCIgfSwgW1xuICAgICAgICBoMSh7IFwiY2xhc3NcIjogXCJoZXJvX190aXRsZSBibHVlXCIgfSwgdGl0bGUpLFxuICAgICAgICBoMih7fSwgXCJTdWJ0aXRsZVwiKSxcbiAgICAgICAgYnV0dG9uKHsgXCJvbkNsaWNrXCI6IGZ1bmN0aW9uIChlKSB7IHNldFRpdGxlKHRpdGxlICsgXCJzXCIpOyB9IH0sIFwiQ2xpY2sgbWUhXCIpXG4gICAgXSk7XG59O1xuZXhwb3J0cy5IZXJvID0gSGVybztcbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMudXNlRWZmZWN0ID0gZXhwb3J0cy51c2VTdGF0ZSA9IGV4cG9ydHMucmVuZGVyID0gZXhwb3J0cy5ydW5JbkNvbnRleHQgPSB2b2lkIDA7XG52YXIgaGVscGVyc18xID0gcmVxdWlyZShcIi4vaGVscGVyc1wiKTtcbnZhciBIb29rcyA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBIb29rcygpIHtcbiAgICAgICAgdGhpcy5saXN0ID0gW107XG4gICAgICAgIHRoaXMuY3VycmVudEhvb2sgPSAwO1xuICAgICAgICB0aGlzLnNob3VsZFJlcmVuZGVyID0gZmFsc2U7XG4gICAgfVxuICAgIEhvb2tzLnByb3RvdHlwZS5yZXNldENvdW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRIb29rID0gMDtcbiAgICB9O1xuICAgIEhvb2tzLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKGluaXRpYWwpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLmN1cnJlbnRIb29rKys7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5saXN0W2N1cnJlbnRdID09PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBpbml0aWFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RbY3VycmVudF0gPSBpbml0aWFsO1xuICAgICAgICB9XG4gICAgICAgIHZhciB1cGRhdGUgPSBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICBpZiAodmFsICE9PSBfdGhpcy5saXN0W2N1cnJlbnRdKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMubGlzdFtjdXJyZW50XSA9IHZhbDtcbiAgICAgICAgICAgICAgICBfdGhpcy5yZXF1aXJlc1JlcmVuZGVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBbdGhpcy5saXN0W2N1cnJlbnRdLCB1cGRhdGVdO1xuICAgIH07XG4gICAgSG9va3MucHJvdG90eXBlLnJlcXVpcmVzUmVyZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc2hvdWxkUmVyZW5kZXIgPSB0cnVlO1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMucmVyZW5kZXJDYWxsYmFjayAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdmFyIGNiID0gdGhpcy5yZXJlbmRlckNhbGxiYWNrO1xuICAgICAgICAgICAgdGhpcy5yZXJlbmRlckNhbGxiYWNrID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy5zaG91bGRSZXJlbmRlciA9IGZhbHNlO1xuICAgICAgICAgICAgY2IoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgSG9va3MucHJvdG90eXBlLm9uY2VOZXh0UmVuZGVyID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0aGlzLnNob3VsZFJlcmVuZGVyKSB7XG4gICAgICAgICAgICB0aGlzLnNob3VsZFJlcmVuZGVyID0gZmFsc2U7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZXJlbmRlckNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBIb29rcztcbn0oKSk7XG52YXIgUmVuZGVyQ29udGV4dCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBSZW5kZXJDb250ZXh0KHV1aWQpIHtcbiAgICAgICAgdGhpcy5ob29rcyA9IG5ldyBIb29rcygpO1xuICAgICAgICB0aGlzLnV1aWQgPSB1dWlkO1xuICAgIH1cbiAgICByZXR1cm4gUmVuZGVyQ29udGV4dDtcbn0oKSk7XG52YXIgY3VycmVudENvbnRleHQ7XG52YXIgY29udGV4dHMgPSB7fTtcbmZ1bmN0aW9uIGN0eCgpIHtcbiAgICBpZiAoY3VycmVudENvbnRleHQpXG4gICAgICAgIHJldHVybiBjdXJyZW50Q29udGV4dDtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW4gYSB2YWxpZCBjb250ZXh0IVwiKTtcbn1cbmZ1bmN0aW9uIHJ1bkluQ29udGV4dChjYWxsYmFjaywgdXVpZCkge1xuICAgIGlmICghY29udGV4dHNbdXVpZF0pIHtcbiAgICAgICAgY29udGV4dHNbdXVpZF0gPSBuZXcgUmVuZGVyQ29udGV4dCh1dWlkKTtcbiAgICB9XG4gICAgdmFyIHByZXZDb250ZXh0ID0gY3VycmVudENvbnRleHQ7XG4gICAgY3VycmVudENvbnRleHQgPSBjb250ZXh0c1t1dWlkXTtcbiAgICB2YXIgcmVuZGVyZWRFbGVtZW50ID0gY2FsbGJhY2soKTtcbiAgICBjdXJyZW50Q29udGV4dCA9IHByZXZDb250ZXh0O1xuICAgIHJldHVybiByZW5kZXJlZEVsZW1lbnQ7XG59XG5leHBvcnRzLnJ1bkluQ29udGV4dCA9IHJ1bkluQ29udGV4dDtcbmZ1bmN0aW9uIHJlbmRlcihlbGVtZW50LCByb290Q29tcG9uZW50KSB7XG4gICAgdmFyIGlkID0gKDAsIGhlbHBlcnNfMS5tYWtlaWQpKDEwKTtcbiAgICB2YXIgcmVyZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgcnVuSW5Db250ZXh0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGN0eCgpLmhvb2tzLnJlc2V0Q291bnQoKTtcbiAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kKHJvb3RDb21wb25lbnQoe30pKTtcbiAgICAgICAgICAgIGN0eCgpLmhvb2tzLm9uY2VOZXh0UmVuZGVyKHJlcmVuZGVyKTtcbiAgICAgICAgfSwgaWQpO1xuICAgIH07XG4gICAgcmVyZW5kZXIoKTtcbn1cbmV4cG9ydHMucmVuZGVyID0gcmVuZGVyO1xuZnVuY3Rpb24gdXNlU3RhdGUoaW5pdGlhbCkge1xuICAgIHZhciBfYSA9IGN0eCgpLmhvb2tzLm5leHQoaW5pdGlhbCksIGN1cnJlbnRWYWwgPSBfYVswXSwgdXBkYXRlID0gX2FbMV07XG4gICAgcmV0dXJuIFtjdXJyZW50VmFsLCB1cGRhdGVdO1xufVxuZXhwb3J0cy51c2VTdGF0ZSA9IHVzZVN0YXRlO1xuZnVuY3Rpb24gdXNlRWZmZWN0KGVmZmVjdCwgZGVwQXJyKSB7XG4gICAgdmFyIGhhc05vRGVwcyA9ICFkZXBBcnI7XG4gICAgdmFyIF9hID0gY3R4KCkuaG9va3MubmV4dCgpLCBjdXJyZW50VmFsID0gX2FbMF0sIHVwZGF0ZSA9IF9hWzFdO1xuICAgIGlmICghY3VycmVudFZhbCkge1xuICAgICAgICB1cGRhdGUoeyBkZXBzOiBkZXBBcnIsIGNsZWFudXA6IGVmZmVjdCgpIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIGRlcHNfMSA9IGN1cnJlbnRWYWwuZGVwcywgY2xlYW51cCA9IGN1cnJlbnRWYWwuY2xlYW51cDtcbiAgICAgICAgdmFyIGhhc0NoYW5nZWREZXBzID0gZGVwc18xID8gIWRlcEFyci5ldmVyeShmdW5jdGlvbiAoZWwsIGkpIHsgcmV0dXJuIGVsID09PSBkZXBzXzFbaV07IH0pIDogdHJ1ZTtcbiAgICAgICAgaWYgKGhhc05vRGVwcyB8fCBoYXNDaGFuZ2VkRGVwcykge1xuICAgICAgICAgICAgaWYgKGNsZWFudXApXG4gICAgICAgICAgICAgICAgY2xlYW51cCgpO1xuICAgICAgICAgICAgdXBkYXRlKHsgZGVwczogZGVwQXJyLCBjbGVhbnVwOiBlZmZlY3QoKSB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMudXNlRWZmZWN0ID0gdXNlRWZmZWN0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5lbGVtZW50Q3JlYXRvciA9IHZvaWQgMDtcbmZ1bmN0aW9uIGVsZW1lbnRDcmVhdG9yKHRhZykge1xuICAgIHJldHVybiBmdW5jdGlvbiAocHJvcHMsIGNvbnRlbnQpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gICAgICAgIE9iamVjdC5rZXlzKHByb3BzKVxuICAgICAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgaWYgKGtleS5zdWJzdHJpbmcoMCwgMikgPT09IFwib25cIiAmJiB0eXBlb2YgcHJvcHNba2V5XSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGtleS5zdWJzdHJpbmcoMikudG9Mb3dlckNhc2UoKSwgcHJvcHNba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgcHJvcHNba2V5XSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgcHJvcHNba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjb250ZW50KSkge1xuICAgICAgICAgICAgZWxlbWVudC5hcHBlbmQuYXBwbHkoZWxlbWVudCwgY29udGVudCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29udGVudCAhPT0gbnVsbCAmJiB0eXBlb2YgY29udGVudCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZWxlbWVudC5hcHBlbmQoY29udGVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfTtcbn1cbmV4cG9ydHMuZWxlbWVudENyZWF0b3IgPSBlbGVtZW50Q3JlYXRvcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMubWFrZWlkID0gdm9pZCAwO1xuZnVuY3Rpb24gbWFrZWlkKGxlbmd0aCkge1xuICAgIHZhciByZXN1bHQgPSAnJztcbiAgICB2YXIgY2hhcmFjdGVycyA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSc7XG4gICAgdmFyIGNoYXJhY3RlcnNMZW5ndGggPSBjaGFyYWN0ZXJzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlc3VsdCArPSBjaGFyYWN0ZXJzLmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKlxuICAgICAgICAgICAgY2hhcmFjdGVyc0xlbmd0aCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZXhwb3J0cy5tYWtlaWQgPSBtYWtlaWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLnVzZVN0YXRlID0gZXhwb3J0cy51c2VFZmZlY3QgPSBleHBvcnRzLnJlbmRlciA9IGV4cG9ydHMuZWxlbWVudENyZWF0b3IgPSB2b2lkIDA7XG52YXIgY29yZV8xID0gcmVxdWlyZShcIi4vY29yZVwiKTtcbmV4cG9ydHMucmVuZGVyID0gY29yZV8xLnJlbmRlcjtcbmV4cG9ydHMudXNlU3RhdGUgPSBjb3JlXzEudXNlU3RhdGU7XG5leHBvcnRzLnVzZUVmZmVjdCA9IGNvcmVfMS51c2VFZmZlY3Q7XG52YXIgZWxlbWVudF8xID0gcmVxdWlyZShcIi4vZWxlbWVudFwiKTtcbmV4cG9ydHMuZWxlbWVudENyZWF0b3IgPSBlbGVtZW50XzEuZWxlbWVudENyZWF0b3I7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xudmFyIGhlbnJlYWN0XzEgPSByZXF1aXJlKFwiLi9oZW5yZWFjdFwiKTtcbnZhciBleGFtcGxlXzEgPSByZXF1aXJlKFwiLi9jb21wb25lbnRzL2V4YW1wbGVcIik7XG4oMCwgaGVucmVhY3RfMS5yZW5kZXIpKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpblwiKSwgZXhhbXBsZV8xLkhlcm8pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9