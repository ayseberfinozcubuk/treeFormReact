import React, { useState, useEffect } from "react";
import { useEntityStore } from "../store/useEntityStore";
import FormButton from "./FormButton";
import CancelButton from "./CancelButton";
import ExtendShrinkButton from "./ExtendShrinkButton";

const EntityDetails = ({ rootEntity }) => {
  const {
    selectedEntity,
    updateEntity,
    expandedSections,
    toggleExpandSection,
    resetExpandedSections,
  } = useEntityStore();
  const [isEditing, setIsEditing] = useState(false);
  const [localEntity, setLocalEntity] = useState(selectedEntity);

  // Reset expanded sections (shrink mode) whenever the component is mounted
  useEffect(() => {
    resetExpandedSections();
  }, [resetExpandedSections]);

  const handleInputChange = (path, value) => {
    const updatedEntity = { ...localEntity };
    path.reduce((acc, key, idx) => {
      if (idx === path.length - 1) {
        acc[key] = value;
      } else {
        return acc[key];
      }
    }, updatedEntity);
    setLocalEntity(updatedEntity);
  };

  const handleSave = () => {
    updateEntity(rootEntity, localEntity._id, localEntity);
    setIsEditing(false);
  };

  const isPrimitive = (value) => {
    return (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    );
  };

  const renderValue = (key, value, parentKey = "") => {
    if (Array.isArray(value)) {
      return (
        <div className="ml-4">
          {value.map((item, index) => {
            const uniqueKey = `${parentKey}_${key}_${index}`;
            return (
              <div key={uniqueKey} className="mb-2">
                <div className="flex items-center">
                  <ExtendShrinkButton
                    isExtended={expandedSections[uniqueKey] || false}
                    onToggle={() => toggleExpandSection(uniqueKey)}
                  />
                  <strong>
                    {key} {index + 1}:
                  </strong>
                </div>
                {expandedSections[uniqueKey] && (
                  <div className="pl-4">{renderNested(item, uniqueKey)}</div>
                )}
              </div>
            );
          })}
        </div>
      );
    }
    return value;
  };

  const renderNested = (data, parentKey = "") => {
    return (
      <div className="ml-4">
        {Object.entries(data).map(([key, value]) => {
          const uniqueKey = `${parentKey}_${key}`;
          return (
            <div key={uniqueKey} className="mb-4">
              <div className="flex items-center">
                {Array.isArray(value) && (
                  <ExtendShrinkButton
                    isExtended={expandedSections[uniqueKey] || false}
                    onToggle={() => toggleExpandSection(uniqueKey)}
                  />
                )}
                <strong className="font-bold">{key}:</strong>

                {/* Render primitive types inline */}
                {isPrimitive(value) && !isEditing && (
                  <span className="ml-2">{value}</span>
                )}

                {/* Render input for primitive types in edit mode */}
                {isPrimitive(value) && isEditing && (
                  <input
                    className="border p-2 rounded w-full ml-2"
                    type="text"
                    value={value || ""}
                    onChange={(e) => handleInputChange([key], e.target.value)}
                  />
                )}
              </div>

              {/* Render non-primitive types below */}
              {!isPrimitive(value) &&
                (!Array.isArray(value) || expandedSections[uniqueKey]) && (
                  <div className="pl-4">
                    {isEditing && !isPrimitive(value) ? (
                      <input
                        className="border p-2 rounded w-full"
                        type="text"
                        value={value || ""}
                        onChange={(e) =>
                          handleInputChange([key], e.target.value)
                        }
                      />
                    ) : (
                      <div className="pl-4">
                        {renderValue(key, value, uniqueKey)}
                      </div>
                    )}
                  </div>
                )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {isEditing ? "Edit" : "View"} {rootEntity} Details
        </h2>
        <FormButton
          onClick={() => setIsEditing(!isEditing)}
          label={isEditing ? "Switch to View Mode" : "Switch to Edit Mode"}
        />
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        {renderNested(localEntity)}
      </div>

      {isEditing && (
        <div className="mt-6 flex justify-between">
          <FormButton onClick={handleSave} label="Save Changes" />
          <CancelButton onClick={() => setIsEditing(false)} label="Cancel" />
        </div>
      )}
    </div>
  );
};

export default EntityDetails;
