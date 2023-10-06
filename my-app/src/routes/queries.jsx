const data = [
  {
    query: [
      `match (p)-[r:subClassOf]->(m) where exists((p)-[:subClassOf*]->(:brick {name:'System'})) return p,r,m`,
    ],
    title: "System",
    uid: 1,
  },
  {
    query: [
      `match (p)-[r:subClassOf]->(m) where exists((p)-[:subClassOf*]->(:brick {name:'Location'})) return p,r,m`,
    ],
    title: "Location",
    uid: 2,
  },
  {
    query: [
      `match (p)-[r:subClassOf]->(m) where not m.name="Virtual_Point" return p,r,m`,
      `match (p)-[r:isPartOf]->(y)-[:subClassOf*]->(d{name:"System"}) return p,r,y`,
    ],
    title: "System, Location & Equipment",
    uid: 3,
  },
  {
    query: [`match (p)-[r:isPartOf]->(m) where m.name="AHU" return p,r,m`],
    title: "AHU & Point Type",
    uid: 4,
  },
  {
    query: [`match (p)-[r:isPartOf]->(m) where m.name="VAV" return p,r,m`],
    title: "VAV & Point Type",
    uid: 5,
  },
  {
    query: [`match (p)-[r:isPartOf]->(m) where m.name="PAU" return p,r,m`],
    title: "PAU & Point Type",
    uid: 6,
  },
  {
    query: [`match (p)-[r:isPartOf]->(m) where m.name="FCU" return p,r,m`],
    title: "FCU & Point Type",
    uid: 7,
  },
  {
    query: [`match (p)-[r:isPartOf]->(m) where m.name="EAF" return p,r,m`],
    title: "EAF & Point Type",
    uid: 8,
  },
  {
    query: [`match (p)-[r:isPartOf]->(m) where m.name="FAF" return p,r,m`],
    title: "FAF & Point Type",
    uid: 9,
  },
  {
    query: [`match (p)-[r:isPartOf]->(m) where m.name="Chiller" return p,r,m`],
    title: "Chiller & Point Type",
    uid: 10,
  },
  {
    query: [
      `match (p)-[r:subClassOf]->(m) where m.name="Virtual_Point" return p,r,m`,
    ],
    title: "Virtual_Point",
    uid: 11,
  },
  {
    query: [
      `match (p)-[r:isPartOf]->(m) where m.name="FDD_AHU" return p,r,m`,
    ],
    title: "FDD Rules",
    uid: 12,
  },
];

export default function getData() {
  return data;
}
