import React, { useEffect, useState } from 'react';
import DynamicForm from './Components/DynamicForm';
import './Style/Style.css'; // CSS dosyasını import et

const App = () => {
    const [sampleData, setSampleData] = useState(null);
    const [formValues, setFormValues] = useState(0); // Formu yeniden oluşturmak için key kullanıyoruz
    const [subForms, setSubForms] = useState({}); // SubForms için de state ekliyoruz

    useEffect(() => {
        fetch('/SampleData/Emiter.json') // JSON dosyasının bulunduğu yolu belirtin
            .then((response) => response.json())
            .then((data) => setSampleData(data))
            .catch((error) => console.error('Error loading JSON:', error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Gönderildi.');

        // Formu yeniden oluşturmak için key'i değiştiriyoruz
        setFormValues({});
        setSubForms({});
    };

    if (!sampleData) {
        return <div>Form Yükleniyor...</div>; // Veriler yüklenene kadar bekleme durumu
    }

    return (
        <div className="form-container">
            <h1>Dinamik Form</h1>
            <form onSubmit={handleSubmit}>
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
    );
};

export default App;
