import React from "react";
import data from "./data";
import ForceGraph3D from "react-force-graph-3d";
import SpriteText from "three-spritetext";
import { handleNodesColour } from "../components/colours";
import { Link } from "react-router-dom";

const getData = (data) => {
  var nodesnamelist = [
    ...data.map((ele) => ele[0]),
    ...data.map((ele) => ele[2]),
  ];
  var nodelist = [...new Set(nodesnamelist)].map((ele) => {
    return {
      id: ele,
      color: handleNodesColour(ele),
    };
  });
  var linklist = data.map((ele) => {
    return {
      source: ele[0],
      name: ele[1],
      target: ele[2],
    };
  });

  return {
    nodes: nodelist,
    links: linklist,
  };
};

const CameraOrbit = () => {
  const fgRef = React.useRef();

  const distance = 1200;
  React.useEffect(() => {
    fgRef.current.cameraPosition({ z: distance });

    // camera orbit
    let angle = 0;
    setInterval(() => {
      fgRef.current.cameraPosition({
        x: distance * Math.sin(angle),
        z: distance * Math.cos(angle),
      });
      angle += Math.PI / 300;
    }, 50);
  }, []);

  return (
    <>
      <Link to="/">Back to homepage</Link> |{" "}
      <ForceGraph3D
        ref={fgRef}
        graphData={getData(data)}
        enableNodeDrag={false}
        width={2000}
        height={1200}
        enableNavigationControls={false}
        showNavInfo={false}
        nodeAutoColorBy="group"
        nodeThreeObject={(node) => {
          const sprite = new SpriteText(node.id);
          sprite.color = node.color;
          sprite.textHeight = 10;
          return sprite;
        }}
      />
    </>
  );
};

export default CameraOrbit;
