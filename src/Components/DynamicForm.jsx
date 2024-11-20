import React, { useEffect, useState, useRef } from "react";
import InputForm from "./InputForm";
import ListForm from "./ListForm";
import DeleteButton from "./DeleteButton";
import { useFormStore } from "../store/useFormStore";
import { getNestedValue } from "../utils/utils.js";
import { v4 as uuidv4 } from "uuid";

const DynamicForm = ({
  entityName,
  path = "",
  indentLevel = 0,
  onRemove,
  isEditMode,
  parentId,
  parentName,
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [entityId, setEntityId] = useState(null);
  const entityIdSet = useRef(false); // Ref to track if entityId has been set

  const {
    formData,
    formValues,
    updateFormValues,
    addIdToFormValues,
    removeFormSection,
  } = useFormStore();

  useEffect(() => {
    if (
      !entityIdSet.current &&
      (formValues[path === "" ? `${path}` : `${path}.Id`] === null ||
        formValues[path === "" ? `${path}` : `${path}.Id`] === undefined)
    ) {
      const newId = uuidv4();
      setEntityId(newId);

      /*
      console.log(
        "entityId: ",
        newId,
        " for ",
        entityName,
        " with path: ",
        path,
        " entityIdSet.current: ",
        entityIdSet.current
      );
      */

      entityIdSet.current = true;

      addIdToFormValues(path, newId); // Add ID to formValues after setting it in local state
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const entity = formData[entityName];
    if (entity) {
      setData(entity);
    } else {
      setError("Entity not found.");
    }
    setLoading(false);
  }, [entityName, formData]);

  // New useEffect to handle updating parent ID if needed
  useEffect(() => {
    // console.log("data: ", data);
    if (data && parentId) {
      // console.log("parentName: ", parentName); // Emitter
      const parentProperty = data.Properties.find(
        (property) => property.Name === `${parentName}Id`
      );

      if (parentProperty) {
        const currentPath =
          path !== "" ? `${path}.${parentProperty.Name}` : parentProperty.Name;
        const currentValue = getNestedValue(formValues, currentPath);

        /*
        console.log(
          "current path: ",
          currentPath, // Modes[0].EmitterId
          " current value: ",
          currentValue
        );
        */

        if (currentValue === undefined || currentValue === null) {
          /*
          console.log(
            "added parentId to: ",
            currentPath,
            " parent: ",
            parentName,
            " parentId: ",
            parentId
          );
          */

          updateFormValues(currentPath, parentId);
        }
      }
    }
  }, [data, parentId, parentName, formValues, path, updateFormValues]);

  const handleDelete = () => {
    removeFormSection(path);
    setIsVisible(false);
    onRemove && onRemove();
  };

  if (!isVisible) {
    return null;
  }

  const renderInput = (property) => {
    if (property.Type === "list") {
      return (
        <ListForm
          key={property.Name}
          property={property}
          path={path}
          entityId={entityId}
          entityName={entityName}
          indentLevel={indentLevel}
          isEditMode={isEditMode}
        />
      );
    }

    if (property.Type !== "Guid") {
      return (
        <InputForm
          entityName={entityName}
          key={property.Name}
          property={property}
          path={path}
          indentLevel={indentLevel}
          isEditMode={isEditMode}
        />
      );
    }

    return null; // Render nothing if the type is Guid and does not match parentName
  };

  return (
    <div className="relative p-6 pt-12 border border-gray-200 rounded-md bg-white shadow-md">
      <DeleteButton
        onClick={handleDelete}
        className={isEditMode ? "visible" : "hidden"}
        style={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}
      />
      {data?.Properties.map(renderInput)}
    </div>
  );
};

export default DynamicForm;
