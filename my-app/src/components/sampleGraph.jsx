import "./graph.css";
import React from "react";
import axios from "axios";
import { handleNodesColour, handleLinksColour } from "./colours";
import Graph3D from "./sampleGraph3D";
import Search from "./search";
import Cypher from "./query";
import "./graph.css";

const shouldGraphUpdate = (graph, prevGraph) => {
  //console.log(graph.nodes.length);
  //console.log(prevGraph.nodes.length);
  //console.log(graph.links.length === prevGraph.nodes.length);
  if (
    graph.nodes.length === prevGraph.nodes.length &&
    graph.links.length === prevGraph.links.length
  ) {
    //console.log("equal");
    return false;
  }
  //console.log("not equal");
  return true;
};

const useShouldGraphUpdate = (graph, shouldGraphUpdate) => {
  const [graphState, setGraphState] = React.useState(graph);
  const ref = React.useRef(graph);
  //console.info("graphState",graphState);
  //console.info("shouldGraphUpdate",shouldGraphUpdate);

  const handleRenderUpdate = (newgraph) => {
    if (typeof newgraph != "function") {
      //console.log(newgraph);
      //console.log(ref.current);

      if (shouldGraphUpdate(newgraph, ref.current)) {
        //console.log('updateee');
        setGraphState(newgraph);
      }

      ref.current = newgraph;
      //console.log("new graph");
    } else {
      //console.log("ref.current");
      //console.log(ref.current);
      const newvalue = newgraph(ref.current);
      //console.log(newvalue);

      if (shouldGraphUpdate(newvalue, ref.current)) {
        //console.log('updateee');
        setGraphState(newgraph);
      }
      ref.current = newvalue;
    }
  };
  //console.log(ref.current)
  return [graphState, handleRenderUpdate];
};

