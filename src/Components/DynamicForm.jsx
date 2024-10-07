import React, { useState } from 'react';
import '../Style/Style.css'; // CSS dosyasını import et

const DynamicForm = ({ data, formValues, setFormValues, path = '', indentLevel = 0 }) => {
    const [subForms, setSubForms] = useState({});
    const [showListTypeButton, setShowListTypeButton] = useState({});

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

    const handleListClick = (listType, propertyName) => {
        fetch(`/SampleData/${listType}.json`)
            .then((response) => response.json())
            .then((newForm) => {
                const updatedSubForms = { ...subForms };

                if (updatedSubForms[propertyName]) {
                    updatedSubForms[propertyName] = [...updatedSubForms[propertyName], newForm];
                } else {
                    updatedSubForms[propertyName] = [newForm];
                }

                setSubForms(updatedSubForms);
            })
            .catch((error) => console.error('Error loading JSON:', error));
    };

    const renderInput = (property) => {
        const { Name, Label, Type, IsMandatory, MinMax, ListType } = property;

        const indentStyle = {
            marginLeft: `${indentLevel * 20}px`, // PrimeReact tree yapısına benzer bir indentation
        };

        const handleLabelClick = () => {
            setShowListTypeButton((prevState) => ({
                ...prevState,
                [Name]: true, 
            }));
        };

        const handleListTypeClick = () => {
            handleListClick(ListType, Name); 
        };

        if (Type === "List") {
            return (
                <div key={Name} className="list-container" style={indentStyle}>
                    <label className="form-label">{Label}</label>
                    <button type="button" onClick={handleLabelClick}>
                        {Label} ekle
                    </button>

                    {/* Label eklenince yanına {ListType} ekle butonu gösteriliyor */}
                    {showListTypeButton[Name] && (
                        <div className="list-type-container" style={{ marginLeft: '20px' }}>
                            <label className="form-label">{ListType}</label>
                            <button type="button" onClick={handleListTypeClick}>
                                {ListType} ekle
                            </button>
                        </div>
                    )}

                    {/* Alt form render edilmesi */}
                    {subForms[Name] && subForms[Name].map((form, i) => (
                        <div key={i} className="form-border" style={{ marginLeft: '20px' }}>
                            <DynamicForm
                                data={form}
                                formValues={formValues}
                                setFormValues={setFormValues}
                                path={path ? `${path}.${Name}[${i}]` : `${Name}[${i}]`}
                                indentLevel={indentLevel + 1} // Her seviye için bir tab daha içeri
                            />
                        </div>
                    ))}
                </div>
            );
        }

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

    return (
        <div>
            {data.Properties.map((property, index) => renderInput(property, index))}
        </div>
    );
};

export default DynamicForm;
