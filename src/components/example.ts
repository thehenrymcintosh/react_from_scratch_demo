import { useState, useEffect, elementCreator, Component } from "../henreact";

const h1 = elementCreator("h1");
const h2 = elementCreator("h2");
const div = elementCreator("div");
const button = elementCreator("button");


export const Hero: Component<{}> = ({}) => {
  const [title, setTitle] = useState("Title");

  return div({ class: "hero"}, [
    Heading({content: title}),
    h2({}, "Subtitle"),
    Button({
        onClick: () => { setTitle(`${title}s`) } , 
        text: "Click me!"
      }
    )
  ])
}

export const Heading: Component<{content: string}> = ({content}) => {
  
  useEffect(() => {
    console.log("text changed");
    return () => {console.log("cleanup")}
  },[content]);

  return h1({ class: "hero__title"}, content);
}


export const Button: Component<{onClick: () => void, text: string}> = ({onClick, text}) => {
  return button(
    { onClick }, 
    text
  )
}

