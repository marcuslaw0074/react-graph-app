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

function handleNodesColor(st) {
  if (st.includes('FDD')) {
    return "#ce7e23";
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
    ].includes(st)
  ) {
    return "#9655ff";
  } else if (st.includes("EnergySys")) {
    return "#9655ff";
  }
  if (["Chiller_CoP", "Chilled_Chilled_Water_Pump_Delta_Temperature", "CT_Approach_Temperature", "CT_Wet_Bulb", "Virtual_Point", "Chiller_Cooling_Load"].includes(st)) {
    return "#00f7da";
  } else if (st.includes("_")) {
    return "#49f87e";
  }
  if ([...floorList, ...floorList2].includes(st)) {
    return "#f821a2";
  }
  if (/\d/.test(st.replace("CO2", ""))) {
    if (st.length > 15) {
      return "#af4c66";
    };
    if (st.includes("VIP")) {
      return "#af4c66";
    };
    return "#21a2f8";
  } else {
    if (st.includes("System") || ['Location', 'Room', 'Zone', 'Building', 'Floor', 'Class', 'Points', 'Status', 'Sensor','Setpoint', 'Outdoor_Area', ].includes(st)) {
      return "#bdce23";
    } 
    return "#49f87e";
  }
}

function handleLinksColor(darkmode) {
  return darkmode? "#ffffff": "#000000";
}

export const handleNodesColour = handleNodesColor;
export const handleLinksColour = handleLinksColor;
export const floorLists = floorList;
export const floorLists2 = floorList2;