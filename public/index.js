/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/example.ts":
/*!***********************************!*\
  !*** ./src/components/example.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.Button = exports.Heading = exports.Hero = void 0;
var henreact_1 = __webpack_require__(/*! ../henreact */ "./src/henreact/index.ts");
var h1 = (0, henreact_1.elementCreator)("h1");
var h2 = (0, henreact_1.elementCreator)("h2");
var div = (0, henreact_1.elementCreator)("div");
var button = (0, henreact_1.elementCreator)("button");
var Hero = function (_a) {
    var _b = (0, henreact_1.useState)("Title"), title = _b[0], setTitle = _b[1];
    return div({ "class": "hero" }, [
        (0, exports.Heading)({ content: title }),
        h2({}, "Subtitle"),
        (0, exports.Button)({
            onClick: function () { setTitle(title + "s"); },
            text: "Click me!"
        })
    ]);
};
exports.Hero = Hero;
var Heading = function (_a) {
    var content = _a.content;
    (0, henreact_1.useEffect)(function () {
        console.log("text changed");
        return function () { console.log("cleanup"); };
    }, [content]);
    return h1({ "class": "hero__title" }, content);
};
exports.Heading = Heading;
var Button = function (_a) {
    var onClick = _a.onClick, text = _a.text;
    return button({ onClick: onClick }, text);
};
exports.Button = Button;


/***/ }),

/***/ "./src/henreact/core.ts":
/*!******************************!*\
  !*** ./src/henreact/core.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.render = exports.runInContext = exports.ctx = void 0;
var dispatch_1 = __webpack_require__(/*! ./dispatch */ "./src/henreact/dispatch.ts");
var RenderContext = /** @class */ (function () {
    function RenderContext() {
        this.dispatch = new dispatch_1.Dispatch();
    }
    return RenderContext;
}());
var currentContext;
function ctx() {
    if (currentContext)
        return currentContext;
    throw new Error("Not in a valid context!");
}
exports.ctx = ctx;
function runInContext(callback, context) {
    var prevContext = currentContext;
    currentContext = context;
    var renderedElement = callback();
    currentContext = prevContext;
    return renderedElement;
}
exports.runInContext = runInContext;
function render(element, rootComponent) {
    var context = new RenderContext();
    var rerender = function () {
        element.innerHTML = "";
        runInContext(function () {
            ctx().dispatch.resetCount();
            element.append(rootComponent({}));
            ctx().dispatch.onceNextRender(rerender);
        }, context);
    };
    rerender();
}
exports.render = render;


/***/ }),

