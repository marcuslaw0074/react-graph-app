import React from 'react';

function Addtriples(props) {
  return (
    <form className="MyForm1">
      <label>
        {"New node 1"}
        <input
          type="text"
          value={props.source}
          onChange={(e) => props.handleAddSource(e.target.value)}
        />
      </label>
      <label>
        {"New relationship"}
        <input
          type="text"
          value={props.target}
          onChange={(e) => props.handleAddTarget(e.target.value)}
        />
      </label>
      <label>
        {"New node 2"}
        <input
          type="text"
          value={props.name}
          onChange={(e) => props.handleAddName(e.target.value)}
        />
      </label>
    </form>
  );
}

export default Addtriples;