function SampleGraph() {
  //console.log("SampleGraph re-render");
  //console.log(typeof (()=> {}) == 'function')
  //const [graph, setGraph] = useShouldGraphUpdate({ nodes: [], links: [] }, shouldGraphUpdate);
  const [graph, setGraph] = React.useState({ nodes: [], links: [] });
  const [searchpath, setSearchpath] = React.useState({
    system: [],
    location: [],
    equipment: [],
    parameter: [],
  });
  //console.log(graph);

  //console.log(setGraph);

  const updateGraph = (graph) => {
    setGraph((prev) => {
      return graph
    });
  };

  const [darkmode, setDarkmode] = React.useState(true);
  const [isDisabled, setDisabled] = React.useState(false);

  React.useEffect(() => {
    //console.log("SampleGraph useEffect");
    handleApiGet();
  }, []);

  const delay = 1000;

  React.useEffect(() => {
    if (isDisabled) {
      const handle = setTimeout(() => {
        setDisabled(false);
      }, delay);
      return () => clearTimeout(handle);
    }
  }, [isDisabled, delay]);

  const handleSearchpath = (value) => {
    setSearchpath((prev) => {
      return {
        ...prev,
        ...value,
      };
    });
  };

  const handleSetGraph1 = (ls, name, result) => {
    setGraph((graph) => {
      //console.log("run 1");
      return {
        nodes: [
          ...graph.nodes,
          ...[...new Set(ls)].map((ele) => {
            if (ele !== name) {
              return { id: ele, color: handleNodesColour(ele) };
            } else {
              return null;
            }
          }),
        ].filter((n) => n),
        links: [
          ...graph.links,
          ...result.map((ele) => {
            return { source: ele[0], target: ele[2], name: ele[1] };
          }),
        ],
      };
    });
  };

  const handleSetGraph2 = (ls, name, result) => {
    setGraph((graph) => {
      //console.log("run 2");
      return {
        nodes: [
          ...graph.nodes,
          ...[...new Set(ls)].map((ele) => {
            if (ele !== name) {
              return { id: ele, color: handleNodesColour(ele) };
            } else {
              return null;
            }
          }),
        ].filter((n) => n),
        links: [
          ...graph.links,
          ...result.map((ele) => {
            return { source: ele[0], target: ele[2], name: ele[1] };
          }),
        ],
      };
    });
  };

  const handleSetGraph3 = (result2) => {
    setGraph((graph) => {
      //console.log("run 3");
      return {
        nodes: graph.nodes,
        links: [
          ...graph.links,
          ...result2.map((ele) => {
            return { source: ele[0], target: ele[2], name: ele[1] };
          }),
        ],
      };
    });
  };

  const handleDarkmode = () => {
    setDarkmode((prev) => {
      return !prev;
    });
    setGraph((graph) => {
      return {
        ...graph,
        links: graph.links.map((ele) => {
          return {
            ...ele,
            color: darkmode ? "#000000" : "#ffffff",
          };
        }),
      };
    });
  };

  const handleUpdateGraph = (graph) => {
    setGraph(graph);
  };

  const handleApiGet = async () => {
    const result = await axios
      .get("http://localhost:9002/")
      .then(function (response) {
        return response.data;
      });
    var ls = [
      ...result.map((ele) => {
        return ele[0];
      }),
      ...result.map((ele) => {
        return ele[2];
      }),
    ];
    setGraph({
      nodes: [...new Set(ls)].map((ele) => {
        return { id: ele, color: handleNodesColour(ele) };
      }),
      links: result.map((ele) => {
        return {
          source: ele[0],
          target: ele[2],
          name: ele[1],
          color: handleLinksColour(darkmode),
        };
      }),
    });
    return result;
  };

  const handleApiPostQuery = async (query) => {
    const result = await axios
      .post("http://localhost:9002/query", { query: query })
      .then(function (response) {
        return response.data;
      });
    var ls = [
      ...result.map((ele) => {
        return ele[0];
      }),
      ...result.map((ele) => {
        return ele[2];
      }),
    ];
    setGraph({
      nodes: [...new Set(ls)].map((ele) => {
        return { id: ele, color: handleNodesColour(ele) };
      }),
      links: result.map((ele) => {
        return {
          source: ele[0],
          target: ele[2],
          name: ele[1],
          color: handleLinksColour(darkmode),
        };
      }),
    });
    return result;
  };

  const handleApiPostQueryList = async (query) => {
    var data = {
      statements: query.map((ele) => {
        return {
          statement: ele,
        };
      }),
    };

    const result = await axios
      .post("http://localhost:9002/multiquery", data)
      .then(function (response) {
        return response.data;
      });
    var ls = [
      ...result.map((ele) => {
        return ele[0];
      }),
      ...result.map((ele) => {
        return ele[2];
      }),
    ];
    setGraph({
      nodes: [...new Set(ls)].map((ele) => {
        return { id: ele, color: handleNodesColour(ele) };
      }),
      links: result.map((ele) => {
        return {
          source: ele[0],
          target: ele[2],
          name: ele[1],
          color: handleLinksColour(darkmode),
        };
      }),
    });
    return result;
  };

  const handleNodeClick = async (name, ls) => {
    console.log("Clicked");
    if (isDisabled) {
      return;
    }
    setDisabled(true);
    const limit = 5;
    var list = ls.map((ele) => ele.id);
    var query = `match (p)-[r]->(m) where m.name="${name}" and not p.name in ${JSON.stringify(
      list
    )} return p,r,m limit ${limit}`;
    const result = await axios
      .post("http://localhost:9002/query", { query: query })
      .then(function (response) {
        var result = response.data;
        var ls = [
          ...result.map((ele) => {
            return ele[0];
          }),
          ...result.map((ele) => {
            return ele[2];
          }),
        ];
        setGraph((graph) => {
          //console.log("run 1");
          return {
            nodes: [
              ...graph.nodes,
              ...[...new Set(ls)].map((ele) => {
                if (ele !== name) {
                  return { id: ele, color: handleNodesColour(ele) };
                } else {
                  return null;
                }
              }),
            ].filter((n) => n),
            links: [
              ...graph.links,
              ...result.map((ele) => {
                return { source: ele[0], target: ele[2], name: ele[1] };
              }),
            ],
          };
        });
        return response.data;
      });

    if (result.length < 1) {
      query = `match (m)-[r]->(p) where m.name="${name}" and not p.name in ${JSON.stringify(
        list
      )} return m,r,p limit ${limit}`;
      await axios
        .post("http://localhost:9002/query", { query: query })
        .then(function (response) {
          var result = response.data;
          var ls = [
            ...result.map((ele) => {
              return ele[0];
            }),
            ...result.map((ele) => {
              return ele[2];
            }),
          ];
          setGraph((graph) => {
            //console.log("run 2");
            return {
              nodes: [
                ...graph.nodes,
                ...[...new Set(ls)].map((ele) => {
                  if (ele !== name) {
                    return { id: ele, color: handleNodesColour(ele) };
                  } else {
                    return null;
                  }
                }),
              ].filter((n) => n),
              links: [
                ...graph.links,
                ...result.map((ele) => {
                  return { source: ele[0], target: ele[2], name: ele[1] };
                }),
              ],
            };
          });
          return response.data;
        });
    }

    query = `match (p)-[r]->(m) where m.name="${name}" and p.name in ${JSON.stringify(
      list
    )} return p,r,m limit ${limit}`;
    await axios
      .post("http://localhost:9002/query", { query: query })
      .then(function (response) {
        var result2 = response.data;
        setGraph((graph) => {
          //console.log("run 3");
          return {
            nodes: graph.nodes,
            links: [
              ...graph.links,
              ...result2.map((ele) => {
                return { source: ele[0], target: ele[2], name: ele[1] };
              }),
            ],
          };
        });
        return response.data;
      });
  };

  const handleLoadSavedGraph = async () => {
    axios
      .post("http://localhost:9002/redis/graph", { number: 1 })
      .then((res) => {
        return res.data;
      })
      .then((res) => {
        return res.data;
      })
      .then((res) => {
        console.log(res);
        setGraph((graph) => res);
      });
  };

  return (
    <div
      className="App2"
      style={{ backgroundColor: "#ffffff", 
      height: "1400px",
      backgroundImage:"linear-gradient(90deg, #74EBD5 0%, #9FACE6 100%)" 
    }}
    >
      {/* <span className="Span1">3D Graphs</span> */}
      <button
        className="Button1"
        onClick={() =>
          handleApiPostQueryList([
            `match (p)-[r:subClassOf]->(m)  return p,r,m`,
            // `match (p)-[r:isPartOf]->(y)-[:subClassOf*]->(d{name:"System"}) return p,r,y`,
            // `match  (w)-[q:isPartOf]->(p)-[r:isPartOf]->(y)-[:subClassOf*]->(d{name:"System"}) return w,q,p`,
          ])
        }
      >
        Brick Model
      </button>
      <button onClick={handleLoadSavedGraph}>Load Saved Graph</button>
      {false && <Cypher handleApiPostQuery={handleApiPostQuery}></Cypher>}
      {false && (
        <Search graph={graph} handleApiUpdateGraph={handleUpdateGraph}></Search>
      )}
      {false && (
        <button className="Mode" onClick={handleDarkmode}>
          {darkmode ? "LightMode" : "DarkMode"}
        </button>
      )}
      {/* <button>HAHA</button> */}
      <Graph3D
        graphdata={graph}
        handleSetGraph1={handleSetGraph1}
        handleSetGraph2={handleSetGraph2}
        handleSetGraph3={handleSetGraph3}
        updateGraph={updateGraph}
        searchpath={[
          ...searchpath.system,
          ...searchpath.location,
          ...searchpath.equipment,
          ...searchpath.parameter,
        ]}
        handleSearchpath={handleSearchpath}
        darkmode={darkmode}
      ></Graph3D>
    </div>
  );
}

export default SampleGraph;
