import React, { useState } from 'react';
import '../Style/Style.css'; // CSS dosyasını import et

const DynamicForm = ({ data, formValues, setFormValues, path = '' }) => {
    const [subForms, setSubForms] = useState({});

    const handleChange = (propertyName, value) => {
        const updatedValues = { ...formValues };
        const propertyPath = path ? `${path}.${propertyName}` : propertyName;

        if (path) {
            const paths = path.split('.');
            let current = updatedValues;
            paths.forEach((p, index) => {
                if (!current[p]) current[p] = {};
                if (index === paths.length - 1) {
                    current[p][propertyName] = value;
                }
                current = current[p];
            });
        } else {
            updatedValues[propertyName] = value;
        }

        setFormValues(updatedValues);
    };

    const handleListClick = (listType, propertyName) => {
        fetch(`/SampleData/${listType}.json`)
            .then((response) => response.json())
            .then((newForm) => {
                setSubForms({
                    ...subForms,
                    [propertyName]: newForm
                });
            })
            .catch((error) => console.error('Error loading JSON:', error));
    };

    const renderInput = (property) => {
        const { Name, Label, Type, IsMandatory, MinMax, ListType } = property;

        if (Type === "List") {
            return (
                <div key={Name} className="list-container">
                    <label>{Label}</label>
                    <button type="button" onClick={() => handleListClick(ListType, Name)}>
                        {Label} Ekle
                    </button>

                    {subForms[Name] && (
                        <div className="form-border">
                            <DynamicForm
                                data={subForms[Name]}
                                formValues={formValues}
                                setFormValues={setFormValues}
                                path={path ? `${path}.${Name}` : Name}
                            />
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div key={Name} className="form-element">
                <label>{Label} {IsMandatory === "yes" && <span>*</span>}</label>
                <input
                    type={Type === "Double" ? "number" : "text"}
                    min={MinMax?.Min}
                    max={MinMax?.Max}
                    required={IsMandatory === "yes"}
                    value={getFormValue(Name) || ''}
                    onChange={(e) => handleChange(Name, e.target.value)}
                />
                {MinMax && <small>Min: {MinMax.Min}, Max: {MinMax.Max}</small>}
            </div>
        );
    };

    const getFormValue = (propertyName) => {
        if (!path) return formValues[propertyName];
        const paths = path.split('.');
        let current = formValues;
        for (const p of paths) {
            current = current[p];
            if (!current) return '';
        }
        return current[propertyName];
    };

    return (
        <div>
            {data.Properties.map((property) => renderInput(property))}
        </div>
    );
};

export default DynamicForm;
