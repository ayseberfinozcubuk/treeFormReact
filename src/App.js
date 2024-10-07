import React, { useEffect, useState } from 'react';
import DynamicForm from './Components/DynamicForm';
import './Style/Style.css'; // CSS dosyasını import et

const App = () => {
    const [sampleData, setSampleData] = useState(null);
    const [formValues, setFormValues] = useState({});

    useEffect(() => {
        fetch('/SampleData/Emiter.json')
            .then((response) => response.json())
            .then((data) => setSampleData(data))
            .catch((error) => console.error('Error loading JSON:', error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Tüm Form Verileri:', formValues);
        setFormValues({});
    };

    if (!sampleData) {
        return <div>Form Yükleniyor...</div>;
    }

    return (
        <div className="form-container">
            <h1>Dinamik Form</h1>
            <form onSubmit={handleSubmit}>
                <DynamicForm
                    data={sampleData}
                    formValues={formValues}
                    setFormValues={setFormValues}
                />
                <button type="submit" className="submit-button">Gönder</button>
            </form>
        </div>
    );
};

export default App;
