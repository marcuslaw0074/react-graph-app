import React from "react";
import axios from "axios";
import SpriteText from "three-spritetext";
import ForceGraph3D from "react-force-graph-3d";
import Queries from "./select";
import ListPoints from "./listpoints";
import Locate from "./locate";
import { Link } from "react-router-dom";
import "./graph3D.css";
import "./sampleGraph3D.css";
import dateFormat from "dateformat";
import JsonEditor from "./jsonEditer";
import { Object3D } from "three";
import { floorLists, floorLists2, handleNodesColour } from "./colours";
import {
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  // RadarChart,
  // MapChart,
  TreeChart,
  // TreemapChart,
  // GraphChart,
  // GaugeChart,
  // FunnelChart,
  // ParallelChart,
  // SankeyChart,
  BoxplotChart,
  // CandlestickChart,
  // EffectScatterChart,
  LinesChart,
  // HeatmapChart,
  // PictorialBarChart,
  // ThemeRiverChart,
  // SunburstChart,
  // CustomChart,
} from "echarts/charts";

import ReactEChartsCore from "echarts-for-react/lib/core";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts/core";
import {
  // GridSimpleComponent,
  GridComponent,
  // PolarComponent,
  // RadarComponent,
  // GeoComponent,
  // SingleAxisComponent,
  // ParallelComponent,
  // CalendarComponent,
  // GraphicComponent,
  // ToolboxComponent,
  TooltipComponent,
  // AxisPointerComponent,
  // BrushComponent,
  TitleComponent,
  // TimelineComponent,
  // MarkPointComponent,
  // MarkLineComponent,
  // MarkAreaComponent,
  // LegendComponent,
  // LegendScrollComponent,
  // LegendPlainComponent,
  // DataZoomComponent,
  // DataZoomInsideComponent,
  // DataZoomSliderComponent,
  // VisualMapComponent,
  // VisualMapContinuousComponent,
  // VisualMapPiecewiseComponent,
  // AriaComponent,
  // TransformComponent,
  DatasetComponent,
} from "echarts/components";
// Import renderer, note that introducing the CanvasRenderer or SVGRenderer is a required step
import {
  CanvasRenderer,
  // SVGRenderer,
} from "echarts/renderers";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
]);

var option = {
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: "line",
      smooth: true,
    },
  ],
};
const test = `
background-color: #74EBD5;
background-image: linear-gradient(90deg, #74EBD5 0%, #9FACE6 100%);

`;

const gradientList = [
  {
    backgroundColor: "#4158D0",
    backgroundImage:
      "linear-gradient(43deg, #4158D0 0%, #C850C0 30%, #FFCC70 66%)",
  },
  {
    backgroundColor: "#FF3CAC",
    backgroundImage:
      "linear-gradient(225deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%)",
  },
  {
    backgroundColor: "#74EBD5",
    backgroundImage: "linear-gradient(90deg, #74EBD5 0%, #9FACE6 100%)",
  },
  "linear-gradient(to right, rgb(25, 22, 84), rgb(67, 198, 172)",
  "linear-gradient(to right, #8C366C, #6E64E7)",
];

function MyForm(props) {
  const [textarea, setTextarea] = React.useState(
    JSON.stringify(
      {
        nodes: props.graph.nodes.map((ele) => {
          return {
            id: ele.id,
            color: handleNodesColour(ele.id),
          };
        }),
        links: props.graph.links.map((ele) => {
          return {
            target: ele.target.id,
            source: ele.source.id,
            name: ele.name,
          };
        }),
      } || { nodes: [], links: [] }
    )
  );

  const handleChange = (event) => {
    setTextarea(event.target.value);
  };
  const handleSubmit = () => {
    console.log(textarea);
    var res;
    try {
      res = JSON.parse(textarea);
      props.onSubmit(res);
      props.setPopUp();
      return;
    } catch (e) {
      console.log(e);
      alert("HAHA, you failed to edit the graph!!!!");
    }
  };

  return (
    <>
      <button onClick={handleSubmit}>Submit</button>
      <form>
        <textarea value={textarea} onChange={handleChange} style={{width: "800px", height: "500px"}}/>
      </form>
    </>
  );
}

