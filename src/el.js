import curry from "./curry.js";

const createElement = curry((tag, attr, children) => {
  const element = document.createElement(tag);

  Object.entries(attr).forEach(([key, val]) => element.setAttribute(key, val));

  if (Array.isArray(children)) {
    children.forEach(child => element.appendChild(child));
  } else if (children instanceof Node) {
    element.appendChild(children);
  } else {
    const text = document.createTextNode(children.toString());

    element.appendChild(text);
  }

  return element;
});

export default createElement;
