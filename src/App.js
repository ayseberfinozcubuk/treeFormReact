import React, { useEffect, useState } from 'react';
import DynamicForm from './Components/DynamicForm';
import './Style/Style.css';

const App = () => {
    const [sampleData, setSampleData] = useState(null);
    const [formInstances, setFormInstances] = useState([]); // Keep multiple form instances

    useEffect(() => {
        fetch('/SampleData/EmiterNodePri.json')
            .then((response) => response.json())
            .then((data) => setSampleData(data))
            .catch((error) => console.error('Error loading JSON:', error));
    }, []);

    const handleAddNewForm = () => {
        const newInstance = {
            key: Date.now(), // Unique key for each form
            formValues: {}, // Default empty form values for new instance
        };
        setFormInstances([...formInstances, newInstance]);
    };

    const handleSubmit = (e, formValues, instanceKey) => {
        e.preventDefault();
        console.log(`Form instance ${instanceKey} submitted with values:`, formValues);
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Dinamik Form Sistemi</h1>
            </header>
            <div className="form-container">
                {/* Button to add new form instances */}
                <button onClick={handleAddNewForm} className="add-form-button">
                    Yeni Form Ekle
                </button>

                {/* Render each form instance */}
                {formInstances.map((instance) => (
                    <form key={instance.key} onSubmit={(e) => handleSubmit(e, instance.formValues, instance.key)}>
                        <DynamicForm
                            data={sampleData}
                            formValues={instance.formValues}
                            setFormValues={(updatedValues) => {
                                setFormInstances((prevInstances) =>
                                    prevInstances.map(inst => inst.key === instance.key
                                        ? { ...inst, formValues: updatedValues }
                                        : inst
                                    )
                                );
                            }}
                        />
                        <button type="submit" className="submit-button">Gönder</button>
                    </form>
                ))}
            </div>
        </div>
    );
};

export default App;
