import React from "react";

function Locate(props) {
  const [search, setSearch] = React.useState("System");

  const handleSearch = (newsearch) => {
    setSearch((search) => {
      //console.log(newsearch);
      return newsearch;
    });
  };

  const handleClear = () => {
    //console.log("clear")
    return setSearch("");
  }

  return (
    <>
      <label>
        <input
          type="text"
          value={props.addnodes}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </label>
      <button
        onClick={() => {props.handleClick(props.graphdata.nodes, search)(); handleClear()}}
        className="Button1"
      >
        Locate
      </button>
    </>
  );
};

export default Locate;
