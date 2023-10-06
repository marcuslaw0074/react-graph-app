import React from "react";
import axios from "axios";
import { handleNodesColour } from "./colours";

class Search extends React.Component {
  state = {
    search: "",
  };

  handleApiPostSearchNew = async (name, ls) => {
    //console.log(this.props);
    const limit = 3;
    var list = ls.map((ele) => ele.id);
    if (list.includes(name)) {
      return list;
    }
    var result = await axios
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
        return result;
      });
    ls = [
      ...result.map((ele) => {
        return ele[0];
      }),
      ...result.map((ele) => {
        return ele[2];
      }),
    ];
    //console.log(this.props);
    var ls2 = this.props.graph.nodes.map((ele) => ele.id);
    var ls3 = this.props.graph.links.map((ele) => {
      return {
        source: ele.source.id,
        target: ele.target.id,
        name: ele.name,
      };
    });
    this.props.handleApiUpdateGraph({
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
  };

  shouldComponentUpdate = (graph, search) => {
    if (this.state.search !== search.search) {
      console.log("Search re-render");
      return true;
    }
    return false;
  };
  componentDidUpdate = () => {};

  render() {
    return (
      <>
        <form className="MyForm1">
          <label>
            <input
              type="text"
              value={this.state.search}
              onChange={(e) => this.setState({ search: e.target.value })}
            />
          </label>
        </form>
        <button
          className="Button1"
          onClick={() => {
            this.handleApiPostSearchNew(
              this.state.search,
              this.props.graph.nodes
            );
            this.setState({ search: "" });
          }}
        >
          Search
        </button>
      </>
    );
  }
}

export default Search;
