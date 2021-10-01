import { Component } from "./element";
import { makeid } from "./helpers";

class Hooks {
  private list: any[]; 
  private currentHook: number;
  private shouldRerender: boolean;
  private rerenderCallback: () => void | undefined;
  constructor() {
    this.list = [];
    this.currentHook = 0;
    this.shouldRerender = false;
  }

  resetCount() {
    this.currentHook = 0;
  }

  next(initial?: any) {
    const current = this.currentHook++;
    if (typeof this.list[current] === "undefined" && typeof initial !== "undefined" ) {
      this.list[current] = initial;
    }
    const update = (val: any) => {
      if (val !== this.list[current]) {
        this.list[current] = val;
        this.requiresRerender();
      }
    }
    return [this.list[current], update];
  }

  private requiresRerender() {
    this.shouldRerender = true;
    if (typeof this.rerenderCallback !== "undefined") {
      const cb = this.rerenderCallback;
      this.rerenderCallback = undefined;
      this.shouldRerender = false;
      cb();
    }
  }

  onceNextRender(callback) {
    if (this.shouldRerender) {
      this.shouldRerender = false;
      callback();
    } else {
      this.rerenderCallback = callback;
    }
  }
  
}

class RenderContext {
  hooks: Hooks;
  uuid: string;
  constructor(uuid: string) {
    this.hooks = new Hooks(); 
    this.uuid = uuid;
  }
}

let currentContext: RenderContext | undefined;
const contexts: Record<string, RenderContext> = {};

function ctx() {
  if (currentContext) return currentContext;
  throw new Error("Not in a valid context!");
}

export function runInContext<T>(callback: () => T, uuid: string): T {
  if (!contexts[uuid]) {
    contexts[uuid] = new RenderContext(uuid);
  }
  const prevContext = currentContext;
  currentContext = contexts[uuid];
  const renderedElement = callback();
  currentContext = prevContext;
  return renderedElement;
}

export function render(element: HTMLElement, rootComponent: Component<{}>) {
  const id = makeid(10);
  const rerender = () => {   
    element.innerHTML = "";
    runInContext(() => {
      ctx().hooks.resetCount();
      element.append(rootComponent({}));
      ctx().hooks.onceNextRender(rerender)
    }, id);
  }
  rerender();
}

export function useState<S>(initial: S) : [S, (S) => void ] {
  const [currentVal, update] = ctx().hooks.next(initial);
  return [currentVal, update];
}

type Effect = () => (() => void) | void;

export function useEffect(effect: Effect, depArr: any[] ) : void {
  const hasNoDeps = !depArr
  const [currentVal, update] = ctx().hooks.next();
  if (!currentVal) {
    update({deps: depArr, cleanup: effect()})
  } else {
    const {deps, cleanup} = currentVal;
    const hasChangedDeps = deps ? !depArr.every((el, i) => el === deps[i]) : true
    if (hasNoDeps || hasChangedDeps) {
      if (cleanup) cleanup();
      update({deps: depArr, cleanup: effect()})
    }
  }
}