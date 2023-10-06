import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import JsonEditor from "./jsonEditer";

class TestButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graph: {
        nodes: [],
        links: [],
      },
      count: 0,
      result: "",
      graphRedis: [],
    };
    this.handelAPIPost = this.handelAPIPost.bind(this);
  }

  componentDidMount = () => {
    console.log(5392);
  };

  /**
     {
        statements: [
          {
            statement: `match (p)-[r:isPartOf]->(m) where m.name="WCC-25-01" return p,r,m`,
          },
        ],
      }
     */
  handelAPIPost = async () => {
    //const ls = ["Virtual_Point"];
    await axios
      .post("http://192.168.100.214:9000/brickapi/v1/graphql/async", {
        query: `query {
            point1: timeseriesbyprefername(limit:1,pointName:"AHU-05-01.Flow_Status.Status"){
              prefername
              time
              value
            }
            point2: timeseriesbyprefername(limit:1,pointName:"AHU-05-01.CO2_Concentration_Setpoint.Value"){
              prefername
              time
              value
            }
            point3: timeseriesbyprefername(limit:1,pointName:"AHU-05-01.S.A._Temperature_Setpoint.Value"){
              prefername
              time
              value
            }
          }
          `,
      })
      .then(function (response) {
        console.log(response.data);
        return response.data;
      })
      .then((res) =>
        this.setState({
          result: res,
        })
      );
    this.setState((count) => {
      return count + 1;
    });
  };

  handleGetGraph = async () => {
    axios
      .post("http://localhost:9002/redis/graph", { number: 1 })
      .then((res) => {
        return res.data.data;
      })
      .then((res) => {
        console.log(res);
        this.setState((prev) => {
          return {
            ...prev,
            graphRedis: res.links.slice(1, 3),
          };
        });
      });
  };

  handleClick = () => {
    this.setState((count) => {
      return count + 1;
    });
  };

  render() {
    console.log(this.state.graphRedis);
    return (
      <div>
        {false && JSON.stringify(this.state.result)}
        <button className="Button1" onClick={this.handleGetGraph}>
          TEST
        </button>
        <JsonEditor graph={{ data: this.state.graphRedis }}></JsonEditor>
        <Link to="/">Back to homepage</Link>
      </div>
    );
  }
}

export default TestButton;
