import React from "react";
import axios from "axios";
import SpriteText from "three-spritetext";
import ForceGraph3D from "react-force-graph-3d";
import Queries from "./select";
import ListPoints from "./listpoints";
import Locate from "./locate";
import "./graph3D.css";

const callback = (prevProps, nextProps) => {
  //console.log(prevProps.graphdata.nodes.length === nextProps.graphdata.nodes.length);
  //console.log(prevProps.graphdata.links.length === nextProps.graphdata.links.length);
  if (prevProps.darkmode !== nextProps.darkmode) {
    return false;
  };
  if (prevProps.searchpath.length !== nextProps.searchpath.length) {
    return false;
  }
  if (
    prevProps.graphdata.nodes.length === nextProps.graphdata.nodes.length &&
    prevProps.graphdata.links.length === nextProps.graphdata.links.length
  ) {
    return true;
  }
  return false;
};

const Graph3D = React.memo((props) => {
  //console.log("Graph3D re-render");
  const fgRef = React.useRef();
  const [isDisabled, setDisabled] = React.useState(false);

  const delay = 1000;

  React.useEffect(() => {
    //console.log("Graph3D useEffect");
    if (isDisabled) {
      const handle = setTimeout(() => {
        setDisabled(false);
      }, delay);
      return () => clearTimeout(handle);
    }
  }, [isDisabled, delay]);

  const handleClick = React.useCallback(
    (nodes, search) => () => {
      //console.log(search);
      var node = { name: search };
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === search) {
          node = nodes[i];
          const distance = 40;
          const distRatio = 2 + distance / Math.hypot(node.x, node.y, node.z);
          fgRef.current.cameraPosition(
            {
              x: node.x * distRatio,
              y: node.y * distRatio,
              z: node.z * distRatio,
            },
            node,
            2500
          );
          break;
        }
      }
    },
    [fgRef]
  );

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
        props.handleSetGraph1(ls, name, result)
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
          props.handleSetGraph2(ls, name, result);
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
        props.handleSetGraph3(result2)
        return response.data;
      });
  };

  return (
    <>
      <Locate handleClick={handleClick} graphdata={props.graphdata}></Locate>
      <div className="row">
        <div className="Forcegraph3D">
          <ForceGraph3D
            ref={fgRef}
            width={900}
            height={500}
            graphData={props.graphdata}
            nodeLabel="id"
            backgroundColor={props.darkmode ? "#000000" : "#ffffff"}
            nodeAutoColorBy="group"
            linkDirectionalArrowLength={5}
            linkDirectionalArrowRelPos={0.9}
            onNodeDragEnd={(node) => {
              node.fx = node.x;
              node.fy = node.y;
              node.fz = node.z;
            }}
            linkCurvature={0}
            linkWidth={1.0}
            linkThreeObjectExtend={true}
            linkThreeObject={(link) => {
              const sprite = new SpriteText(`${link.name}`);
              sprite.color = "lightgrey";
              sprite.textHeight = 3;
              return sprite;
            }}
            linkPositionUpdate={(sprite, { start, end }) => {
              const middlePos = Object.assign(
                ...["x", "y", "z"].map((c) => ({
                  [c]: start[c] + (end[c] - start[c]) / 1.7,
                }))
              );
              Object.assign(sprite.position, middlePos);
            }}
            nodeThreeObject={(node) => {
              const sprite = new SpriteText(node.id);
              sprite.color =
                props.searchpath[props.searchpath.length - 1] === node.id
                  ? props.darkmode
                    ? "#ffffff"
                    : "#000000"
                  : node.color;
              sprite.textHeight =
                props.searchpath[props.searchpath.length - 1] === node.id
                  ? 18
                  : 6;
              return sprite;
            }}
            onNodeClick={(node) =>
              handleClick(props.graphdata.nodes, node.id)()
            }
            onNodeRightClick={(node) => {
              handleNodeClick(node.id, props.graphdata.nodes);
              return node.id;
            }}
          ></ForceGraph3D>
        </div>
        <div className="Query">
          <ListPoints></ListPoints>
          <Queries
            searchpath={props.searchpath}
            handleClick={handleClick}
            nodes={props.graphdata.nodes}
            handleSearchpath={props.handleSearchpath}
          ></Queries>
        </div>
      </div>
    </>
  );
}, callback);

export default Graph3D;