/***/ "./src/henreact/dispatch.ts":
/*!**********************************!*\
  !*** ./src/henreact/dispatch.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.Dispatch = void 0;
var Dispatch = /** @class */ (function () {
    function Dispatch() {
        this.list = [];
        this.currentHook = 0;
        this.shouldRerender = false;
    }
    Dispatch.prototype.resetCount = function () {
        this.currentHook = 0;
    };
    Dispatch.prototype.next = function (initial) {
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
    Dispatch.prototype.requiresRerender = function () {
        this.shouldRerender = true;
        if (typeof this.rerenderCallback !== "undefined") {
            var cb = this.rerenderCallback;
            this.rerenderCallback = undefined;
            this.shouldRerender = false;
            cb();
        }
    };
    Dispatch.prototype.onceNextRender = function (callback) {
        if (this.shouldRerender) {
            this.shouldRerender = false;
            callback();
        }
        else {
            this.rerenderCallback = callback;
        }
    };
    return Dispatch;
}());
exports.Dispatch = Dispatch;


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

/***/ "./src/henreact/hooks.ts":
/*!*******************************!*\
  !*** ./src/henreact/hooks.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.useEffect = exports.useState = void 0;
var core_1 = __webpack_require__(/*! ./core */ "./src/henreact/core.ts");
function useState(initial) {
    var _a = (0, core_1.ctx)().dispatch.next(initial), currentVal = _a[0], update = _a[1];
    return [currentVal, update];
}
exports.useState = useState;
function useEffect(effect, depArr) {
    var hasNoDeps = !depArr;
    var _a = (0, core_1.ctx)().dispatch.next(), currentVal = _a[0], update = _a[1];
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

/***/ "./src/henreact/index.ts":
/*!*******************************!*\
  !*** ./src/henreact/index.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.useState = exports.useEffect = exports.render = exports.elementCreator = void 0;
var hooks_1 = __webpack_require__(/*! ./hooks */ "./src/henreact/hooks.ts");
exports.useState = hooks_1.useState;
exports.useEffect = hooks_1.useEffect;
var core_1 = __webpack_require__(/*! ./core */ "./src/henreact/core.ts");
exports.render = core_1.render;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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b3VyY2VzIjpbIndlYnBhY2s6Ly9yZWFjdF9mcm9tX3NjcmF0Y2gvLi9zcmMvY29tcG9uZW50cy9leGFtcGxlLnRzIiwid2VicGFjazovL3JlYWN0X2Zyb21fc2NyYXRjaC8uL3NyYy9oZW5yZWFjdC9jb3JlLnRzIiwid2VicGFjazovL3JlYWN0X2Zyb21fc2NyYXRjaC8uL3NyYy9oZW5yZWFjdC9kaXNwYXRjaC50cyIsIndlYnBhY2s6Ly9yZWFjdF9mcm9tX3NjcmF0Y2gvLi9zcmMvaGVucmVhY3QvZWxlbWVudC50cyIsIndlYnBhY2s6Ly9yZWFjdF9mcm9tX3NjcmF0Y2gvLi9zcmMvaGVucmVhY3QvaG9va3MudHMiLCJ3ZWJwYWNrOi8vcmVhY3RfZnJvbV9zY3JhdGNoLy4vc3JjL2hlbnJlYWN0L2luZGV4LnRzIiwid2VicGFjazovL3JlYWN0X2Zyb21fc2NyYXRjaC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9yZWFjdF9mcm9tX3NjcmF0Y2gvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5CdXR0b24gPSBleHBvcnRzLkhlYWRpbmcgPSBleHBvcnRzLkhlcm8gPSB2b2lkIDA7XG52YXIgaGVucmVhY3RfMSA9IHJlcXVpcmUoXCIuLi9oZW5yZWFjdFwiKTtcbnZhciBoMSA9ICgwLCBoZW5yZWFjdF8xLmVsZW1lbnRDcmVhdG9yKShcImgxXCIpO1xudmFyIGgyID0gKDAsIGhlbnJlYWN0XzEuZWxlbWVudENyZWF0b3IpKFwiaDJcIik7XG52YXIgZGl2ID0gKDAsIGhlbnJlYWN0XzEuZWxlbWVudENyZWF0b3IpKFwiZGl2XCIpO1xudmFyIGJ1dHRvbiA9ICgwLCBoZW5yZWFjdF8xLmVsZW1lbnRDcmVhdG9yKShcImJ1dHRvblwiKTtcbnZhciBIZXJvID0gZnVuY3Rpb24gKF9hKSB7XG4gICAgdmFyIF9iID0gKDAsIGhlbnJlYWN0XzEudXNlU3RhdGUpKFwiVGl0bGVcIiksIHRpdGxlID0gX2JbMF0sIHNldFRpdGxlID0gX2JbMV07XG4gICAgcmV0dXJuIGRpdih7IFwiY2xhc3NcIjogXCJoZXJvXCIgfSwgW1xuICAgICAgICAoMCwgZXhwb3J0cy5IZWFkaW5nKSh7IGNvbnRlbnQ6IHRpdGxlIH0pLFxuICAgICAgICBoMih7fSwgXCJTdWJ0aXRsZVwiKSxcbiAgICAgICAgKDAsIGV4cG9ydHMuQnV0dG9uKSh7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiAoKSB7IHNldFRpdGxlKHRpdGxlICsgXCJzXCIpOyB9LFxuICAgICAgICAgICAgdGV4dDogXCJDbGljayBtZSFcIlxuICAgICAgICB9KVxuICAgIF0pO1xufTtcbmV4cG9ydHMuSGVybyA9IEhlcm87XG52YXIgSGVhZGluZyA9IGZ1bmN0aW9uIChfYSkge1xuICAgIHZhciBjb250ZW50ID0gX2EuY29udGVudDtcbiAgICAoMCwgaGVucmVhY3RfMS51c2VFZmZlY3QpKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJ0ZXh0IGNoYW5nZWRcIik7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7IGNvbnNvbGUubG9nKFwiY2xlYW51cFwiKTsgfTtcbiAgICB9LCBbY29udGVudF0pO1xuICAgIHJldHVybiBoMSh7IFwiY2xhc3NcIjogXCJoZXJvX190aXRsZVwiIH0sIGNvbnRlbnQpO1xufTtcbmV4cG9ydHMuSGVhZGluZyA9IEhlYWRpbmc7XG52YXIgQnV0dG9uID0gZnVuY3Rpb24gKF9hKSB7XG4gICAgdmFyIG9uQ2xpY2sgPSBfYS5vbkNsaWNrLCB0ZXh0ID0gX2EudGV4dDtcbiAgICByZXR1cm4gYnV0dG9uKHsgb25DbGljazogb25DbGljayB9LCB0ZXh0KTtcbn07XG5leHBvcnRzLkJ1dHRvbiA9IEJ1dHRvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMucmVuZGVyID0gZXhwb3J0cy5ydW5JbkNvbnRleHQgPSBleHBvcnRzLmN0eCA9IHZvaWQgMDtcbnZhciBkaXNwYXRjaF8xID0gcmVxdWlyZShcIi4vZGlzcGF0Y2hcIik7XG52YXIgUmVuZGVyQ29udGV4dCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBSZW5kZXJDb250ZXh0KCkge1xuICAgICAgICB0aGlzLmRpc3BhdGNoID0gbmV3IGRpc3BhdGNoXzEuRGlzcGF0Y2goKTtcbiAgICB9XG4gICAgcmV0dXJuIFJlbmRlckNvbnRleHQ7XG59KCkpO1xudmFyIGN1cnJlbnRDb250ZXh0O1xuZnVuY3Rpb24gY3R4KCkge1xuICAgIGlmIChjdXJyZW50Q29udGV4dClcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRDb250ZXh0O1xuICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbiBhIHZhbGlkIGNvbnRleHQhXCIpO1xufVxuZXhwb3J0cy5jdHggPSBjdHg7XG5mdW5jdGlvbiBydW5JbkNvbnRleHQoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB2YXIgcHJldkNvbnRleHQgPSBjdXJyZW50Q29udGV4dDtcbiAgICBjdXJyZW50Q29udGV4dCA9IGNvbnRleHQ7XG4gICAgdmFyIHJlbmRlcmVkRWxlbWVudCA9IGNhbGxiYWNrKCk7XG4gICAgY3VycmVudENvbnRleHQgPSBwcmV2Q29udGV4dDtcbiAgICByZXR1cm4gcmVuZGVyZWRFbGVtZW50O1xufVxuZXhwb3J0cy5ydW5JbkNvbnRleHQgPSBydW5JbkNvbnRleHQ7XG5mdW5jdGlvbiByZW5kZXIoZWxlbWVudCwgcm9vdENvbXBvbmVudCkge1xuICAgIHZhciBjb250ZXh0ID0gbmV3IFJlbmRlckNvbnRleHQoKTtcbiAgICB2YXIgcmVyZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgcnVuSW5Db250ZXh0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGN0eCgpLmRpc3BhdGNoLnJlc2V0Q291bnQoKTtcbiAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kKHJvb3RDb21wb25lbnQoe30pKTtcbiAgICAgICAgICAgIGN0eCgpLmRpc3BhdGNoLm9uY2VOZXh0UmVuZGVyKHJlcmVuZGVyKTtcbiAgICAgICAgfSwgY29udGV4dCk7XG4gICAgfTtcbiAgICByZXJlbmRlcigpO1xufVxuZXhwb3J0cy5yZW5kZXIgPSByZW5kZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLkRpc3BhdGNoID0gdm9pZCAwO1xudmFyIERpc3BhdGNoID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIERpc3BhdGNoKCkge1xuICAgICAgICB0aGlzLmxpc3QgPSBbXTtcbiAgICAgICAgdGhpcy5jdXJyZW50SG9vayA9IDA7XG4gICAgICAgIHRoaXMuc2hvdWxkUmVyZW5kZXIgPSBmYWxzZTtcbiAgICB9XG4gICAgRGlzcGF0Y2gucHJvdG90eXBlLnJlc2V0Q291bnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY3VycmVudEhvb2sgPSAwO1xuICAgIH07XG4gICAgRGlzcGF0Y2gucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoaW5pdGlhbCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgY3VycmVudCA9IHRoaXMuY3VycmVudEhvb2srKztcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmxpc3RbY3VycmVudF0gPT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGluaXRpYWwgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdFtjdXJyZW50XSA9IGluaXRpYWw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHVwZGF0ZSA9IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgIGlmICh2YWwgIT09IF90aGlzLmxpc3RbY3VycmVudF0pIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5saXN0W2N1cnJlbnRdID0gdmFsO1xuICAgICAgICAgICAgICAgIF90aGlzLnJlcXVpcmVzUmVyZW5kZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIFt0aGlzLmxpc3RbY3VycmVudF0sIHVwZGF0ZV07XG4gICAgfTtcbiAgICBEaXNwYXRjaC5wcm90b3R5cGUucmVxdWlyZXNSZXJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zaG91bGRSZXJlbmRlciA9IHRydWU7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5yZXJlbmRlckNhbGxiYWNrICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB2YXIgY2IgPSB0aGlzLnJlcmVuZGVyQ2FsbGJhY2s7XG4gICAgICAgICAgICB0aGlzLnJlcmVuZGVyQ2FsbGJhY2sgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLnNob3VsZFJlcmVuZGVyID0gZmFsc2U7XG4gICAgICAgICAgICBjYigpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBEaXNwYXRjaC5wcm90b3R5cGUub25jZU5leHRSZW5kZXIgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHRoaXMuc2hvdWxkUmVyZW5kZXIpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvdWxkUmVyZW5kZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlcmVuZGVyQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIERpc3BhdGNoO1xufSgpKTtcbmV4cG9ydHMuRGlzcGF0Y2ggPSBEaXNwYXRjaDtcbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuZWxlbWVudENyZWF0b3IgPSB2b2lkIDA7XG5mdW5jdGlvbiBlbGVtZW50Q3JlYXRvcih0YWcpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHByb3BzLCBjb250ZW50KSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICAgICAgICBPYmplY3Qua2V5cyhwcm9wcylcbiAgICAgICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIGlmIChrZXkuc3Vic3RyaW5nKDAsIDIpID09PSBcIm9uXCIgJiYgdHlwZW9mIHByb3BzW2tleV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihrZXkuc3Vic3RyaW5nKDIpLnRvTG93ZXJDYXNlKCksIHByb3BzW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHByb3BzW2tleV0gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIHByb3BzW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY29udGVudCkpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kLmFwcGx5KGVsZW1lbnQsIGNvbnRlbnQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvbnRlbnQgIT09IG51bGwgJiYgdHlwZW9mIGNvbnRlbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kKGNvbnRlbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH07XG59XG5leHBvcnRzLmVsZW1lbnRDcmVhdG9yID0gZWxlbWVudENyZWF0b3I7XG4iLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLnVzZUVmZmVjdCA9IGV4cG9ydHMudXNlU3RhdGUgPSB2b2lkIDA7XG52YXIgY29yZV8xID0gcmVxdWlyZShcIi4vY29yZVwiKTtcbmZ1bmN0aW9uIHVzZVN0YXRlKGluaXRpYWwpIHtcbiAgICB2YXIgX2EgPSAoMCwgY29yZV8xLmN0eCkoKS5kaXNwYXRjaC5uZXh0KGluaXRpYWwpLCBjdXJyZW50VmFsID0gX2FbMF0sIHVwZGF0ZSA9IF9hWzFdO1xuICAgIHJldHVybiBbY3VycmVudFZhbCwgdXBkYXRlXTtcbn1cbmV4cG9ydHMudXNlU3RhdGUgPSB1c2VTdGF0ZTtcbmZ1bmN0aW9uIHVzZUVmZmVjdChlZmZlY3QsIGRlcEFycikge1xuICAgIHZhciBoYXNOb0RlcHMgPSAhZGVwQXJyO1xuICAgIHZhciBfYSA9ICgwLCBjb3JlXzEuY3R4KSgpLmRpc3BhdGNoLm5leHQoKSwgY3VycmVudFZhbCA9IF9hWzBdLCB1cGRhdGUgPSBfYVsxXTtcbiAgICBpZiAoIWN1cnJlbnRWYWwpIHtcbiAgICAgICAgdXBkYXRlKHsgZGVwczogZGVwQXJyLCBjbGVhbnVwOiBlZmZlY3QoKSB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciBkZXBzXzEgPSBjdXJyZW50VmFsLmRlcHMsIGNsZWFudXAgPSBjdXJyZW50VmFsLmNsZWFudXA7XG4gICAgICAgIHZhciBoYXNDaGFuZ2VkRGVwcyA9IGRlcHNfMSA/ICFkZXBBcnIuZXZlcnkoZnVuY3Rpb24gKGVsLCBpKSB7IHJldHVybiBlbCA9PT0gZGVwc18xW2ldOyB9KSA6IHRydWU7XG4gICAgICAgIGlmIChoYXNOb0RlcHMgfHwgaGFzQ2hhbmdlZERlcHMpIHtcbiAgICAgICAgICAgIGlmIChjbGVhbnVwKVxuICAgICAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgICAgIHVwZGF0ZSh7IGRlcHM6IGRlcEFyciwgY2xlYW51cDogZWZmZWN0KCkgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLnVzZUVmZmVjdCA9IHVzZUVmZmVjdDtcbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMudXNlU3RhdGUgPSBleHBvcnRzLnVzZUVmZmVjdCA9IGV4cG9ydHMucmVuZGVyID0gZXhwb3J0cy5lbGVtZW50Q3JlYXRvciA9IHZvaWQgMDtcbnZhciBob29rc18xID0gcmVxdWlyZShcIi4vaG9va3NcIik7XG5leHBvcnRzLnVzZVN0YXRlID0gaG9va3NfMS51c2VTdGF0ZTtcbmV4cG9ydHMudXNlRWZmZWN0ID0gaG9va3NfMS51c2VFZmZlY3Q7XG52YXIgY29yZV8xID0gcmVxdWlyZShcIi4vY29yZVwiKTtcbmV4cG9ydHMucmVuZGVyID0gY29yZV8xLnJlbmRlcjtcbnZhciBlbGVtZW50XzEgPSByZXF1aXJlKFwiLi9lbGVtZW50XCIpO1xuZXhwb3J0cy5lbGVtZW50Q3JlYXRvciA9IGVsZW1lbnRfMS5lbGVtZW50Q3JlYXRvcjtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG52YXIgaGVucmVhY3RfMSA9IHJlcXVpcmUoXCIuL2hlbnJlYWN0XCIpO1xudmFyIGV4YW1wbGVfMSA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvZXhhbXBsZVwiKTtcbigwLCBoZW5yZWFjdF8xLnJlbmRlcikoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluXCIpLCBleGFtcGxlXzEuSGVybyk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=