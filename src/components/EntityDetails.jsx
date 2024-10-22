import React from "react";
import { useParams } from "react-router-dom";
import { useEntityStore } from "../store/useEntityStore"; // Access the Zustand store
import { Accordion, AccordionTab } from "primereact/accordion"; // For hierarchical display

const EntityDetails = ({ rootEntity }) => {
  const { id } = useParams(); // Get the entity ID from the URL
  const { selectedEntity } = useEntityStore(); // Access selected entity from the store

  // Recursive function to render the object and array structure
  const renderContent = (data) => {
    if (Array.isArray(data)) {
      // Render array elements with collapsible accordion for lists
      return (
        <Accordion>
          {data.map((item, index) => (
            <AccordionTab key={index} header={`Array Item ${index + 1}`}>
              {renderContent(item)} {/* Recursively render array items */}
            </AccordionTab>
          ))}
        </Accordion>
      );
    } else if (typeof data === "object" && data !== null) {
      // Render object fields
      return (
        <div className="p-4 border border-gray-300 rounded shadow">
          {Object.keys(data).map((key) => (
            <div key={key} className="flex flex-col mb-2">
              <div className="flex justify-between">
                <strong>{key}:</strong>
                {typeof data[key] === "object" && !Array.isArray(data[key]) ? (
                  <div className="ml-4 flex-1">{renderContent(data[key])}</div> // Recursive for nested objects
                ) : Array.isArray(data[key]) ? (
                  <div className="ml-4 flex-1">{`[Array of ${data[key].length} items]`}</div> // Display array summary
                ) : (
                  <div className="ml-4 flex-1">{String(data[key])}</div> // Render primitive values
                )}
              </div>
              {Array.isArray(data[key]) && (
                <div className="ml-4 mt-2">{renderContent(data[key])}</div> // Render arrays below the key
              )}
            </div>
          ))}
        </div>
      );
    } else {
      // Render primitive values
      return <div>{String(data)}</div>;
    }
  };

  if (!selectedEntity) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl w-full p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Details of {rootEntity}
        </h2>
        {renderContent(selectedEntity)}
      </div>
    </div>
  );
};

export default EntityDetails;
