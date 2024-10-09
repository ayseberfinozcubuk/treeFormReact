import React, { useState } from 'react';
import { Button } from 'primereact/button'; // PrimeReact Button
import '../Style/Style.css'; // CSS import
import 'primeicons/primeicons.css';
import { PrimeIcons } from 'primereact/api';

const DynamicForm = ({ data, formValues, setFormValues, path = '', indentLevel = 0 }) => {
    const [subForms, setSubForms] = useState([]); // Array to hold multiple form instances
    const [listSubForms, setListSubForms] = useState({}); // State for List-type subforms
    const [listClicked, setListClicked] = useState({}); // Track the click status for each ListType field

    const handleChange = (propertyName, value, index = null) => {
        const updatedValues = { ...formValues };
        const propertyPath = path ? `${path}.${propertyName}` : propertyName;

        if (index !== null) {
            const paths = path ? path.split('.') : [];
            let current = updatedValues;
            paths.forEach(p => {
                if (!current[p]) current[p] = {};
                current = current[p];
            });
            if (!Array.isArray(current[propertyName])) {
                current[propertyName] = [];
            }
            current[propertyName][index] = value;
        } else {
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
        }

        setFormValues(updatedValues);
    };

    const renderInput = (property, name) => {
        const { Name, Label, Type, IsMandatory, MinMax, ListType } = property;

        const indentStyle = {
            marginLeft: `${indentLevel * 20}px`, // PrimeReact tree-like indentation
        };

        // Handle button for ListType elements
        const handleListTypeClick = () => {
            // If the form for this list type is already clicked, do nothing
            if (listClicked[Name]) return;

            fetch(`/SampleData/${ListType}.json`)
                .then((response) => response.json())
                .then((newForm) => {
                    const updatedListSubForms = { ...listSubForms };
                    if (updatedListSubForms[Name]) {
                        updatedListSubForms[Name] = [...updatedListSubForms[Name], newForm];
                    } else {
                        updatedListSubForms[Name] = [newForm];
                    }
                    setListSubForms(updatedListSubForms); // Add the form for ListType

                    // Mark this form as clicked so it doesn't add more subforms on subsequent clicks
                    setListClicked({ ...listClicked, [Name]: true }); // Track clicks for each ListType
                })
                .catch((error) => console.error('Error loading JSON:', error));
        };

        // Check if the type is "List" and show the corresponding button
        if (Type === "List") {
            return (
                <div key={Name} className="list-container" style={indentStyle}>
                    <label className="form-label">{Label}</label>
                    <Button 
                        label={`${Label}`} 
                        type="button" 
                        onClick={handleListTypeClick} // Click to add subform only once
                        className="p-button-rounded p-button-secondary"
                        icon={PrimeIcons.PLUS}
                        style={{ gap: '8px' }} 
                    />

                    {/* Render List subforms if any */}
                    {listSubForms[Name] && listSubForms[Name].map((form, i) => (
                        <div key={i} className="form-border" style={{ marginLeft: '20px' }}>
                            <DynamicForm
                                data={form}
                                formValues={formValues}
                                setFormValues={setFormValues}
                                path={path ? `${path}.${Name}[${i}]` : `${Name}[${i}]`}
                                indentLevel={indentLevel + 1} // Indent further for nested forms
                            />
                        </div>
                    ))}
                </div>
            );
        }

        // Render normal input field
        return (
            <div key={Name} className="form-element" style={indentStyle}>
                <label className="form-label">{Label} {IsMandatory === "yes" && <span>*</span>}</label>
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

    const getFormValue = (propertyName, index = null) => {
        if (!path) return formValues[propertyName] || '';
        const paths = path.split('.');
        let current = formValues;
        for (const p of paths) {
            current = current[p];
            if (!current) return '';
        }
        if (index !== null && Array.isArray(current[propertyName])) {
            return current[propertyName][index] || '';
        }
        return current[propertyName] || '';
    };

    const handleButtonClick = (name) => {
        setSubForms([...subForms, data]);
    };

    return (
        <div>
            {/* Button to add a new main form instance */}
            <Button
                label={data.Name}
                type="button" 
                onClick={handleButtonClick} // Add a new form instance on each click
                className="p-button-rounded p-button-secondary"
                icon={PrimeIcons.PLUS}
                style={{ gap: '8px' }} 
            />

            {/* Render a new form instance for each click */}
            {subForms.map((form, formIndex) => (
                <div key={formIndex} className="form-instance">
                    {form.Properties ? form.Properties.map((property, index) => renderInput(property, index, form.Name)) : null}
                </div>
            ))}
        </div>
    );
};

export default DynamicForm;
