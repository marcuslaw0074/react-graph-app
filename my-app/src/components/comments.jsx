/*const data = {
  nodes: [
    { id: 'AHU-19-01.R.A._CO2_Concentration.Value' },
    { id: 'AHU_Return_Air_CO2_Concentration' },
    { id: 'AHU-19-01' },
    { id: 'AHU-40-02.R.A._CO2_Concentration.Value' },
    { id: 'AHU-14-01.R.A._CO2_Concentration.Value' },
    { id: 'AHU-28-01.R.A._CO2_Concentration.Value' }
  ],
  links: [
    {
      source: 'AHU-19-01.R.A._CO2_Concentration.Value',
      target: 'AHU-19-01',
      name: "isPartOf"
    },
    {
      source: 'AHU-19-01.R.A._CO2_Concentration.Value',
      target: 'AHU_Return_Air_CO2_Concentration',
      name: "hasPoint"
    },
    {
      source: 'AHU_Return_Air_CO2_Concentration',
      target: 'AHU-40-02.R.A._CO2_Concentration.Value',
      name: "hasPoint"
    },
    {
      source: 'AHU_Return_Air_CO2_Concentration',
      target: 'AHU-14-01.R.A._CO2_Concentration.Value',
      name: "hasPoint"
    },
    {
      source: 'AHU_Return_Air_CO2_Concentration',
      target: 'AHU-28-01.R.A._CO2_Concentration.Value',
      name: "hasPoint"
    }
  ]
};*/

// handleNodeClick
/*console.log({
  nodes: [
    ...graph.nodes,
    ...[...new Set(ls)].map((ele) => {
      if (ele !== name) {
        return { id: ele, color: handleNodesColor(ele) };
      } else {
        return;
      }
    }),
  ].filter((n) => n),
  links: [
    ...graph.links,
    ...result2.map((ele) => {
      return { source: ele[0], target: ele[2], name: ele[1] };
    }),
  ],
});*/

/*
1. 
AHU
hasFDDtest
FDD_AHU_test

1.
FDD_AHU_S.A_R.A_Temp_Test
isPartOf
FDD_AHU_test

2.
FDD_AHU_CO2_Test
isPartOf
FDD_AHU_test

3.
FDD_AHU_S.A_SP_Temp_Test
isPartOf
FDD_AHU_test

4.
FDD_AHU_FL_SP_Test
isPartOf
FDD_AHU_test

5.
FDD_AHU_CO2_SP_Test
isPartOf
FDD_AHU_test

6.
FDD_AHU_S.A_R.A_FL_Temp_Test
isPartOf
FDD_AHU_test

1.
FDD_AHU_S.A_R.A_Temp_Test
hasPoint
AHU_Supply_Air_Temperature,
AHU_Return_Air_Temperature

2.
FDD_AHU_CO2_Test
hasPoint
AHU_Return_Air_CO2_Concentration

3.
FDD_AHU_S.A_SP_Temp_Test
hasPoint
AHU_Supply_Air_Temperature,
AHU_Supply_Air_Temperature_Setpoint,
AHU_Supply_Air_Flowrate

*/

/* handleNodeClick !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var query = `match (m)-[r]->(p) where m.name="${name}" and p.name in ${JSON.stringify(
        list
      )} return m,r,p limit ${limit}`;
      const result4 = await axios
        .post("http://192.168.100.214:9002/graphdb", { query: query })
        .then(function (response) {
          //console.log(response.data.data.sysA[0].subsystemA[0].subsystemA[0].equipmentA[0].equipmentnameA[0].allparametersA);
          //return response.data.data.sysA[0].subsystemA[0].subsystemA[0].equipmentA[0].equipmentnameA[0].allparametersA
          //console.log(response.data)
          var result2 = response.data;
          var ls = [
            ...result2.map((ele) => {
              return ele[0];
            }),
            ...result2.map((ele) => {
              return ele[2];
            }),
          ];
          setGraph((graph) => {
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

    console.log(result4);*/


