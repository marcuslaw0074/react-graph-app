import React, { Component } from "react";
import axios from "axios";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import "./select.css";

class Queries extends Component {
  state = {
    multiValue_equips: [],
    multiValue_syss: [],
    multiValue_locs: [],
    multiValue_paras: [],
    graph_syss: [],
    graph_locs: [],
    options_syss: [],
    options_locs: [],
    options_equips: [],
    options_paras: [],
    option_length_syss: 0,
    option_length_locs: 0,
    last_option_syss: "",
    last_option_locs: "",

    start_time: new Date(),
    end_time: null,
    TS_start_time: new Date(),
    TS_end_time: new Date(),

    show_loc: false,
    show_equip: false,
    show_param: false,
  };

  componentDidMount = () => {
    axios
      .post(
        "http://localhost:9002/graphql/",
        {
          query: `query {
                allsys {
                  links {
                    target
                    source
                  }
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
        return response.data.data.allsys.links;
      })
      .then((res) => {
        const groupByTarget = res.reduce((group, product) => {
          const { target } = product;
          group[target] = group[target] ?? [];
          group[target].push(product.source);
          return group;
        }, {});
        //console.log(groupByTarget);
        this.setState({
          graph_syss: groupByTarget,
          options_syss: groupByTarget.System.map((currElement, index) => {
            return { label: currElement, value: currElement };
          }),
        });
      });
  };

  handleApiPostEquips = async (loc, sys) => {
    const result = await axios
      .post(
        "http://localhost:9002/graphql/",
        {
          query: `query {
                allequipbysysloc(location:"${loc}", system:"${sys}"){
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
        return response.data.data.allequipbysysloc;
      })
      .then((res) =>
        this.setState({
          options_equips: res,
        })
      );

    return result;
  };

  handleMultiChangeEquips = async (option) => {
    this.props.handleSearchpath({ equipment: option.map((ele) => ele.label) });
    this.setState({
      multiValue_equips: option,
      show_param: true,
    });

    await this.handleApiPostParas(option);
  };

  handleMultiChangeSyss = async (option) => {
    option = await option;
    if (option.length > 0) {
      if (
        Object.keys(this.state.graph_syss).includes(
          option[option.length - 1].value
        )
      ) {
        this.props.handleSearchpath({ system: option.map((ele) => ele.label) });
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
        this.props.handleSearchpath({ system: option.map((ele) => ele.label) });
        this.setState({
          multiValue_syss: option,
          options_syss: [],
          option_length_syss: option.length,
          last_option_syss: option[option.length - 1].value,
          show_loc: true,
        });

        await this.handleApiPostLocs(option[option.length - 1].value);
      }
    } else {
      this.props.handleSearchpath({ system: option.map((ele) => ele.label) });
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

  handleMultiChangeLocs = async (option) => {
    if (option.length > 0) {
      if (
        Object.keys(this.state.graph_locs).includes(
          option[option.length - 1].value
        )
      ) {
        this.props.handleSearchpath({
          location: option.map((ele) => ele.label),
        });
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
        this.props.handleSearchpath({
          location: option.map((ele) => ele.label),
        });
        this.setState({
          multiValue_locs: option,
          options_locs: [],
          option_length_locs: option.length,
          last_option_locs: option[option.length - 1].value,
          show_equip: true,
        });

        await this.handleApiPostEquips(
          option[option.length - 1].value,
          this.state.last_option_syss
        );
      }
    } else {
      this.props.handleSearchpath({ location: option.map((ele) => ele.label) });
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

  handleApiPostLocs = async (system) => {
    const result = await axios
      .post(
        "http://localhost:9002/graphql/",
        {
          query: `query {
                alllocbysys(system:"${system}") {
                  links {
                    source
                    target
                  }
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
        return response.data.data.alllocbysys.links;
      })
      .then((res) => {
        const groupByTarget = res.reduce((group, product) => {
          const { target } = product;
          group[target] = group[target] ?? [];
          group[target].push(product.source);
          return group;
        }, {});
        this.setState({
          graph_locs: groupByTarget,
          options_locs: groupByTarget.Location.map((currElement, index) => {
            return { label: currElement, value: currElement };
          }),
        });
      });

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
        "http://localhost:9002/graphql/",
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
        "http://localhost:9002/graphql/",
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
    this.props.handleSearchpath({ parameter: option.map((ele) => ele.label) });
    this.setState({
      multiValue_paras: option,
    });
    await this.handleApiPostTimeseries(option);
  };

  handleApiPostResult = async (option, start, end) => {
    this.setState({
      multiValue_paras: [],
    });
  };

  render() {
    return (
      <div className="container">
        <ul>
          <div>
            <label className="label1">Choose_systems</label>
            <Select
              className="selectt"
              name="filters"
              placeholder="Systems"
              value={this.state.multiValue_syss}
              options={this.state.options_syss}
              onChange={async (option) => {
                await this.handleMultiChangeSyss(option);
                this.props.handleClick(
                  this.props.nodes,
                  this.props.searchpath[this.props.searchpath.length - 1]
                )(); /*this.props.searchpath[this.props.searchpath.length-1], option.map(ele => ele.label)[option.length-1] */
              }}
              isMulti
            />
          </div>
          {this.state.show_loc && (
            <div>
              <label className="label1">Choose_Locations</label>
              <Select
                className="selectt"
                name="filters"
                placeholder="Locations"
                value={this.state.multiValue_locs}
                options={this.state.options_locs}
                onChange={async (option) => {
                  await this.handleMultiChangeLocs(option);
                  this.props.handleClick(
                    this.props.nodes,
                    this.props.searchpath[this.props.searchpath.length - 1]
                  )();
                }}
                isMulti
              />
            </div>
          )}
          {this.state.show_equip && (
            <div>
              <label className="label1">Choose_Equipments</label>
              <Select
                className="selectt"
                name="filters"
                placeholder="Equipments"
                value={this.state.multiValue_equips}
                options={this.state.options_equips}
                onChange={async (option) => {
                  await this.handleMultiChangeEquips(option);
                  this.props.handleClick(
                    this.props.nodes,
                    this.props.searchpath[this.props.searchpath.length - 1]
                  )();
                }}
                isMulti
              />
            </div>
          )}
          {this.state.show_param && (
            <div>
              <label className="label1">Choose_Equipment_Parameters</label>
              <Select
                className="selectt"
                name="Parameters"
                placeholder="Parameters"
                value={this.state.multiValue_paras}
                options={this.state.options_paras}
                onChange={async (option) => {
                  await this.handleMultiChangeParas(option);
                  this.props.handleClick(
                    this.props.nodes,
                    this.props.searchpath[this.props.searchpath.length - 1]
                  )();
                }}
                isMulti
              />
            </div>
          )}
          <div>
            {this.state.show_param && (
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
            )}
          </div>
        </ul>
      </div>
    );
  }
}

export default Queries;
