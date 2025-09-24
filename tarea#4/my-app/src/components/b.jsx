import React, {useState} from "react"; // Hooks
export default function Fun({a}) {
  let [i, s]=useState(0);
  return <div>
    <div>Asistance ({a}): {i}</div>
    <button onClick={()=>s(i+1)}>Add</button>
  </div>;
};