/**
import "./App.css";
import React from "react";
import axios from "axios";
import { handleNodesColour, handleLinksColour } from "./Components/colours";
import Graph3D from "./Components/graph3D";
import Addtriples from "./Components/addTriple";
import { SearchAPI } from "./Components/searchApi";
import TestButton from "./Components/testAPI";
import ListPoints from "./Components/listpoints";

function App() {
  const [graph, setGraph] = React.useState({ nodes: [], links: [] });
  const [query, setQuery] = React.useState(
    "match (p)-[r]->(m) return p,r,m limit 100"
  );
  const [addnodes, setAddnodes] = React.useState("");
  const [addtriples, setAddtriples] = React.useState({
    source: "",
    target: "",
    name: "",
  });
  const [newgraph, setNewgraph] = React.useState({ nodes: [], links: [] });
  const [showaddnodes, setShowaddnodes] = React.useState(true);
  const [showaddtriples, setShowaddtriples] = React.useState(false);

  const handleUpdateGraph = (graph) => {
    setGraph(graph);
  };

  const handleShowAddnodes = () => {
    setShowaddnodes(true);
    setShowaddtriples(false);
  };

  const handleShowAddtriples = () => {
    setShowaddtriples(true);
    setShowaddnodes(false);
  };

  const handleAddsource = (newsource) => {
    setAddtriples((graph) => {
      return { source: newsource, target: graph.target, name: graph.name };
    });
  };

  const handleAddtarget = (newtarget) => {
    setAddtriples((graph) => {
      return { source: graph.source, target: newtarget, name: graph.name };
    });
  };

  const handleAddname = (newname) => {
    setAddtriples((graph) => {
      return { source: graph.source, target: graph.target, name: newname };
    });
  };

  const handleClearGraph = () => {
    setGraph({ nodes: [], links: [] });
  };

  const handleClearNewgraph = () => {
    setNewgraph({ nodes: [], links: [] });
    setGraph({ nodes: [], links: [] });
  };

  const handleApiPostQuery = async (query) => {
    const result = await axios
      .post("http://192.168.100.214:9002/graphdb", { query: query })
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
          color: handleLinksColour(),
        };
      }),
    });
    return result;
  };

  const handleAddNodes = (node) => {
    setGraph((graph) => {
      return {
        nodes: [...graph.nodes, { id: node, color: "#ce7e23" }],
        links: graph.links,
      };
    });
    return node;
  };

  const handleAddTriple = (s, p, o) => {
    if (
      graph.nodes.map((ele) => ele.id).includes(s) &&
      graph.nodes.map((ele) => ele.id).includes(o)
    ) {
      setGraph((graph) => {
        return {
          nodes: graph.nodes,
          links: [...graph.links, { source: s, target: o, name: p }],
        };
      });
    } else if (graph.nodes.map((ele) => ele.id).includes(s)) {
      setGraph((graph) => {
        return {
          nodes: [...graph.nodes, { id: o, color: "#ce7e23" }],
          links: [...graph.links, { source: s, target: o, name: p }],
        };
      });
    } else if (graph.nodes.map((ele) => ele.id).includes(o)) {
      setGraph((graph) => {
        return {
          nodes: [...graph.nodes, { id: s, color: "#ce7e23" }],
          links: [...graph.links, { source: s, target: o, name: p }],
        };
      });
    } else {
      setGraph((graph) => {
        return {
          nodes: [
            ...graph.nodes,
            { id: s, color: "#ce7e23" },
            { id: o, color: "#ce7e23" },
          ],
          links: [...graph.links, { source: s, target: o, name: p }],
        };
      });
    }
    if (
      newgraph.nodes.map((ele) => ele.id).includes(s) &&
      newgraph.nodes.map((ele) => ele.id).includes(o)
    ) {
      setNewgraph((graph) => {
        return {
          nodes: graph.nodes,
          links: [...graph.links, { source: s, target: o, name: p }],
        };
      });
    } else if (newgraph.nodes.map((ele) => ele.id).includes(s)) {
      setNewgraph((graph) => {
        return {
          nodes: [...graph.nodes, { id: o, color: "#ce7e23" }],
          links: [...graph.links, { source: s, target: o, name: p }],
        };
      });
    } else if (newgraph.nodes.map((ele) => ele.id).includes(o)) {
      setNewgraph((graph) => {
        return {
          nodes: [...graph.nodes, { id: s, color: "#ce7e23" }],
          links: [...graph.links, { source: s, target: o, name: p }],
        };
      });
    } else {
      setNewgraph((graph) => {
        return {
          nodes: [
            ...graph.nodes,
            { id: s, color: "#ce7e23" },
            { id: o, color: "#ce7e23" },
          ],
          links: [...graph.links, { source: s, target: o, name: p }],
        };
      });
    }
    setAddtriples({ source: "", target: "", name: "" });
  };

  const handleNodeClick = async (name, ls) => {
    console.log("Clicked");
    const limit = 6;
    var list = ls.map((ele) => ele.id);
    var data = {
      statements: [
        {
          statement: `match (p)-[r]->(m) where m.name="${name}" and not p.name in ${JSON.stringify(
            list
          )} return p,r,m limit ${limit}`,
        },
        {
          statement: `match (p)-[r]->(m) where p.name="${name}" and m.name in ${JSON.stringify(
            list
          )} return p,r,m limit ${limit}`,
        },
      ],
    };
    ,
        {statement: `match (p)-[r]->(m) where m.name="${name}" and p.name in ${JSON.stringify(
          list
        )} return p,r,m limit ${limit}`},
        {statement: `match (p)-[r]->(m) where p.name="${name}" and not m.name in ${JSON.stringify(
          list
        )} return p,r,m limit ${limit}`} 
    //const result = 
    await axios
      .post("http://192.168.100.214:9002/neo4j2", data)
      .then(function (response) {
        var result = response.data;
        setGraph((graph) => {
          var nodes = graph.nodes.map((ele) => ele.id);
          var graph_links = graph.links;
          
          var link_source = graph.links.map(ele => ele.source.id);
          var link_target = graph.links.map(ele => ele.target.id);
          var link_name = graph.links.map(ele => ele.name);


          var ls = [
            ...new Set([
              ...result.map((ele) => ele[0]),
              ...result.map((ele) => ele[2]),
              ...nodes,
            ]),
          ].map((ele) => {
            return {
              id: ele,
              color: handleNodesColour(ele),
            };
          });

          var ls_link = graph.links.map((ele) => {
            return {
              source: ele.source.id,
              target: ele.target.id,
              name: ele.name,
            };
          });

          var ls_lk = [];
          for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < graph_links.length; j++) {
              if (
                graph_links[j].source.id === result[i][0] &&
                graph_links[j].name === result[i][1] &&
                graph_links[j].target.id === result[i][2]
              ) {
              } else {
                ls_lk.push({
                  source: result[i][0],
                  target: result[i][2],
                  name: result[i][1],
                });
              }
            }
          }

          return {
            nodes: ls,
            links: [...ls_link, ...ls_lk],
          };

          
          var ls_links = [];
          var ls_nodes = [];
          var lsss = graph.nodes;
          for (let i=0; i< result.length; i++) {
            var link = {source:{id: result[i][0]}, target:{id:result[i][2]}, name:result[i][1]};
            var uu = 0;
            var ll = 0;
            for (let j=0; j< lsss.length; j++) {
              if (lsss[j].id == result[i][0]){
                link.source = lsss[j];
              } else {
                ll = ll + 1
              };
              if (lsss[j].id == result[i][2]){
                link.target = lsss[j];
              } else {
                uu = uu + 1
              };
            };
            ls_links.push(link);
            if (ll === lsss.length) {
              ls_nodes.push({id:result[i][0], color: handleNodesColour(result[i][0])})
            };
            if (uu === lsss.length) {
              ls_nodes.push({id:result[i][2], color: handleNodesColour(result[i][2])})
            };
          };
          
          return {
            nodes: [...graph.nodes, ...ls_nodes].map(ele => {
              return {
                id: ele.id,
                color:ele.color
              }
            }),
            links: [...graph.links, ...ls_links].map(ele => {
              return {
                source: ele.source.id,
                target: ele.target.id,
                name: ele.name
              }
            }
            )
          }
          
        });
        return response.data;
      });
  };

  const handleReload = () => {
    setGraph((graph) => {
      return {
        nodes: graph.nodes.map((ele) => {
          return { id: ele.id, color: ele.color };
        }),
        links: graph.links.map((ele) => {
          return {
            source: ele.source.id,
            target: ele.target.id,
            name: ele.name,
          };
        }),
      };
    });
  };

  return (
    <div className="App2">
      <span className="Span1">3D Graphs</span>
      <button
        className="Button1"
        onClick={() =>
          handleApiPostQuery("match (p:brick)-[r]->(m:brick) return p,r,m")
        }
      >
        Brick Model
      </button>
      <button
        className="Button1"
        onClick={() =>
          handleApiPostQuery(
            `match (p)-[r:subClassOf]->(m) where exists((p)-[:subClassOf*]->(:brick {name:'System'})) return p,r,m`
          )
        }
      >
        System
      </button>
      <button
        className="Button1"
        onClick={() =>
          handleApiPostQuery(
            `match (p)-[r:subClassOf]->(m) where exists((p)-[:subClassOf*]->(:brick {name:'Location'})) return p,r,m`
          )
        }
      >
        Location
      </button>
      <button
        className="Button1"
        onClick={() =>
          handleApiPostQuery(
            `match (p)-[r:isPartOf]->(m {name:"AHU"}) return p,r,m `
          )
        }
      >
        AHU
      </button>
      {false && (
        <button
          className="Button1"
          onClick={() =>
            handleApiPostQuery(
              `match (p)-[r:isPartOf]->(m {name:"VAV"}) return p,r,m `
            )
          }
        >
          VAV
        </button>
      )}
      <button
        className="Button1"
        onClick={() =>
          handleApiPostQuery(
            `match (p)-[r:isPartOf]->(m {name:"Chiller"}) return p,r,m `
          )
        }
      >
        Chiller
      </button>
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
      <button className="Button1" onClick={() => handleApiPostQuery(query)}>
        Query
      </button>
      <SearchAPI
        graph={graph}
        handleApiUpdateGraph={handleUpdateGraph}
      ></SearchAPI>
      <div className="row">
        <div className="Forcegraph3D">
          <Graph3D
            graphdata={graph}
            onHandleNodeClick={handleNodeClick}
          ></Graph3D>
          {false && (
            <span className="Span2">
              {JSON.stringify(graph.nodes.map((ele) => ele.id)) +
                JSON.stringify(
                  graph.links.map((ele) => {
                    return {
                      source: ele.source.id,
                      target: ele.target.id,
                      name: ele.name,
                    };
                  })
                )}
            </span>
          )}
        </div>
        <div className="Select1">
          <ListPoints></ListPoints>
          <div>
            <h2>Creating new nodes & relationship</h2>
            <div>
              <button onClick={handleShowAddnodes}>Add Nodes</button>
              <button onClick={handleShowAddtriples}>
                Add Nodes and Relationships
              </button>
            </div>
            {showaddnodes && (
              <>
                <form className="MyForm1">
                  <label>
                    Add nodes :
                    <input
                      type="text"
                      value={addnodes}
                      onChange={(e) => setAddnodes(e.target.value)}
                    />
                  </label>
                </form>
                <button onClick={() => handleAddNodes(addnodes)}>Create</button>
              </>
            )}
            {showaddtriples && (
              <>
                <Addtriples
                  source={addtriples.source}
                  target={addtriples.target}
                  name={addtriples.name}
                  handleAddSource={handleAddsource}
                  handleAddName={handleAddname}
                  handleAddTarget={handleAddtarget}
                ></Addtriples>
                <button
                  className="Button1"
                  onClick={() =>
                    handleAddTriple(
                      addtriples.source,
                      addtriples.target,
                      addtriples.name
                    )
                  }
                >
                  Create
                </button>
              </>
            )}
            <div>
              <button
                className="Button1"
                onClick={() => handleUpdateGraph(newgraph)}
              >
                Show new graph
              </button>
              <button className="Button1" onClick={handleClearGraph}>
                Clear graph
              </button>
              <button
                className="Button1"
                onClick={() => handleClearNewgraph(newgraph)}
              >
                Clear new graph
              </button>
              <button className="Button1" onClick={handleReload}>
                Reload
              </button>
              {false && <TestButton></TestButton>}
            </div>

            {false && JSON.stringify(addtriples)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;



 */