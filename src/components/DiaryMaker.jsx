import React, { useState } from 'react';

const DiaryMaker = ({ initialData, onPreview, onGenerateLink }) => {
    const [data, setData] = useState(initialData);
    const [currentStep, setCurrentStep] = useState(0);
    const [generatedUrl, setGeneratedUrl] = useState('');

    const handleInputChange = (section, field, value, index = null) => {
        const newData = { ...data };
        if (index !== null) {
            newData.memories[index][field] = value;
        } else {
            newData[section][field] = value;
        }
        setData(newData);
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const handleGenerate = () => {
        const url = onGenerateLink(data);
        setGeneratedUrl(url);
    };

    const steps = [
        {
            title: "Step 1: The Intro Spread (Pehla Page)",
            content: (
                <div className="form-step">
                    <div className="memory-step-grid">
                        <div className="input-group">
                            <label>Diary Ka Title (e.g., Hamara Safar ❤️)</label>
                            <input type="text" placeholder="Apni kahani ka ek pyara sa title do" value={data.intro.title} onChange={(e) => handleInputChange('intro', 'title', e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label>Aaj Ki Date (e.g., Feb 14, 2026)</label>
                            <input type="text" placeholder="Special date yahan likho" value={data.intro.date} onChange={(e) => handleInputChange('intro', 'date', e.target.value)} />
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Left Page: Lambi Wali Story (Long Message)</label>
                        <textarea rows="4" placeholder="Yahan wo sab likho jo tum dil se kehna chahte ho..." value={data.intro.leftText} onChange={(e) => handleInputChange('intro', 'leftText', e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Right Page: Pyari Si Poem ya Closing Message</label>
                        <textarea rows="3" placeholder="Choti si shayari ya ending message" value={data.intro.poem} onChange={(e) => handleInputChange('intro', 'poem', e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Small Note (Kone mein likhne ke liye - e.g., Love You!)</label>
                        <input type="text" placeholder="Short and sweet note" value={data.intro.marginalia} onChange={(e) => handleInputChange('intro', 'marginalia', e.target.value)} />
                    </div>
                </div>
            )
        },
        ...data.memories.map((m, i) => ({
            title: `Step ${i + 2}: Yaad ${i + 1} (Memory Details)`,
            content: (
                <div className="form-step">
                    <div className="memory-step-grid">
                        <div className="input-group">
                            <label>Yaad Ka Title (e.g., Pehli Baar Milestone)</label>
                            <input type="text" placeholder="Is pal ko kya naam dena chahoge?" value={m.title} onChange={(e) => handleInputChange('memories', 'title', e.target.value, i)} />
                        </div>
                        <div className="input-group">
                            <label>Kab Hua Tha? (Date)</label>
                            <input type="text" placeholder="E.g., May 20, 2024" value={m.date} onChange={(e) => handleInputChange('memories', 'date', e.target.value, i)} />
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Is Yaad Ke Bare Mein Kuch Likho (Message)</label>
                        <textarea rows="4" placeholder="Describe this beautiful moment..." value={m.poem} onChange={(e) => handleInputChange('memories', 'poem', e.target.value, i)} />
                    </div>
                    <div className="input-group">
                        <label>Photo Ka Link (Paste image URL here)</label>
                        <input type="text" placeholder="https://example.com/photo.jpg" value={m.image} onChange={(e) => handleInputChange('memories', 'image', e.target.value, i)} />
                    </div>
                    <div className="input-group">
                        <label>Chota Note (Marginalia)</label>
                        <input type="text" placeholder="Anything else?" value={m.marginalia} onChange={(e) => handleInputChange('memories', 'marginalia', e.target.value, i)} />
                    </div>
                </div>
            )
        }))
    ];

    return (
        <div className="maker-container">
            <div className="maker-header">
                <h1 className="maker-title">Diary Maker</h1>
                <p className="maker-subtitle">{steps[currentStep].title}</p>
            </div>

            <div className="maker-content">
                {steps[currentStep].content}
            </div>

            <div className="step-nav">
                {currentStep > 0 ? (
                    <button className="btn-secondary" onClick={prevStep}>Back</button>
                ) : <div />}

                <div className="nav-actions">
                    {currentStep < steps.length - 1 ? (
                        <button className="btn-primary" onClick={nextStep}>Next Step</button>
                    ) : (
                        <div className="final-actions">
                            <button className="btn-secondary" onClick={() => onPreview(data)} style={{ marginRight: '1rem' }}>
                                Preview
                            </button>
                            <button className="btn-primary" onClick={handleGenerate}>
                                Finish & Link
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {generatedUrl && (
                <div className="link-result-card">
                    <h3>Link Generated! 💖</h3>
                    <div className="url-box">{generatedUrl}</div>
                    <button className="btn-primary" onClick={() => { navigator.clipboard.writeText(generatedUrl); alert("Copied!"); }}>
                        Copy Link 📋
                    </button>
                </div>
            )}
        </div>
    );
};

export default DiaryMaker;
