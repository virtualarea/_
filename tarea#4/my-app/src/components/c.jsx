export default function Obj({a}) { // JSON
  let {id, name}=a;
  return <div>
    <div>{id}: {name}</div>
  </div>;
};