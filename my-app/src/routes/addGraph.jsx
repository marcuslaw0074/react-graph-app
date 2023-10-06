import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./addGraph.css";
import CSVReader from "./CSVreader";

const Com = ({ list }) => {
  return (
    <ul>
      {list.map((ele) => {
        return <button className="btn btn-secondary btn-sm" key={`${ele}`}>{ele}</button>;
      })}
    </ul>
  );
};

class Pointbutton extends Component {
  render() {
    return (
      <button className="btn btn-secondary btn-sm" onClick={() => this.props.pointbuttonremove(this.props.name)}>
        {this.props.name}
      </button>
    );
  }
}

class Pointbutton2 extends Component {
  render() {
    return (
      <button className="btn btn-secondary btn-sm" onClick={() => this.props.pointbuttonremove_2(this.props.name)}>
        {this.props.name}
      </button>
    );
  }
}


class AddGraph extends Component {
  state = {
    multiValue_equips: [],
    multiValue_equiptypes: [],
    multiValue_syss: [],
    multiValue_locs: [],
    multiValue_alllocs: [],
    multiValue_paras: [],
    multiValue_sysparams: [],
    graph_syss: [],
    graph_locs: [],
    graph_alllocs: [],
    graph_sysparams: [],
    options_syss: [],
    options_locs: [],
    options_alllocs: [],
    options_equips: [],
    options_equiptypes: [],
    options_paras: [],
    options_sysparams: [],
    option_length_syss: 0,
    option_length_locs: 0,
    option_length_alllocs: 0,
    last_option_syss: "",
    last_option_locs: "",
    last_option_alllocs: "",

    start_time: new Date(),
    end_time: null,
    TS_start_time: new Date(),
    TS_end_time: new Date(),

    search_by_keyword: "",
    search_by_keyword2: "",
    filtered_list: [],
    sorted_list: [],
    filtered_list_2: [],
    sorted_list_2: [],

    params_list: [],
    new_equip_name: "",
    skip: 0,

    params_list_bldg: [],
    params_list_brick: [],

    new_brick_point: "",
    point_position: 0,
    add_brick_list: [],

    show_button: false,
    show_system_select: false,
    show_equip_select: true,
  };


  pointbuttonremove = (ele) => {
    var ls = this.state.filtered_list_2;
    ls.push(ele);
    //console.log(ls.length);
    if (this.state.filtered_list.includes(ele)) {
      this.setState({
        filtered_list: this.state.filtered_list.filter(function (e) {
          return e !== ele;
        }),
        filtered_list_2: ls,
        point_position: ls.length,
      });
    }
  };

  pointbuttonremove_2 = (ele) => {
    var ls = this.state.filtered_list;
    var ls2 = this.state.filtered_list_2;
    ls.push(ele);
    //console.log(ls2.length - 1);
    if (this.state.filtered_list_2.includes(ele)) {
      this.setState({
        filtered_list_2: this.state.filtered_list_2.filter(function (e) {
          return e !== ele;
        }),
        filtered_list: ls,
        point_position: ls2.length - 1,
      });
    }
  };

