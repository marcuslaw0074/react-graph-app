import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import TestButton from "./components/testAPI";
import "./index.css";

import GraphExamples from "./routes/example";
import AddGraph from "./routes/addGraph";
import getData from "./routes/queries";
import CameraOrbit from "./routes/animation"
import CameraOrbit2 from "./routes/animationBrick"
import SampleGraph from "./components/sampleGraph"

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}></Route>
        <Route path="examples" element={GraphExamples(getData())} />
        <Route path="addgraph" element={<AddGraph></AddGraph>} />
        <Route path="samplegraph" element={<SampleGraph></SampleGraph>} />
        <Route path="animation" element={<CameraOrbit></CameraOrbit>} />
        <Route path="animationbrick" element={<CameraOrbit2></CameraOrbit2>} />
        <Route path="testapi" element={<TestButton></TestButton>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
