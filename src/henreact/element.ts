type ElementProps = Record<string, (string | EventListenerOrEventListenerObject)>
type Content = (string | Node | null);

export type Component<props> = (props) => Content;

export function elementCreator(tag: string) {
  return (props: ElementProps, content: Content | Content[]): Content => {
    const element = document.createElement(tag);
    Object.keys(props)
      .forEach(key => {
        if (key.substring(0,2) === "on" && typeof props[key] === "function") {
          element.addEventListener(key.substring(2).toLowerCase() as keyof HTMLElementEventMap, props[key] as any); 
        } else if (typeof props[key] === "string") {
          element.setAttribute(key, props[key] as any);
        }
      });
    if (Array.isArray(content)) {
      element.append(...content);
    } else if (content !== null && typeof content !== "undefined") { 
      element.append(content);
    } 
    return element;
  }
}