  handleApiPostParamslist = async (equip) => {
    //console.log(equip);
    const result = await axios
      .post(
        "http://192.168.100.214:9000/brickapi/v1/graphql",
        {
          query: `query{
                  parametersEquipstypes(equips: "${equip}"){
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
      .then(function (response) {
        //console.log(response.data.data.parametersEquipstypes);
        return response.data.data.parametersEquipstypes;
      })
      .then((res) =>
        this.setState({
          params_list: res.map((ele) => ele.value),
        })
      );
    return result;
  };

  handleApiPostParamslistWithNames = async (equipname, brick_list) => {
    //console.log(equipname);
    const result = await axios
      .post(
        "http://192.168.100.214:9000/brickapi/v1/graphql",
        {
          query: `query{
                  parametersbrickbldg(equipmentname: "${equipname}"){
                      bldg
                      brick
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
      .then(function (response) {
        //console.log(response.data.data.parametersbrickbldg);
        return response.data.data.parametersbrickbldg;
      })
      .then((res) =>
        this.setState({
          params_list_bldg: res.map((ele) => ele.bldg),
          params_list_brick: res.map((ele) => ele.brick),
          filtered_list_2: res.map((ele) => ele.bldg),
          params_list: res
            .map((ele) => ele.brick)
            .concat(
              brick_list.filter(function (e) {
                return !res.map((ele) => ele.brick).includes(e);
              })
            ),
          point_position: res.map((ele) => ele.bldg).length,
        })
      );

    return result;
  };

  handleApiPostEquips = async (loc, sys) => {
    const result = await axios
      .post(
        "http://192.168.100.214:9000/brickapi/v1/graphql",
        {
          query: `query {
                  allequip7476(location:"${loc}", system:"${sys}"){
                    value
                    label
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
      .then(function (response) {
        return response.data.data.allequip7476;
      })
      .then((res) =>
        this.setState({
          options_equips: res,
        })
      );

    return result;
  };

  handleApiPostEquips_2 = async (loc, sys) => {
    const result = await axios
      .post(
        "http://192.168.100.214:9000/brickapi/v1/graphql",
        {
          query: `query {
                  allequiptype(location:"${loc}", system:"${sys}"){
                    value
                    label
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
      .then(function (response) {
        return response.data.data.allequiptype;
      })
      .then((res) =>
        this.setState({
          options_equiptypes: res,
        })
      );

    return result;
  };

  handleApiPostEquipsType = async (sys) => {
    const result = await axios
      .post(
        "http://192.168.100.214:9000/brickapi/v1/graphql",
        {
          query: `query{
                  sysallequiptype(system:"${sys}"){
                    value
                    label
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
      .then(function (response) {
        return response.data.data.sysallequiptype;
      })
      .then((res) =>
        this.setState({
          options_equiptypes: res,
        })
      );

    return result;
  };

  handleMultiChangeEquips = async (option) => {
    this.setState({
      multiValue_equips: option,
    });

    await this.handleApiPostParas(option);
  };

  handleMultiChangeEquips_2 = async (option) => {
    if (option.length > 0) {
      //console.log(option);
      var val = option[option.length - 1].value;
      //var res = await this.state.options_locs
      //console.log(val)
      val =
        val +
        "-" +
        this.state.multiValue_alllocs[this.state.multiValue_alllocs.length - 1]
          .value +
        "-" +
        "01";
      this.setState({
        multiValue_equiptypes: [option[option.length - 1]],
        new_equip_name: val,
        search_by_keyword: val,
      });

      await this.handleApiPostParamslist(
        option[option.length - 1].value
      );
      //console.log(cc)
    } else {
      this.setState({
        multiValue_equiptypes: [],
      });
    }
  };

  handleApiPostAllLocs = async () => {
    const result = await axios
      .post(
        "http://192.168.100.214:9000/brickapi/v1/graphql",
        {
          query: `query {
                  allloc7476
              }`,
          variables: {},
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        //console.log(JSON.parse(response.data.data.allloc7476));
        return JSON.parse(response.data.data.allloc7476);
      })
      .then((res) =>
        this.setState({
          graph_alllocs: res,
          options_alllocs: res.Location.map((currElement, index) => {
            return { label: currElement, value: currElement };
          }),
        })
      );

    return result;
  };

  handleMultiChangeSyss = async (option) => {
    if (option.length > 0) {
      if (
        Object.keys(this.state.graph_syss).includes(
          option[option.length - 1].value
        )
      ) {
        this.setState({
          multiValue_syss: option,
          options_syss: this.state.graph_syss[
            option[option.length - 1].value
          ].map((currElement, index) => {
            return { label: currElement, value: currElement };
          }),
          option_length_syss: option.length,
          last_option_syss: option[option.length - 1].value,
        });
      } else {
        this.setState({
          multiValue_syss: option,
          options_syss: [],
          option_length_syss: option.length,
          last_option_syss: option[option.length - 1].value,
        });

        await this.handleApiPostLocs(
          option[option.length - 1].value
        );
        //console.log(res);
        //await this.handleApiPostAllLocs();
      }
    } else {
      this.setState({
        multiValue_syss: option,
        options_syss: this.state.graph_syss.System.map((currElement, index) => {
          return { label: currElement, value: currElement };
        }),
        option_length_syss: option.length,
        last_option_syss: "",
      });
    }
  };

  handleMultiChangeSyss_2 = async (option) => {
    if (option.length > 0) {
      if (
        Object.keys(this.state.graph_syss).includes(
          option[option.length - 1].value
        )
      ) {
        this.setState({
          multiValue_syss: option,
          options_syss: this.state.graph_syss[
            option[option.length - 1].value
          ].map((currElement, index) => {
            return { label: currElement, value: currElement };
          }),
          option_length_syss: option.length,
          last_option_syss: option[option.length - 1].value,
        });
      } else {
        this.setState({
          multiValue_syss: option,
          options_syss: [],
          option_length_syss: option.length,
          last_option_syss: option[option.length - 1].value,
        });

        //await this.handleApiPostLocs(option[option.length-1].value);
        await this.handleApiPostAllLocs();
      }
    } else {
      this.setState({
        multiValue_syss: option,
        options_syss: this.state.graph_syss.System.map((currElement, index) => {
          return { label: currElement, value: currElement };
        }),
        option_length_syss: option.length,
        last_option_syss: "",
      });
    }
  };

  handleSkip = () => {
    var ls = this.state.filtered_list_2;
    ls.push(`N/A ${this.state.skip + 1}`);
    this.setState({
      skip: this.state.skip + 1,
      filtered_list_2: ls,
      point_position: ls.length,
    });
  };

  handleAllBrick = (ele) => {
    var ls = this.state.params_list;
    ls.push(ele);
    var ls2 = this.state.add_brick_list;
    ls2.push(ele);
    this.setState({
      params_list: ls,
      add_brick_list: ls2,
    });
  };

  handleMultiChangeLocs_2 = async (option) => {
    if (option.length > 0) {
      if (
        Object.keys(this.state.graph_alllocs).includes(
          option[option.length - 1].value
        )
      ) {
        this.setState({
          multiValue_alllocs: option,
          options_alllocs: this.state.graph_alllocs[
            option[option.length - 1].value
          ].map((currElement, index) => {
            return { label: currElement, value: currElement };
          }),
          option_length_alllocs: option.length,
          last_option_alllocs: option[option.length - 1].value,
        });
      } else {
        this.setState({
          multiValue_alllocs: option,
          options_alllocs: [],
          option_length_alllocs: option.length,
          last_option_alllocs: option[option.length - 1].value,
        });

        //await this.handleApiPostEquips(option[option.length-1].value,this.state.last_option_syss);
        //await this.handleApiPostEquips_2(option[option.length-1].value,this.state.last_option_syss);
        await this.handleApiPostEquipsType(this.state.last_option_syss);

        if (this.state.multiValue_equiptypes.length > 0) {
          this.setState({
            new_equip_name:
              this.state.multiValue_equiptypes[0].value +
              "-" +
              this.state.multiValue_alllocs[
                this.state.multiValue_alllocs.length - 1
              ].value +
              "-" +
              "01",
            search_by_keyword:
              this.state.multiValue_equiptypes[0].value +
              "-" +
              this.state.multiValue_alllocs[
                this.state.multiValue_alllocs.length - 1
              ].value +
              "-" +
              "01",
          });
        }
      }
    } else {
      this.setState({
        multiValue_alllocs: option,
        options_alllocs: this.state.graph_alllocs.Location.map(
          (currElement, index) => {
            return { label: currElement, value: currElement };
          }
        ),
        option_length_alllocs: option.length,
        last_option_alllocs: "",
      });
    }
  };

  handleMultiChangeLocs = async (option) => {
    if (option.length > 0) {
      if (
        Object.keys(this.state.graph_locs).includes(
          option[option.length - 1].value
        )
      ) {
        this.setState({
          multiValue_locs: option,
          options_locs: this.state.graph_locs[
            option[option.length - 1].value
          ].map((currElement, index) => {
            return { label: currElement, value: currElement };
          }),
          option_length_locs: option.length,
          last_option_locs: option[option.length - 1].value,
        });
      } else {
        this.setState({
          multiValue_locs: option,
          options_locs: [],
          option_length_locs: option.length,
          last_option_locs: option[option.length - 1].value,
          show_button: true,
        });

        await this.handleApiPostEquips(
          option[option.length - 1].value,
          this.state.last_option_syss
        );
      }
    } else {
      this.setState({
        multiValue_locs: option,
        options_locs: this.state.graph_locs.Location.map(
          (currElement, index) => {
            return { label: currElement, value: currElement };
          }
        ),
        option_length_locs: option.length,
        last_option_locs: "",
      });
    }
  };

  handleApiPostSyss = async () => {
    const result = await axios
      .post(
        "http://192.168.100.214:9000/brickapi/v1/graphql/async",
        {
          query: `query {
                  allsys
              }`,
          variables: {},
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        return JSON.parse(response.data.data.allsys);
      })
      .then((res) =>
        this.setState({
          graph_syss: res,
          options_syss: res.System.map((currElement, index) => {
            return { label: currElement, value: currElement };
          }),
        })
      );

    return result;
  };

  handleApiPostLocs = async (system) => {
    const result = await axios
      .post(
        "http://192.168.100.214:9000/brickapi/v1/graphql/async",
        {
          query: `query {
                  alllocbysys(system:"${system}")
                }`,
          variables: {},
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        return JSON.parse(response.data.data.alllocbysys);
      })
      .then((res) =>
        this.setState({
          graph_locs: res,
          options_locs: res.Location.map((currElement, index) => {
            return { label: currElement, value: currElement };
          }),
        })
      );

    return result;
  };

  handleApiPostParas = async (equips) => {
    var st = "";
    const ls = equips.map((ele) => {
      return ele.value;
    });
    for (let i = 0; i < ls.length; i++) {
      st = st + `"${ls[i]}",`;
    }
    const result = await axios
      .post(
        "http://192.168.100.214:9000/brickapi/v1/graphql/async",
        {
          query: `query {
                  allparambyequip(equips:[${st.slice(0, -1)}]){
                    value
                    label
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
      .then(function (response) {
        return response.data.data.allparambyequip;
      })
      .then((res) =>
        this.setState({
          options_paras: res,
        })
      );

    return result;
  };

  handleApiPostTimeseries = async (paras) => {
    var st = "";
    const ls = paras.map((ele) => {
      return ele.value;
    });
    for (let i = 0; i < ls.length; i++) {
      st = st + `"${ls[i]}",`;
    }

    const result = await axios
      .post(
        "http://192.168.100.214:9000/brickapi/v1/graphql/async",
        {
          query: `query {
                  timeseriesstend(parameter: [${st.slice(0, -1)}]){
                      start
                      end
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
      .then(function (response) {
        return response.data.data.timeseriesstend;
      })
      .then((res) =>
        this.setState({
          TS_start_time: new Date(res["start"]),
          start_time: new Date(res["start"]),
          TS_end_time: new Date(res["end"]),
          end_time: new Date(res["end"]),
        })
      );

    return result;
  };

  handleMultiChangeParas = async (option) => {
    this.setState({
      multiValue_paras: option,
    });
    await this.handleApiPostTimeseries(option);
  };

  /*componentDidUpdate(_, prevState){
  
          if (this.state.multiValue_syss.map(ele =>{return ele.value}).includes(prevState.last_option_syss)){
  
          } else if (prevState.multiValue_locs.length > 0) {
              this.setState({multiValue_locs: []})
          }; 
          if (this.state.multiValue_locs.map(ele =>{return ele.value}).includes(prevState.last_option_locs)){
  
          } else if (prevState.multiValue_equips.length > 0) {
              this.setState({multiValue_equips: []})
          };
      };    
      */

  handleApiPostResult = async (option, start, end) => {
    //console.log(start);
    //console.log(end);
    //console.log(option);

    this.setState({
      multiValue_paras: [],
    });
  };

  handleApiPostResult_2 = async () => {
    var tablename = "haha2";
    await axios
      .post("http://192.168.100.214:9000/brickapi/v1/mysql/restart1", {
        tablename: tablename,
      })
      .then(function (response) {
        //console.log(response.data.data.sysA[0].subsystemA[0].subsystemA[0].equipmentA[0].equipmentnameA[0].allparametersA);
        //return response.data.data.sysA[0].subsystemA[0].subsystemA[0].equipmentA[0].equipmentnameA[0].allparametersA
        //console.log(response.data)
        return response.data;
      });
  };

  handleApiPostResult_5 = async () => {
    var dbname = "neo4j";
    await axios
      .post("http://192.168.100.214:9000/brickapi/v1/neo4j/cleardb", {
        tablename: dbname,
      })
      .then(function (response) {
        //console.log(response.data.data.sysA[0].subsystemA[0].subsystemA[0].equipmentA[0].equipmentnameA[0].allparametersA);
        //return response.data.data.sysA[0].subsystemA[0].subsystemA[0].equipmentA[0].equipmentnameA[0].allparametersA
        //console.log(response.data)
        return response.data;
      });
  };

  handleApiPostResult_3 = async (value1, value2, filter_ls_2) => {
    //console.log(5724);
    var tablename = "haha2";
    if (value1 !== "" && value2 !== "") {
      const result = await axios
        .post("http://192.168.100.214:9000/brickapi/v1/mysql/select1", {
          name: [`${value1}`, `${value2}`],
          tablename: tablename,
        })
        .then(function (response) {
          //console.log(response.data.data.sysA[0].subsystemA[0].subsystemA[0].equipmentA[0].equipmentnameA[0].allparametersA);
          //return response.data.data.sysA[0].subsystemA[0].subsystemA[0].equipmentA[0].equipmentnameA[0].allparametersA
          //console.log(response.data)
          return response.data;
        });

      this.setState({
        filtered_list: result.filter(function (e) {
          return !filter_ls_2.includes(e);
        }),
      });
    } else if (value1 !== "") {
      const result = await axios
        .post("http://192.168.100.214:9000/brickapi/v1/mysql/select1", {
          name: [`${value1}`],
          tablename: tablename,
        })
        .then(function (response) {
          //console.log(response.data.data.sysA[0].subsystemA[0].subsystemA[0].equipmentA[0].equipmentnameA[0].allparametersA);
          //return response.data.data.sysA[0].subsystemA[0].subsystemA[0].equipmentA[0].equipmentnameA[0].allparametersA
          //console.log(response.data)
          return response.data;
        });
      //console.log(result)

      this.setState({
        filtered_list: result.filter(function (e) {
          return !filter_ls_2.includes(e);
        }),
      });
    }
  };

  /* { equipment:
   *       {brick: "AHU", bldg: "AHU-06-01"},
   *   location:{bldg: "06F"}, or location:{bldg: "AHU-06-01", brick: "06F"}
   *   parameters: [
   *       {brick: "AHU_Water_Supply_Temperature",
   *        bldg:"01/Server 1/RealTimeData/NCU-06-01/SBO Point/MVAC/6F AHU Room 1/AHU-06-01/AHU-06-01.Water Supply Temperature.Value"},
   *       {brick: "AHU_Water_Return_Temperature",
   *        bldg:"01/Server 1/RealTimeData/NCU-06-01/SBO Point/MVAC/6F AHU Room 1/AHU-06-01/AHU-06-01.Water Return Temperature.Value"},
   *       {brick: "AHU_Supply_Air_Flowrate",
   *        bldg:"01/Server 1/RealTimeData/NCU-06-01/SBO Point/MVAC/6F AHU Room 2/AHU-06-02/AHU-06-02.S.A. Flowrate.Value"},
   *                ]}*/

  /**{ "equipment": {"brick": "AHU", "bldg": "AHU-06-01"}, "location":{"bldg": "06F"}, "parameters": [{"brick": "AHU_Water_Supply_Temperature", "bldg":"01/Server 1/RealTimeData/NCU-06-01/SBO Point/MVAC/6F AHU Room 1/AHU-06-01/AHU-06-01.Water Supply Temperature.Value"}, {"brick": "AHU_Water_Return_Temperature", "bldg":"01/Server 1/RealTimeData/NCU-06-01/SBO Point/MVAC/6F AHU Room 1/AHU-06-01/AHU-06-01.Water Return Temperature.Value"}, {"brick": "AHU_Supply_Air_Flowrate", "bldg":"01/Server 1/RealTimeData/NCU-06-01/SBO Point/MVAC/6F AHU Room 2/AHU-06-02/AHU-06-02.S.A. Flowrate.Value"}]
          } */

  handleApiPostTransmap = async (res_dict) => {
    const result = await axios
      .post("http://192.168.100.214:9000/brickapi/v1/neo4j/transmap", res_dict)
      .then(function (response) {
        //console.log(response.data.data.sysA[0].subsystemA[0].subsystemA[0].equipmentA[0].equipmentnameA[0].allparametersA);
        //return response.data.data.sysA[0].subsystemA[0].subsystemA[0].equipmentA[0].equipmentnameA[0].allparametersA
        //console.log(response.data)
        return response.data;
      });
    return result
  };

  handleApiPostTest = async () => {
    const result = await axios
      .post("http://192.168.100.216:9001/book", { hga: "gheajhfa" })
      .then(function (response) {
        //console.log(response.data.data.sysA[0].subsystemA[0].subsystemA[0].equipmentA[0].equipmentnameA[0].allparametersA);
        //return response.data.data.sysA[0].subsystemA[0].subsystemA[0].equipmentA[0].equipmentnameA[0].allparametersA
        //console.log(response.data)
        return response.data;
      });
    return result;
  };

  handleApiPostResult_4 = async (
    location,
    equipmenttype,
    equipmentname,
    bricklist,
    bldglist
  ) => {
    bldglist = bldglist.map((ele) => {
      return ele.replace(/\s/g, "_");
    });
    //console.log(bldglist);
    var paramslist = bricklist.map((ele, i) => {
      return { brick: ele, bldg: bldglist[i] };
    });
    //console.log(paramslist);
    paramslist = paramslist
      .map((ele) => {
        return typeof ele.bldg !== "undefined" ? ele : 1;
      })
      .filter(function (ele) {
        return ele !== 1;
      });

    const resu = {
      equipment: {
        brick: equipmenttype,
        bldg: equipmentname,
      },
      location: {
        bldg: location,
      },
      parameters: paramslist,
    };
    //console.log(resu);

    await this.handleApiPostTransmap(resu);

    return {
      equipment: {
        brick: equipmenttype,
        bldg: equipmentname,
      },
      location: {
        bldg: location,
      },
      parameters: paramslist,
    };
  };

  handleDateChangeStart = (date) => {
    this.setState({
      start_time: date,
      end_time: date,
    });
  };

  handleDateChangeEnd = (date) => {
    this.setState({ end_time: date });
  };

  handleClickSystem = () => {
    this.setState({
      show_system_select: true,
      show_equip_select: false,
    });
  };

  handleClickEquip = () => {
    this.setState({
      show_system_select: false,
      show_equip_select: true,
    });
  };

  handleMultiChange = () => {};

  handelShowButton = () => {
    this.setState({
      show_button: true,
    });
  };

  handleClear = () => {
    this.setState({
      multiValue_equips: [],
      multiValue_equiptypes: [],
      multiValue_syss: [],
      multiValue_locs: [],
      multiValue_alllocs: [],
      multiValue_paras: [],
      multiValue_sysparams: [],
      graph_syss: [],
      graph_locs: [],
      graph_alllocs: [],
      graph_sysparams: [],
      options_syss: [],
      options_locs: [],
      options_alllocs: [],
      options_equips: [],
      options_equiptypes: [],
      options_paras: [],
      options_sysparams: [],
      option_length_syss: 0,
      option_length_locs: 0,
      option_length_alllocs: 0,
      last_option_syss: "",
      last_option_locs: "",
      last_option_alllocs: "",

      start_time: new Date(),
      end_time: null,
      TS_start_time: new Date(),
      TS_end_time: new Date(),

      search_by_keyword: "",
      search_by_keyword2: "",
      filtered_list: [],
      sorted_list: [],
      filtered_list_2: [],
      sorted_list_2: [],

      params_list: [],
      new_equip_name: "",
    });
  };

  updateinput = async (e) => {
    this.setState({
      search_by_keyword: e.target.value,
    });
    //await this.handleApiPostResult_3(e.target.value);
    //console.log(e.target.value);
  };

  updateinput2 = async (e) => {
    this.setState({
      search_by_keyword2: e.target.value,
    });
    //await this.handleApiPostResult_3(e.target.value);
    //console.log(e.target.value);
  };

  updateinput_2 = async (e) => {
    this.setState({
      new_equip_name: e.target.value,
    });
    //await this.handleApiPostResult_3(e.target.value);
    //console.log(e.target.value);
  };

  updateinput_3 = async (e) => {
    //console.log(e.target.value);
    this.setState({
      new_brick_point: e.target.value,
    });
    //await this.handleApiPostResult_3(e.target.value);
    //console.log(e.target.value);
  };

  render() {
    return (
      <div className="container1">
        <ul>
          <div>
            <button
              onClick={this.handleApiPostSyss}
              className="btn btn-secondary btn-sm"
            >
              Click to start query
            </button>
            <button
              onClick={this.handleClear}
              className="btn btn-secondary btn-sm"
            >
              Restart
            </button>
            <button
              onClick={() => this.handleApiPostResult_2()}
              className="btn btn-secondary btn-sm"
            >
              Clear MySQL
            </button>
            <button
              onClick={() => this.handleApiPostResult_5()}
              className="btn btn-secondary btn-sm"
            >
              Clear neo4J
            </button>
            <label>Choose_systems_here_______________________________</label>
            <Select
              className="select11"
              name="filters"
              placeholder="Systems"
              value={this.state.multiValue_syss}
              options={this.state.options_syss}
              onChange={this.handleMultiChangeSyss_2}
              isMulti
            />
          </div>
          <div>
            <label>Choose_Locations_here_______________________________</label>
            <Select
            className="select11"
              name="filters"
              placeholder="Locations"
              value={this.state.multiValue_alllocs}
              options={this.state.options_alllocs}
              onChange={this.handleMultiChangeLocs_2}
              isMulti
            />
          </div>
          <div>
            <label>
              Choose_Equipmenttype_here_______________________________
            </label>
            <Select
            className="select11"
              name="filters"
              placeholder="Equipmenttypes"
              value={this.state.multiValue_equiptypes}
              options={this.state.options_equiptypes}
              onChange={this.handleMultiChangeEquips_2}
              isMulti
            />
          </div>
          <span>Step 1. match </span>
          <div>
            <span>Enter your equipment name here</span>
            <input
              value={this.state.new_equip_name}
              onChange={(ele) => this.updateinput_2(ele)}
            ></input>
            <button
              onClick={() =>
                this.handleApiPostParamslistWithNames(
                  this.state.new_equip_name,
                  this.state.params_list
                )
              }
              className="btn btn-secondary btn-sm"
            >
              Search
            </button>
          </div>
          <span>Filter your list here</span>
          <input
            value={this.state.search_by_keyword}
            onChange={(ele) => this.updateinput(ele)}
          ></input>
          <input
            value={this.state.search_by_keyword2}
            onChange={(ele) => this.updateinput2(ele)}
          ></input>
          <button
            onClick={() =>
              this.handleApiPostResult_3(
                this.state.search_by_keyword,
                this.state.search_by_keyword2,
                this.state.filtered_list_2
              )
            }
            className="btn btn-secondary btn-sm"
          >
            Filters
          </button>
          <span>
            Now Choosing {this.state.params_list[this.state.point_position]}
          </span>
          <div></div>
          <div className="center-col_2">
            <span>Client's filtered Data Points List</span>
            <ul>
              {this.state.filtered_list.map((ele) => {
                //console.log(ele);
                return (
                  <Pointbutton
                    key={`${ele}`}
                    pointbuttonremove={this.pointbuttonremove}
                    name={`${ele}`}
                  >
                    {ele}
                  </Pointbutton>
                );
              })}
            </ul>
          </div>
          <div className="center-col_2">
            <button
              onClick={() => this.handleSkip()}
              className="btn btn-secondary btn-sm"
            >
              Skip
            </button>
            <ul>
              {this.state.filtered_list_2.map((ele) => {
                //console.log(ele);
                return (
                  <Pointbutton2
                    key={`${ele}`}
                    pointbuttonremove_2={this.pointbuttonremove_2}
                    name={`${ele}`}
                  >
                    {ele}
                  </Pointbutton2>
                );
              })}
            </ul>
          </div>
          <div className="center-col_2">
            <input
              value={this.state.new_brick_point}
              onChange={(ele) => this.updateinput_3(ele)}
            ></input>
            <button
              onClick={() => this.handleAllBrick(this.state.new_brick_point)}
              className="btn btn-secondary btn-sm"
            >
              Add Brick points
            </button>
            <Com list={this.state.params_list}></Com>
          </div>
          <div>
            <button
              onClick={() =>
                this.handleApiPostResult_4(
                  this.state.multiValue_alllocs[
                    this.state.multiValue_alllocs.length - 1
                  ].value,
                  this.state.multiValue_equiptypes[
                    this.state.multiValue_equiptypes.length - 1
                  ].value,
                  this.state.new_equip_name,
                  this.state.params_list,
                  this.state.filtered_list_2
                )
              }
              className="btn btn-secondary btn-sm"
            >
              Submit
            </button>
          </div>

          <span>
            {" "}
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            Test whether data entered correctly
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          </span>

          <button
            onClick={this.handleApiPostSyss}
            className="btn btn-secondary btn-sm"
          >
            Click to start query
          </button>
          <div>
            <label>Choose_systems_here_______________________________</label>
            <Select
            className="select11"
              name="filters"
              placeholder="Systems"
              value={this.state.multiValue_syss}
              options={this.state.options_syss}
              onChange={this.handleMultiChangeSyss}
              isMulti
            />
          </div>
          <div>
            <label>Choose_Locations_here_______________________________</label>
            <Select
            className="select11"
              name="filters"
              placeholder="Locations"
              value={this.state.multiValue_locs}
              options={this.state.options_locs}
              onChange={this.handleMultiChangeLocs}
              isMulti
            />
          </div>
          <div>
            {this.state.show_button && (
              <>
                <button
                  onClick={this.handleClickEquip}
                  className="btn btn-secondary btn-sm"
                >
                  Choose Equipemnt Parameters
                </button>
                <button
                  onClick={this.handleClickSystem}
                  className="btn btn-secondary btn-sm"
                >
                  Choose system Parameters
                </button>
              </>
            )}
          </div>
          <div>
            {this.state.show_system_select && (
              <div>
                <label>
                  Choose_System_Parameters_here______________________
                </label>
                <Select
                className="select11"
                  name="filters"
                  placeholder="System_parameters"
                  value={this.state.multiValue_equips}
                  options={this.state.options_equips}
                  onChange={this.handleMultiChangeEquips}
                  isMulti
                />
              </div>
            )}
          </div>
          <div>
            {this.state.show_equip_select && (
              <>
                <div>
                  <label>
                    Choose_Equipments_here_______________________________
                  </label>
                  <Select
                  className="select11"
                    name="filters"
                    placeholder="Equipments"
                    value={this.state.multiValue_equips}
                    options={this.state.options_equips}
                    onChange={this.handleMultiChangeEquips}
                    isMulti
                  />
                </div>
                <div>
                  <label>
                    Choose_Equipment_Parameters_here_______________________________
                  </label>
                  <Select
                  className="select11"
                    name="Parameters"
                    placeholder="Parameters"
                    value={this.state.multiValue_paras}
                    options={this.state.options_paras}
                    onChange={this.handleMultiChangeParas}
                    isMulti
                  />
                </div>
                <div>
                  <span>Timeseries Start time</span>
                  <DatePicker
                    selected={this.state.start_time}
                    onChange={this.handleDateChangeStart}
                    includeDateIntervals={[
                      {
                        start: this.state.TS_start_time,
                        end: this.state.TS_end_time,
                      },
                    ]}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                  <span>Timeseries End time</span>
                  <DatePicker
                    selected={this.state.end_time}
                    onChange={this.handleDateChangeEnd}
                    includeDateIntervals={[
                      {
                        start: this.state.start_time,
                        end: this.state.TS_end_time,
                      },
                    ]}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                </div>
              </>
            )}
          </div>
          <div>
            <button
              onClick={() =>
                this.handleApiPostResult(
                  this.state.multiValue_paras,
                  this.state.start_time,
                  this.state.end_time
                )
              }
              className="btn btn-secondary btn-sm"
            >
              Submit
            </button>
          </div>
        </ul>
      </div>
    );
  }
}

function AddGraphs() {
  return (
    <>
    <Link to="/">Back to homepage</Link>
    <CSVReader></CSVReader>
    <AddGraph></AddGraph>
    </>
  )
}

export default AddGraphs;