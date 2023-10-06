var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");
var neo4j = require('neo4j-driver');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  scalar Datetime

  type Query {
    hello: String
    allsys: Graph
    alllocbysys(system: String!): Graph
    allequipbysysloc(system: String!, location: String): [Labelvaluepair]
    allparambyequip(equips: [String!]): [Labelvaluepair]
    timeseriesstend(parameter: [String!], measurment: String): [Interval]
    timeseriesbyprefername(pointName: String!, limit: Int, starttime: String, endtime: String, measurement: String) : [Timeseries]
  }

  type Graph {
    nodes: [Node]
    links: [Link]
  }

  type Node {
    id: String!
  }

  type Link {
    source: String!
    name: String!
    target: String!
  }

  type Labelvaluepair {
    value: String!
    label: String!
  }

  type Interval {
    start: Datetime!
    end: Datetime!
  }

  type Timeseries {
    time: Datetime!
    Block: String
    BuildingName: String
    EquipmentName: String
    FunctionType: String
    prefername: String
    id: String
    value: String
  }
`);

class Labelvaluepair {
  constructor(value, label) {
    this.value = value
    this.label = label
  }
}

class Node {
  constructor(id){
    this.id = id
  }
}

class Link {
  constructor(source, name, target) {
    this.source = source
    this.name = name
    this.target = target
  }
}

class Graph {
  constructor(listOfTuples){
    this.listOfTuples = listOfTuples
  };

  nodes() {
    var nodelist = [...this.listOfTuples.map(ele => ele[0]), ...this.listOfTuples.map(ele => ele[2])];
    var uniquelist = [...new Set(nodelist)];
    return uniquelist.map(ele => new Node(ele));
  };

  links() {
    return this.listOfTuples.map(ele => new Link(ele[2], ele[1], ele[0]));
  };

};
// 192.168.100.214:27687
var driver = neo4j.driver(
  "bolt://192.168.8.125:7691",
  neo4j.auth.basic("neo4j", "test"),
  {
    maxTransactionRetryTime: 30000,
  }
);

// The root provides a resolver function for each API endpoint
var root = {
  allsys: async () => {
    var query = `MATCH (system:brick {database: "ArupDemo"}) - [r:subClassOf] -> (p:brick)
    WHERE exists((system)-[:subClassOf*]->(:brick {name: 'System'}))
    RETURN p.name as o ,type(r), system.name as s`;
    var session = driver.session({database: 'neo4j'});
    result = await session.readTransaction(txc =>
      txc.run(query)
      ).then(res => {
          var data = res.records.map(ele => { return (ele._fields)});
          console.log(data);
          return data
      });
    return new Graph(result);
  },
  alllocbysys: async ({system}) => {
    var query = `match (b:brick {database: "ArupDemo"})<-[:subClassOf]-(p) WHERE 
    exists((:brick{name:"${system}"})<-[:isLocationOf|isPartOf|isPointOf*]-(p)-[:subClassOf*]->(:brick {name: "Location"})) 
    with collect(p) as p, collect(Distinct b) as b 
    match (f)-[:subClassOf*]->(r) where f in b 
    Unwind r+b as w with collect(DISTINCT w) as w, p+w as x 
    Unwind x as qq with collect (qq) as x 
    match (c)-[r:subClassOf]->(s) where c in x and s in x return s.name as o,type(r) as r, c.name as s`;
    var session = driver.session({database: 'neo4j'});
    result = await session.readTransaction(txc =>
      txc.run(query)
      ).then(res => {
          var data = res.records.map(ele => { return (ele._fields)});
          console.log(data);
          return data
      });
    return new Graph(result);
  },
  allequipbysysloc: async ({system, location}) => {
    var session = driver.session({database: 'neo4j'});
    if (system == "Energy_System") {
      var query = `match (p:brick {database: "ArupDemo"})-[:hasPart]->(d)
      -[:hasLocation]->(n:bldg) where p.name="${system}" 
      and n.name="${location}"  return d.name as name`;
      result = await session.readTransaction(txc =>
        txc.run(query)
        ).then(res => {
            var data = res.records.map(ele => { return ele._fields[0]});
            console.log(data);
            return data
        });
      return result.map(ele => new Labelvaluepair(ele, ele))
    };
    var query = `match (m:bldg)-[:isLocationOf]->(p)
    -[:isPointOf]->(j:brick)-[:isPartOf]->(g:brick {database: "ArupDemo"}) 
    where m.name="${location}" and g.name="${system}" return p.name as name`
    result = await session.readTransaction(txc =>
      txc.run(query)
      ).then(res => {
          var data = res.records.map(ele => { return ele._fields[0]});
          console.log(data);
          return data
      });
    return result.map(ele => new Labelvaluepair(ele, ele))
  },
  allparambyequip: async ({equips}) => {
    var totresult = []
    var session = driver.session({database: 'neo4j'});
    for (const equip of equips) {
      if (equip.toLowerCase().includes("energy")) {
        var query = `match (p)-[:isPointOf]->(m) where m.name="${equip}" return p.name as label`
        result = await session.readTransaction(txc =>
          txc.run(query)
          ).then(res => {
              var data = res.records.map(ele => { return ele._fields[0]});
              console.log(data);
              return data
          });
        totresult = [...totresult, ...result.map(ele => new Labelvaluepair(ele, ele))]
      } else {
        var query = `match (s)-[:hasPoint]->(p)-[:isPartOf]->(m) where m.name="${equip}" return p.name as label`;
        result = await session.readTransaction(txc =>
          txc.run(query)
          ).then(res => {
              var data = res.records.map(ele => { return ele._fields[0]});
              console.log(data);
              return data
          });
        totresult = [...totresult, ...result.map(ele => new Labelvaluepair(ele, ele))]
      };
    }
    return totresult;
  }


};


module.exports = {
  schema,
  root,
};
