import React, { useState } from 'react';
import '../Style/Style.css'; // CSS dosyasını import et

const DynamicForm = ({ data, formValues, setFormValues, path = '' }) => {
    const [subForms, setSubForms] = useState({}); // Her form alanının altındaki form öğelerini saklamak için

    const handleChange = (propertyName, value, index = null) => {
        const updatedValues = { ...formValues };
        const propertyPath = path ? `${path}.${propertyName}` : propertyName;
    
        if (index !== null) {
            // Eğer bir dizi içindeysek (alt form, liste türü)
            const paths = path ? path.split('.') : [];
            let current = updatedValues;
            paths.forEach(p => {
                if (!current[p]) current[p] = {}; // Eğer yol boyunca obje yoksa başlat
                current = current[p];
            });
            if (!Array.isArray(current[propertyName])) {
                current[propertyName] = []; // Diziyi başlat
            }
            current[propertyName][index] = value; // Değeri güncelle
        } else {
            if (path) {
                const paths = path.split('.');
                let current = updatedValues;
                paths.forEach((p, index) => {
                    if (!current[p]) current[p] = {}; // Eğer obje yoksa başlat
                    if (index === paths.length - 1) {
                        current[p][propertyName] = value; // Tekil elemanlar burada güncellenir
                    }
                    current = current[p];
                });
            } else {
                updatedValues[propertyName] = value; // Tekil elemanlar burada güncellenir
            }
        }
    
        setFormValues(updatedValues);
    };

    const handleListClick = (listType, propertyName) => {
        fetch(`/SampleData/${listType}.json`)
            .then((response) => response.json())
            .then((newForm) => {
                const updatedSubForms = { ...subForms };

                // Eğer propertyName altında zaten bir form dizi varsa, yeni bir form ekliyoruz
                if (updatedSubForms[propertyName]) {
                    updatedSubForms[propertyName] = [...updatedSubForms[propertyName], newForm];
                } else {
                    updatedSubForms[propertyName] = [newForm]; // İlk formu ekliyoruz
                }

                setSubForms(updatedSubForms);
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
    
                    {subForms[Name] && subForms[Name].map((form, i) => (
                        <div key={i} className="form-border">
                            <DynamicForm
                                data={form}
                                formValues={formValues}
                                setFormValues={setFormValues}
                                path={path ? `${path}.${Name}[${i}]` : `${Name}[${i}]`}
                            />
                        </div>
                    ))}
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

    const getFormValue = (propertyName, index = null) => {
        if (!path) return formValues[propertyName] || ''; // Eğer obje yoksa boş string döndür
        const paths = path.split('.');
        let current = formValues;
        for (const p of paths) {
            current = current[p];
            if (!current) return ''; // Eğer current boşsa, hemen döneriz
        }
        if (index !== null && Array.isArray(current[propertyName])) {
            return current[propertyName][index] || ''; // Eğer dizi içindeki eleman yoksa boş string döndür
        }
        return current[propertyName] || ''; // Tekil elemanlar için
    };

    return (
        <div>
            {data.Properties.map((property, index) => renderInput(property, index))}
        </div>
    );
};

export default DynamicForm;
