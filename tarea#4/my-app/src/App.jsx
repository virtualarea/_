import React from "react"; // código resumido
import Abs from "./components/a";
import Fun from "./components/b";
import Obj from "./components/c";
export default function App() {
  let l=[{id: 1, name: "A"}, {id: 2, name: "B"}, {id: 3, name: "C"}];
  return <div>
    <Abs a="name" b="Alex" />
    <br />
    <Fun a="Alex" />
    <br />
    <div>list:</div>
    {l.map((a)=><Obj a={a} />)}
  </div>;
};