import React, { useEffect, useState, useRef } from "react";
import FormButton from "./FormButton";
import ExtendShrinkButton from "./ExtendShrinkButton";
import DynamicForm from "./DynamicForm";
import { useFormStore } from "../store/useFormStore";
import { v4 as uuidv4 } from "uuid";

const ListForm = ({ property, path, entityId, isEditMode }) => {
  const { formValues } = useFormStore();
  const { Name, Label, ListType } = property;
  const [storeForms, setStoreForms] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const effectExecutedRef = useRef(false);

  useEffect(() => {
    const keyPrefix = `${path}.${Name}`.replace(/^\./, "");
    const arrayLength = getArrayLength(keyPrefix);

    if (effectExecutedRef.current) return;

    if (!isEditMode && arrayLength > 0) {
      const initialForms = Array.from({ length: arrayLength }).map(
        (_, index) => {
          const storeId = uuidv4();
          const uniqueFormPath = `${keyPrefix}[${index}]`;
          return { id: storeId, path: uniqueFormPath, key: storeId };
        }
      );

      setStoreForms(initialForms);
      effectExecutedRef.current = true;
    }
  }, [isEditMode, formValues, path, Name]);

  const getArrayLength = (keyPrefix) => {
    let count = 0;
    while (
      Object.keys(formValues).some((key) =>
        key.startsWith(`${keyPrefix}[${count}]`)
      )
    ) {
      count++;
    }
    return count;
  };

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleAddListClick = () => {
    if (!isExpanded) {
      handleToggle();
    }
    handleAddStoreClick();
  };

  const handleAddStoreClick = () => {
    const storeId = uuidv4();
    const uniqueFormPath = `${path}.${Name}[${storeForms.length}]`;
    setStoreForms((prevForms) => [
      ...prevForms,
      { id: storeId, path: uniqueFormPath, key: storeId },
    ]);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center mb-4">
        <label className="text-sm text-gray-700 font-medium">{Label}</label>
        <div className="ml-2">
          <ExtendShrinkButton isExtended={isExpanded} onToggle={handleToggle} />
        </div>

        <FormButton
          label={`${Label} Ekle`}
          icon="pi pi-plus"
          onClick={handleAddListClick}
          className={`ml-2 ${!isEditMode ? "hidden" : "visible"}`}
        />
      </div>

      <div className={isExpanded ? "visible" : "hidden"}>
        {storeForms.map((form, index) => (
          <div key={form.key} style={{ marginTop: "10px" }}>
            <DynamicForm
              entityName={ListType}
              path={form.path}
              parentId={entityId}
              isEditMode={isEditMode}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListForm;
