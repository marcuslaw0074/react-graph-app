import React from "react";
import "./App.css";
import Graph from "./components/graph";
import { Outlet, Link } from "react-router-dom";

function App() {
  return (
    <div>
      <Link to="/examples">Example Graphs</Link> |{" "}
      <Link to="/testapi">Api Testing</Link> |{" "}
      <Link to="/addgraph">Add graph</Link> |{" "}
      <Link to="/animation">Animation</Link> |{" "}
      <Link to="/animationbrick">AnimationBrick</Link> |{" "}
      <Link to="/samplegraph">Sample</Link> |{" "}
      <a href="http://192.168.100.214:7475">Neo4j Database</a>
      {/* 192.168.100.214:27474 */}
      <Outlet />
      <Graph></Graph>
    </div>
  );
}

export default App;
