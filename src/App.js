import React, { useEffect, useState } from 'react';
import DynamicForm from './Components/DynamicForm';
import './Style/Style.css'; // CSS dosyasını import et

const App = () => {
    const [sampleData, setSampleData] = useState(null);
    const [formValues, setFormValues] = useState(0); 
    const [subForms, setSubForms] = useState({}); 
    const [formKey, setFormKey] = useState(0);

    useEffect(() => {
        fetch('/SampleData/Emiter.json') // JSON dosyasının bulunduğu yolu belirtin
            .then((response) => response.json())
            .then((data) => setSampleData(data))
            .catch((error) => console.error('Error loading JSON:', error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Verileri:', formValues);
        
        // Formu yeniden oluşturmak için key'i değiştiriyoruz
        setFormValues({});
        setSubForms({});
        setFormKey(prevKey => prevKey + 1); // Key değerini artırarak formu sıfırlıyoruz
    };

    if (!sampleData) {
        return <div>Form Yükleniyor...</div>; // Veriler yüklenene kadar bekleme durumu
    }

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Dinamik Form Sistemi</h1>
                <p>Bu formu doldurarak verilerinizi bize iletin.</p>
            </header>
            <div className="form-container">
                <h1>Dinamik Form</h1>
                <form onSubmit={handleSubmit} key={formKey}>
                    <DynamicForm
                        data={sampleData}
                        formValues={formValues}
                        setFormValues={setFormValues} 
                        subForms={subForms}
                        setSubForms={setSubForms}
                    />
                    <button type="submit" className="submit-button">Gönder</button>
                </form>
            </div>
        </div>
    );
};

export default App;
