import { ctx } from "./core";

export function useState<S>(initial: S) : [S, (S) => void ] {
  const [currentVal, update] = ctx().dispatch.next(initial);
  return [currentVal, update];
}

type Effect = () => (() => void) | void;

export function useEffect(effect: Effect, depArr: any[] ) : void {
  const hasNoDeps = !depArr
  const [currentVal, update] = ctx().dispatch.next();
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