
export class Dispatch {
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