import React from "react";
import axios from "axios";
import SpriteText from "three-spritetext";
import ForceGraph3D from "react-force-graph-3d";
import { Link } from "react-router-dom";
import { handleNodesColour, handleLinksColour } from "../components/colours";
import "./example.css";

const darkmode = true;

function GraphExample(props) {
  const [graph, setGraph] = React.useState({ nodes: [], links: [] });

  React.useEffect(() => handleApiPostQueryList(props.query), []);

  const handleApiPostQueryList = async (query) => {
    var data = {
      statements: query.map((ele) => {
        return {
          statement: ele,
        };
      }),
    };

    const result = await axios
      .post("http://192.168.100.214:9002/multiquery", data)
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
  return (
    <div className="GraphExample">
      <span className="Spann">{props.title}</span>
      <ForceGraph3D
        width={900}
        height={500}
        graphData={graph}
        nodeLabel="id"
        backgroundColor={darkmode ? "#000000" : "#ffffff"}
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
          sprite.color = node.color;
          sprite.textHeight = 6;
          return sprite;
        }}
      ></ForceGraph3D>
    </div>
  );
}

export default function GraphExamples(ls) {
  return (
    <>
    <Link to="/">Back to homepage</Link> |{" "}
      {ls.map((ele) => (
        <GraphExample key={ele.uid} query={ele.query} title={ele.title}></GraphExample>
      ))}
    <Link to="/">Back to homepage</Link> |{" "}
    </>
  );
}
