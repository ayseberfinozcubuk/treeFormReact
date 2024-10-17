import React, { useState } from "react";
import FormButton from "./FormButton";
import ExtendShrinkButton from "./ExtendShrinkButton";
import DynamicForm from "./DynamicForm";
import { useFormStore } from "../store/useFormStore";
import { v4 as uuidv4 } from "uuid";

const ListForm = ({ property, path, parentId, indentLevel }) => {
  const { formData, subForms, addSubForm } = useFormStore();
  const { Name, Label, ListType } = property;
  const [storeButtons, setStoreButtons] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const entity = formData[ListType]; // Use dictionary lookup

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleAddListClick = () => {
    if (!isExpanded) {
      handleToggle();
    }

    const newId = uuidv4();
    setStoreButtons((prevState) => [...prevState, newId]);
    setIsClicked(true);
  };

  const handleAddStoreClick = (storeId) => {
    addSubForm(Name, `/SampleData/${ListType}.json`, `${parentId}.${storeId}`);
  };

  return (
    <div style={{ marginLeft: `${indentLevel * 20}px` }}>
      <div className="flex items-center mb-2">
        <label>{Label}</label>
        <div className="ml-2">
          <ExtendShrinkButton isExtended={isExpanded} onToggle={handleToggle} />
        </div>
        <FormButton
          label={`Add ${Name}`}
          icon="pi pi-plus"
          onClick={handleAddListClick}
          disabled={isClicked}
          className="ml-2"
        />
      </div>

      <div className={isExpanded ? "visible" : "hidden"}>
        {storeButtons.map((storeId) => (
          <div key={storeId} style={{ marginTop: "10px" }}>
            <FormButton
              label={`Add ${ListType}`}
              icon="pi pi-plus"
              onClick={() => handleAddStoreClick(storeId)}
              className="ml-4"
            />
            {subForms[`${parentId}.${storeId}`]?.[Name]?.map((formPath, i) => (
              <DynamicForm
                key={i}
                entityName={ListType}
                path={`${path}.${Name}[${i}]`}
                parentId={`${parentId}.${storeId}.${Name}[${i}]`}
                indentLevel={indentLevel + 1}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListForm;