function handleNodesShape(st) {
  if (st.includes("Test")) {
    return false;
  }
  if (st.includes("FDD")) {
    return true;
  }
  if (st.includes("Virtual")) {
    return true;
  }
  if (
    [
      "Chiller_CoP",
      "Chilled_Chilled_Water_Pump_Delta_Temperature",
      "CT_Approach_Temperature",
      "CT_Wet_Bulb",
      "Virtual_Point",
      "Chiller_Cooling_Load",
    ].includes(st)
  ) {
    return false;
  }
  if ([...floorLists, ...floorLists2].includes(st)) {
    return true;
  }
  if (/\d/.test(st.replace("CO2", ""))) {
    if (st.length > 15) {
      return false;
    }
    if (st.includes("VIP")) {
      return false;
    }
    return true;
  } else {
    if (
      st.includes("System") ||
      [
        "Location",
        "Room",
        "Zone",
        "Building",
        "Floor",
        "Class",
        "Points",
        "Status",
        "Sensor",
        "Setpoint",
        "Outdoor_Area",
        "SCBB",
      ].includes(st)
    ) {
      return true;
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
      return true;
    }
    return false;
  }
}

const callback = (prevProps, nextProps) => {
  //console.log(prevProps.graphdata.nodes.length === nextProps.graphdata.nodes.length);
  //console.log(prevProps.graphdata.links.length === nextProps.graphdata.links.length);
  if (prevProps.darkmode !== nextProps.darkmode) {
    return false;
  }
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
  const [showQuery, setShowQuery] = React.useState(true);
  const [timeseries, setTimeseries] = React.useState([]);
  const [optionGraph, setOptionGraph] = React.useState([]);
  const [hoverNode, setHoverNode] = React.useState(false);
  const [popUp, setPopUp] = React.useState(false);
  // const Graph = React.useRef(props.graphdata);
  // const [mousePosition, setMousePosition] = React.useState({x:0, y:0})

  // const hoverNode = React.useRef(false);

  const mousePosition = React.useRef({ x: 0, y: 0 });

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

  React.useEffect(() => {
    const handleHover = (event) => {
      // console.log(event.screenX, event.screenY);
      mousePosition.current = { x: event.screenX, y: event.screenY };
    };
    const relativeCoords = (event) => {
      var bounds = event.target.getBoundingClientRect();
      var x = event.clientX - bounds.left;
      var y = event.clientY - bounds.top;
      // console.log(x, y);
      mousePosition.current = { x: x, y: y };
    };
    window.addEventListener("mousemove", relativeCoords);
    return () => {
      window.removeEventListener("mousemove", relativeCoords);
    };
  }, [hoverNode]);

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
            2000
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
        props.handleSetGraph1(ls, name, result);
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
        props.handleSetGraph3(result2);
        return response.data;
      });
  };

  const handleSaveGraph = async (data) => {
    // console.log(data)
    const graph = {
      nodes: data.nodes.map((ele) => {
        return {
          id: ele.id,
          color: handleNodesColour(ele.id),
        };
      }),
      links: data.links.map((ele) => {
        return {
          target: ele.target.id,
          source: ele.source.id,
          name: ele.name,
        };
      }),
    };
    console.log(graph);
    axios.post("http://localhost:9002/redis", { data: graph });
  };

  const handlePopUp = () => {
    setPopUp((prev) => !prev)
  };

  // console.log("render")
  console.log(hoverNode);
  console.log(mousePosition.current);
  return (
    <>
      {true && (
        <Locate handleClick={handleClick} graphdata={props.graphdata}></Locate>
      )}
      <button onClick={() => handleSaveGraph(props.graphdata)}>Save</button>
      <button onClick={() => setShowQuery((prev) => !prev)}>
        {showQuery ? "Close Select Box" : "Show Select Box"}
      </button>
      <button onClick={() => setPopUp((prev) => !prev)}>Edit Graph</button>
      <div className="row">
        <div className="Forcegraph3D">
          {hoverNode ? (
            <div
              style={{
                position: "absolute",
                left: mousePosition.current.x,
                top: mousePosition.current.y,
                width: "40%",
                height: "30%",
                color: "#ffffff",
                backgroundColor: "#ffffff",
                zIndex: 999,
                borderRadius: "10px",
                backgroundColor: gradientList[2].backgroundColor,
                backgroundImage: gradientList[2].backgroundImage, // "linear-gradient(to right, rgb(25, 22, 84), rgb(67, 198, 172)"
              }}
            >
              <ReactEChartsCore
                style={{ width: "100%", height: "100%", display: "flex" }}
                echarts={echarts}
                option={optionGraph}
                notMerge={true}
                lazyUpdate={true}
                theme={"theme_name"}
              />
            </div>
          ) : (
            <></>
          )}
          <ForceGraph3D
            ref={fgRef}
            width={"50%"}
            height={"50%"}
            graphData={props.graphdata}
            nodeLabel="id"
            backgroundColor={props.darkmode ? "#000000" : "#ffffff"}
            // style={{backgroundImage:"linear-gradient(90deg, #74EBD5 0%, #9FACE6 100%)"}}
            // backgroundImage="linear-gradient(90deg, #74EBD5 0%, #9FACE6 100%)"
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
              if (handleNodesShape(node.id)) {
                return sprite;
              }
              return false;
            }}
            onNodeClick={(node) =>
              handleClick(props.graphdata.nodes, node.id)()
            }
            onNodeHover={(node, prevNode) => {
              if (node === null) {
                if (hoverNode) {
                  setHoverNode(false);
                }
              } else if (prevNode === null) {
                axios
                  .post("http://localhost:9002/query/id", { id: node.id })
                  .then((res) => {
                    console.log(res.data);
                    const response = res.data;
                    if (response.success && response.result) {
                      axios
                        .post(
                          "http://192.168.100.214:9000/brickapi/v1/graphql/async",
                          {
                            query: `query {
                            timeseriesbyprefername(pointName: "${node.id.replaceAll(
                              "_",
                              " "
                            )}", limit: 100) {
                              time
                              value
                            }
                          }`,
                            variables: {},
                          },
                          {
                            headers: {
                              "Content-Type": "application/json",
                            },
                          }
                        )
                        .then((res) => {
                          console.log(res.data.data.timeseriesbyprefername);
                          return res.data.data.timeseriesbyprefername;
                        })
                        .then((res) => {
                          setOptionGraph({
                            color: ["#FFFFFF"],
                            title: {
                              text: node.id,
                              textStyle: {
                                color: "#FFFFFF",
                                fontSize: 14,
                              },
                              left: "center",
                            },
                            tooltip: {
                              trigger: "axis",
                              axisPointer: {
                                type: "cross",
                                label: {
                                  backgroundColor: "#6a7985",
                                },
                              },
                            },
                            xAxis: {
                              type: "category",
                              data: res.map((ele) =>
                                dateFormat(ele.time, "mm-dd\n   HH:MM   ")
                              ), //"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
                              axisLabel: {
                                textStyle: {
                                  color: "white",
                                },
                              },
                              lineStyle: { color: "#d5ceeb" },
                            },
                            yAxis: {
                              type: "value",
                              axisLabel: {
                                textStyle: {
                                  color: "white",
                                },
                              },
                              splitLine: {
                                lineStyle: {
                                  color: "#372261",
                                },
                              },
                              lineStyle: { color: "#d5ceeb" },
                            },
                            series: [
                              {
                                data: res.map((ele) => ele.value),
                                type: "line",
                                smooth: true,
                              },
                            ],
                          });
                        })
                        .then((res) => setHoverNode(true));
                    }
                  });
              }
              // setHoverNode((prev) => !prev)
              // hoverNode.current = !hoverNode.current
              // console.log(hoverNode.current)
              console.log(node, prevNode);
            }}
            onNodeRightClick={(node) => {
              handleNodeClick(node.id, props.graphdata.nodes);
              return node.id;
            }}
          ></ForceGraph3D>
        </div>
        {showQuery && (
          <div className="QueryNew">
            {" "}
            | <Link to="/">Back to homepage</Link> | <ListPoints></ListPoints>
            <Queries
              searchpath={props.searchpath}
              handleClick={handleClick}
              nodes={props.graphdata.nodes}
              handleSearchpath={props.handleSearchpath}
            ></Queries>
          </div>
        )}
        {/* <div style={{backgroundColor:"white"}}>222</div> */}
      </div>
      {popUp && (
        <div
          className="popup-box"
          style={{
            position: "fixed",
            background: "#00000050",
            width: "100%",
            height: "100vh",
            top: 0,
            left: 0,
            zIndex: "999",
          }}
        >
          <div
            className="box"
            style={{
              position: "relative",
              width: "80%",
              margin: "0 auto",
              minHeight: "300px",
              height: "auto",
              maxHeight: "800px",
              marginTop: "calc(95vh - 80vh - 60px)",
              background: "#fff",
              borderRadius: "4px",
              padding: "20px",
              border: "1px solid #999",
              overflow: "auto",
              zIndex: "10",
            }}
          >
            <button onClick={() => props.updateGraph({ nodes: [], links: [] })}>
              Clear Graph
            </button>
            <button onClick={handlePopUp}>CLose</button>
            <MyForm
              onSubmit={props.updateGraph}
              graph={props.graphdata}
              setPopUp={handlePopUp}
            ></MyForm>
          </div>
        </div>
      )}
    </>
  );
}, callback);

export default Graph3D;
