import { useState, useEffect, elementCreator, Component } from "../henreact";

const h1 = elementCreator("h1");
const h2 = elementCreator("h2");
const div = elementCreator("div");
const button = elementCreator("button");


export const Hero: Component<{}> = ({}) => {
  const [title, setTitle] = useState("Title");

  useEffect(() => {
    console.log("title changed");
    return () => {console.log("cleanup")}
  },[title]);

  return div({ class: "hero"}, [
    h1({ class: "hero__title blue"}, title),
    h2({}, "Subtitle"),
    button(
      { "onClick": (e) => { setTitle(`${title}s`) } }, 
      "Click me!"
    )
  ])
}

