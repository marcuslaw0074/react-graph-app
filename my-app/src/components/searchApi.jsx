import React from "react";
import axios from "axios";
import { handleNodesColour } from "./colours";

function SearchApi(props) {
  console.log("SearchApi ")
  const [search, setSearch] = React.useState("");

  console.log("SearchApi");

  const handleApiPostSearchNew = async (name, ls) => {
    const limit = 3;
    var list = ls.map((ele) => ele.id);
    if (list.includes(name)) {
      return list;
    }
    await axios
      .post("http://localhost:9002/multiquery", {
        statements: [
          {
            statement: `match (p)-[r]->(m) where m.name="${name}" and p.name in ${JSON.stringify(
              list
            )} return p,r,m limit ${limit}`,
          },
          {
            statement: `match (p)-[r]->(m) where m.name="${name}" return p,r,m limit ${limit}`,
          },
          {
            statement: `match (p)-[r]->(m) where p.name="${name}" and m.name in ${JSON.stringify(
              list
            )} return p,r,m limit ${limit}`,
          },
          {
            statement: `match (p)-[r]->(m) where p.name="${name}" return p,r,m limit ${limit}`,
          },
        ],
      })
      .then(function (response) {
        var result = response.data;
        console.log(response.data);
        var ls = [
          ...result.map((ele) => {
            return ele[0];
          }),
          ...result.map((ele) => {
            return ele[2];
          }),
        ];
        var ls2 = props.graph.nodes.map((ele) => ele.id);
        var ls3 = props.graph.links.map((ele) => {
          return {
            source: ele.source.id,
            target: ele.target.id,
            name: ele.name,
          };
        });
        props.handleApiUpdateGraph({
          nodes: [...new Set([...ls, ...ls2])]
            .map((ele) => {
              return { id: ele, color: handleNodesColour(ele) };
            })
            .filter((n) => n),
          links: [
            ...ls3,
            ...result.map((ele) => {
              return { source: ele[0], target: ele[2], name: ele[1] };
            }),
          ],
        });

        return response.data;
      });
  };

  return (
    <>
      <form className="MyForm1">
        <label>
          Search :
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </form>
      <button
        className="Button1"
        onClick={() => {
          handleApiPostSearchNew(search, props.graph.nodes);
        }}
      >
        Search
      </button>
    </>
  );
}

export const SearchAPI = SearchApi;
