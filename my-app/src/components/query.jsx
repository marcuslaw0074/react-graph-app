import React from "react";

const Cypher = React.memo((props) => {
  //console.log("Cypher re-render!")
  const [query, setQuery] = React.useState(
    "match (p)-[r]->(m) return p,r,m limit 100"
  );
  return (
    <>
      <form className="MyForm1">
        <label>
          Query (Cypher):
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </form>
      <button className="Button1" onClick={() => props.handleApiPostQuery(query)}>
        Query
      </button>
    </>
  );
}, () => true)

export default Cypher;
