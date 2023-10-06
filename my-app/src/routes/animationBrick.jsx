import React from "react";
import data from "./data";
import ForceGraph3D from "react-force-graph-3d";
import SpriteText from "three-spritetext";
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

const floorList = [...Array(100).keys()].map((ele) => {
  if (`${ele}F`.length === 2) {
    return `0${ele}F`;
  } else {
    return `${ele}F`;
  }
});

const floorList2 = [...Array(9).keys()].map((ele) => {
  return `B${ele}F`;
});


function handleNodesColour(st) {
  if (st.includes('Test')) {
    return "#f821a2";
  };
  if (["Chiller_CoP", "Chilled_Chilled_Water_Pump_Delta_Temperature", "CT_Approach_Temperature", "CT_Wet_Bulb", "Virtual_Point", "Chiller_Cooling_Load"].includes(st)) {
    return "#f821a2";
  };
  if ([...floorList, ...floorList2].includes(st)) {
    return "#f821a2";
  }
  if (/\d/.test(st.replace("CO2", ""))) {
    if (st.length > 15) {
      return "#00f7da";
    };
    if (st.includes("VIP")) {
      return "#af4c66";
    };
    return "#00f7da";
  } else {
    if (st.includes("System") || ['Location', 'Room', 'Zone', 'Building', 'Floor', 'Class'].includes(st)) {
      return "#f821a2";
    } else if (
      [
        "AHU",
        "VAV",
        "PAU",
        "FCU",
        "EAF",
        "FAF",
        "WCC",
        "Chiller",
        "Condenser_Water_Pump",
        "Cooling_Tower",
        "Chilled_Water_Pump",
        "EnergySys_AHU",
        "EnergySys_WCC",
      ].includes(st)
    ) {
      return "#f821a2";
    }
    return "#f821a2";
  }
}


const CameraOrbitBrick = () => {
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

export default CameraOrbitBrick;

