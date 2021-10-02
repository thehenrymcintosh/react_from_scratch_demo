import { Component } from "./element";
import { Dispatch } from "./dispatch";

class RenderContext {
  dispatch: Dispatch;
  constructor() {
    this.dispatch = new Dispatch(); 
  }
}

let currentContext: RenderContext | undefined;

export function ctx() {
  if (currentContext) return currentContext;
  throw new Error("Not in a valid context!");
}

export function runInContext<T>(callback: () => T, context: RenderContext): T {
  const prevContext = currentContext;
  currentContext = context;
  const renderedElement = callback();
  currentContext = prevContext;
  return renderedElement;
}

export function render(element: HTMLElement, rootComponent: Component<{}>) {
  const context = new RenderContext();
  const rerender = () => {   
    element.innerHTML = "";
    runInContext(() => {
      ctx().dispatch.resetCount();
      element.append(rootComponent({}));
      ctx().dispatch.onceNextRender(rerender)
    }, context);
  }
  rerender();
}