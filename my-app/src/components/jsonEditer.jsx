import { JsonEditor as Editor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";
import React from "react";

const JsonEditor = ({graph}) => {
  const [jsonValue, setJsonValue] = React.useState({});

  const handleJsonEdit = (value) => {
    console.log(value);
    setJsonValue(value);
  };
  console.log(graph)

  return <Editor value={jsonValue} onChange={handleJsonEdit} history={true} />;
};

export default JsonEditor;
