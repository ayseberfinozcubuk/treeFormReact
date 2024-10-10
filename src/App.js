// App.js
import React from "react";
import DynamicForm from "./Components/DynamicForm";
import "./Style.css";

const App = () => {
  const jsonPath = "/SampleData/EmiterNodePri.json"; // Example JSON file path

  return (
    <div className="app-container">
      <DynamicForm jsonPath={jsonPath} />
    </div>
  );
};

export default App;
